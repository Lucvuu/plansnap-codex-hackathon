import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildHandwrittenDemoTask, buildStudentDemoTasks } from '../demo-tasks.ts';
import { scheduleTasks } from '../scheduler.ts';
import { DEFAULT_SLOTS, getEnabledSlotDefs, SLOT_OPTIONS } from '../slots.ts';
import type { SlotMap, Task } from '../types.ts';

// Load the original PWA scheduler (app/js/scheduler.js) in this realm for parity checks.
const here = path.dirname(fileURLToPath(import.meta.url));
const pwaSchedulerSrc = fs.readFileSync(path.resolve(here, '../../../../app/js/scheduler.js'), 'utf8');
const PwaScheduler = new Function('window', `${pwaSchedulerSrc}\nreturn window.PlanSnapScheduler;`)({});
const pwa = new PwaScheduler();

// Same slot expansion as app/js/app.js getEnabledSlotDefs().
function pwaSlotDefs(slots: SlotMap) {
  const defs = [];
  if (slots['weekday-eve']) for (let d = 1; d <= 5; d++) defs.push({ day: d, start: '19:30', end: '22:30' });
  if (slots['sat-morn']) defs.push({ day: 6, start: '08:30', end: '11:30' });
  if (slots['sat-aft']) defs.push({ day: 6, start: '14:00', end: '17:00' });
  if (slots['sun-morn']) defs.push({ day: 0, start: '08:30', end: '11:30' });
  if (slots['sun-aft']) defs.push({ day: 0, start: '14:00', end: '17:00' });
  return defs;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('slot expansion matches the PWA for every toggle combination', () => {
  for (let mask = 0; mask < 32; mask++) {
    const slots = Object.fromEntries(SLOT_OPTIONS.map((o, i) => [o.key, Boolean(mask & (1 << i))])) as SlotMap;
    const sortKey = (d: { day: number; start: string }) => `${d.day}-${d.start}`;
    assert.deepEqual(
      getEnabledSlotDefs(slots).map(sortKey).sort(),
      pwaSlotDefs(slots).map(sortKey).sort(),
    );
  }
});

test('scheduleTasks is identical to the PWA scheduler on 500 random scenarios', () => {
  const rand = mulberry32(20261114);
  const durations = [15, 30, 45, 60, 75, 90, 100, 110, 120, 150, 180, 240, 300];
  for (let scenario = 0; scenario < 500; scenario++) {
    const ref = new Date(2026, 10, 1 + Math.floor(rand() * 60), Math.floor(rand() * 24), Math.floor(rand() * 60));
    const tasks: Task[] = Array.from({ length: 1 + Math.floor(rand() * 7) }, (_, i) => {
      const r = rand();
      return {
        id: `t${i}`,
        title: `Task ${i}`,
        source_quote: `quote ${i}`,
        deadline_iso: r < 0.1 ? null : new Date(ref.getTime() + (rand() * 16 - 1) * 86400000).toISOString(),
        needs_confirmation: rand() < 0.15,
        estimated_minutes: rand() < 0.1 ? undefined : durations[Math.floor(rand() * durations.length)],
        completed: rand() < 0.1,
        fixed_start_iso: rand() < 0.15 ? new Date(ref.getTime() + rand() * 10 * 86400000).toISOString() : undefined,
      };
    });
    const slots = Object.fromEntries(SLOT_OPTIONS.map((o) => [o.key, rand() < 0.75])) as SlotMap;

    const ours = scheduleTasks(tasks, getEnabledSlotDefs(slots), ref);
    const theirs = JSON.parse(JSON.stringify(pwa.schedule(tasks, pwaSlotDefs(slots), ref)));

    assert.deepEqual(ours, theirs, `scenario ${scenario} diverged`);

    for (const ev of ours) {
      assert.ok(ev.sessionIndex <= ev.totalSessions, `scenario ${scenario}: Phiên ${ev.sessionIndex}/${ev.totalSessions}`);
      const expected = ev.totalSessions > 1 ? `[PlanSnap] ${ev.originalTitle} (Phiên ${ev.sessionIndex}/${ev.totalSessions})` : `[PlanSnap] ${ev.originalTitle}`;
      assert.equal(ev.title, expected);
    }
  }
});

test('fragmented windows never produce "Phiên 3/2" and match PWA balanced split', () => {
  // Saturday 14/11/2026 14:08
  const now = new Date(2026, 10, 14, 14, 8);
  const tasks: Task[] = [
    { id: 'quiz', title: 'Quiz', deadline_iso: new Date(2026, 10, 15, 23, 59).toISOString(), estimated_minutes: 45 },
    { id: 'slide', title: 'Slide', deadline_iso: new Date(2026, 10, 17, 8, 0).toISOString(), estimated_minutes: 120 },
    { id: 'essay', title: 'Essay', deadline_iso: new Date(2026, 10, 20, 17, 0).toISOString(), estimated_minutes: 180 },
  ];
  const essay = scheduleTasks(tasks, getEnabledSlotDefs(DEFAULT_SLOTS), now).filter((e) => e.taskId === 'essay');
  const pwaEssay = pwa.schedule(tasks, pwaSlotDefs(DEFAULT_SLOTS), now).filter((e: any) => e.taskId === 'essay');
  assert.deepEqual(pwaEssay.map((e: any) => `${e.sessionIndex}/${e.totalSessions}`), ['1/2', '2/2']);
  assert.deepEqual(essay.map((e) => `${e.sessionIndex}/${e.totalSessions}`), ['1/2', '2/2']);
});

test('fixed_start_iso pins fixed-time schedule even without EDF free slots', () => {
  const fixedStart = new Date(2026, 10, 16, 14, 0, 0);
  const events = scheduleTasks(
    [
      {
        id: 'meet-1',
        title: 'Họp nhóm cố định',
        deadline_iso: new Date(2026, 10, 16, 15, 30, 0).toISOString(),
        fixed_start_iso: fixedStart.toISOString(),
        estimated_minutes: 90,
      },
    ],
    [],
    new Date(2026, 10, 14, 10, 0, 0),
  );
  assert.equal(events.length, 1);
  assert.equal(events[0].isFixed, true);
  assert.equal(events[0].durationMinutes, 90);
  assert.equal(new Date(events[0].start).getTime(), fixedStart.getTime());
});

test('EDF sessions never overlap a fixed-time event (FR-3.3)', () => {
  // Monday 16/11/2026 08:00; the only free window that week night is 19:30–22:30.
  const now = new Date(2026, 10, 16, 8, 0);
  const tasks: Task[] = [
    { id: 'meet', title: 'Họp nhóm', deadline_iso: null, fixed_start_iso: new Date(2026, 10, 16, 20, 0).toISOString(), estimated_minutes: 60 },
    { id: 'essay', title: 'Essay', deadline_iso: new Date(2026, 10, 20, 17, 0).toISOString(), estimated_minutes: 180 },
  ];
  const events = scheduleTasks(tasks, getEnabledSlotDefs(DEFAULT_SLOTS), now);
  const meet = events.find((e) => e.taskId === 'meet')!;
  const sessions = events.filter((e) => e.taskId === 'essay');
  assert.equal(sessions.reduce((sum, e) => sum + e.durationMinutes, 0), 180);
  for (const s of sessions) {
    assert.ok(s.end <= meet.start || s.start >= meet.end, `${s.start}–${s.end} overlaps the fixed meeting`);
  }
  // 21:00–22:30 after the meeting is still usable that evening.
  assert.equal(new Date(sessions[0].start).getTime(), new Date(2026, 10, 16, 21, 0).getTime());
});

test('demo pack schedules the two clear tasks and holds back the ambiguous one', () => {
  const now = new Date(2026, 10, 14, 13, 0); // Saturday 14/11/2026 13:00
  const tasks = buildStudentDemoTasks(now);
  const events = scheduleTasks(tasks, getEnabledSlotDefs(DEFAULT_SLOTS), now);
  const scheduledTaskIds = new Set(events.map((e) => e.taskId));
  assert.equal(scheduledTaskIds.size, 2);
  assert.ok(!scheduledTaskIds.has(tasks[0].id), 'needs_confirmation task must not be scheduled');
  for (const e of events) assert.ok(new Date(e.end) <= new Date(e.deadline_iso!), `${e.title} ends before its deadline`);
  // Sessions never overlap.
  for (let i = 1; i < events.length; i++) assert.ok(new Date(events[i].start) >= new Date(events[i - 1].end));
});

test('handwritten demo task lands tomorrow at 14:00', () => {
  const now = new Date(2026, 10, 14, 9, 30);
  const task = buildHandwrittenDemoTask(now);
  const d = new Date(task.deadline_iso!);
  assert.deepEqual([d.getDate(), d.getHours(), d.getMinutes()], [15, 14, 0]);
});

test('no enabled slots yields an empty schedule', () => {
  const tasks = buildStudentDemoTasks(new Date(2026, 10, 14));
  assert.deepEqual(scheduleTasks(tasks, [], new Date(2026, 10, 14)), []);
});
