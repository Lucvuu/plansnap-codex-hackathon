'use strict';
process.env.TZ = 'Asia/Ho_Chi_Minh';
const test = require('node:test');
const assert = require('node:assert/strict');
global.window = {};
require('../app/js/scheduler.js');
const Scheduler = window.PlanSnapScheduler;

test('tasks over 120 minutes split into balanced 60-90 minute sessions', () => {
  const scheduler = new Scheduler();
  assert.deepEqual(scheduler.splitIntoSessions(120), [120]);
  for (const minutes of [121, 180, 181, 240, 360]) {
    const chunks = scheduler.splitIntoSessions(minutes);
    assert.equal(chunks.reduce((sum, value) => sum + value, 0), minutes);
    assert.ok(chunks.every((value) => value >= 60 && value <= 90));
  }
});

test('EDF schedule has no collisions and respects safe buffer when capacity exists', () => {
  const scheduler = new Scheduler();
  const reference = new Date('2026-11-16T08:00:00+07:00');
  const tasks = [
    { id: 'late', title: 'Late', deadline_iso: '2026-11-22T23:59:00+07:00', estimated_minutes: 180 },
    { id: 'early', title: 'Early', deadline_iso: '2026-11-20T23:59:00+07:00', estimated_minutes: 180 }
  ];
  const events = scheduler.schedule(tasks, null, reference);
  assert.equal(events.length, 4);
  const early = events.filter((event) => event.taskId === 'early');
  assert.ok(new Date(early.at(-1).end) <= new Date('2026-11-20T20:59:00+07:00'));
  assert.ok(early.every((event) => !event.isUrgent));
  for (let index = 1; index < events.length; index++) {
    assert.ok(new Date(events[index - 1].end) <= new Date(events[index].start));
  }
});

test('unsafe but pre-deadline slot is marked urgent', () => {
  const scheduler = new Scheduler();
  const events = scheduler.schedule([
    { id: 'urgent', title: 'Urgent', deadline_iso: '2026-11-16T21:00:00+07:00', estimated_minutes: 60 }
  ], [{ day: 1, start: '19:30', end: '22:30' }], new Date('2026-11-16T08:00:00+07:00'));
  assert.equal(events.length, 1);
  assert.equal(events[0].isUrgent, true);
  assert.equal(events[0].isPastDeadline, false);
  assert.ok(new Date(events[0].end) <= new Date('2026-11-16T21:00:00+07:00'));
});

test('deterministic schedule executes under 5ms for demo-sized input', () => {
  const scheduler = new Scheduler();
  const tasks = Array.from({ length: 12 }, (_, index) => ({
    id: `t${index}`, title: `Task ${index}`,
    deadline_iso: `2026-11-${String(20 + (index % 7)).padStart(2, '0')}T23:59:00+07:00`,
    estimated_minutes: 60 + (index % 3) * 60
  }));
  const start = performance.now();
  scheduler.schedule(tasks, null, new Date('2026-11-16T08:00:00+07:00'));
  assert.ok(performance.now() - start < 5);
});
