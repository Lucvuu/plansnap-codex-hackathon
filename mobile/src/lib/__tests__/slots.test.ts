import assert from 'node:assert/strict';
import { test } from 'node:test';

import { scheduleTasks } from '../scheduler.ts';
import {
  DEFAULT_FREE_SLOTS,
  getEnabledSlotDefs,
  migrateLegacySlots,
  parseStoredSlots,
  repeatLabel,
  sameSlot,
  slotLengthLabel,
  slotSubtitle,
  validateSlot,
} from '../slots.ts';
import type { FreeSlot } from '../types.ts';

const slot = (over: Partial<FreeSlot>): FreeSlot => ({
  id: 'x',
  days: [1],
  start: '19:00',
  end: '21:00',
  enabled: true,
  ...over,
});

test('default windows describe themselves like the v2.2 toggles', () => {
  assert.deepEqual(DEFAULT_FREE_SLOTS.map(slotSubtitle), [
    'Tối · Ngày thường',
    'Sáng · Thứ 7',
    'Chiều · Thứ 7',
    'Sáng · Chủ Nhật',
    'Chiều · Chủ Nhật',
  ]);
  assert.equal(slotSubtitle({ days: [2], start: '12:00' }), 'Trưa · Thứ 3');
  assert.equal(slotSubtitle({ days: [5, 6, 0], start: '20:00' }), 'Tối · T6 T7 CN');
});

test('validation rejects empty days, reversed, too-short and malformed windows', () => {
  assert.equal(validateSlot(slot({})), null);
  assert.match(validateSlot(slot({ days: [] }))!, /ít nhất 1 ngày/);
  assert.match(validateSlot(slot({ start: '21:00', end: '20:00' }))!, /sau giờ bắt đầu/);
  assert.match(validateSlot(slot({ start: '21:00', end: '21:20' }))!, /30 phút/);
  assert.match(validateSlot(slot({ end: '25:00' }))!, /không hợp lệ/);
});

test('legacy toggle map migrates with its on/off state', () => {
  const migrated = migrateLegacySlots({ 'weekday-eve': false, 'sun-aft': true });
  assert.equal(migrated.find((s) => s.id === 'weekday-eve')!.enabled, false);
  assert.equal(migrated.find((s) => s.id === 'sat-morn')!.enabled, true); // missing → on
  assert.equal(migrated.length, 5);
});

test('stored slots are sanitised; non-arrays are rejected', () => {
  assert.equal(parseStoredSlots({ 'weekday-eve': true }), null);
  const parsed = parseStoredSlots([
    { id: 'a', days: [0, 9, 1, 1], start: '08:00', end: '10:00', enabled: true },
    { id: 'b', days: [2], start: '10:00', end: '09:00', enabled: true }, // invalid → dropped
    'junk',
  ])!;
  assert.deepEqual(parsed, [{ id: 'a', days: [1, 0], start: '08:00', end: '10:00', enabled: true }]);
});

test('overlapping and touching windows merge; disabled windows are ignored', () => {
  const defs = getEnabledSlotDefs([
    slot({ id: 'a', days: [1, 2], start: '18:00', end: '20:00' }),
    slot({ id: 'b', days: [1], start: '19:00', end: '21:30' }),
    slot({ id: 'c', days: [1], start: '21:30', end: '22:00' }),
    slot({ id: 'd', days: [1], start: '07:00', end: '08:00', enabled: false }),
  ]);
  assert.deepEqual(defs, [
    { day: 1, start: '18:00', end: '22:00' },
    { day: 2, start: '18:00', end: '20:00' },
  ]);
});

test('overlapping windows never double-book a session', () => {
  const now = new Date(2026, 10, 16, 8, 0); // Monday
  const tasks = Array.from({ length: 4 }, (_, i) => ({
    id: `t${i}`,
    title: `Task ${i}`,
    deadline_iso: new Date(2026, 10, 20, 23, 0).toISOString(),
    estimated_minutes: 90,
  }));
  const events = scheduleTasks(
    tasks,
    getEnabledSlotDefs([
      slot({ id: 'a', days: [1, 2, 3, 4, 5], start: '19:00', end: '22:00' }),
      slot({ id: 'b', days: [1, 2, 3, 4, 5], start: '20:00', end: '23:00' }),
    ]),
    now,
  );
  assert.ok(events.length >= 4);
  for (let i = 1; i < events.length; i++) {
    assert.ok(new Date(events[i].start) >= new Date(events[i - 1].end), 'sessions overlap');
  }
});

test('sameSlot ignores day order', () => {
  assert.ok(sameSlot(slot({ days: [1, 3] }), slot({ days: [3, 1] })));
  assert.ok(!sameSlot(slot({}), slot({ end: '21:05' })));
});

test('Apple-style repeat labels and row subtitles', () => {
  assert.equal(repeatLabel([5, 4, 3, 2, 1]), 'Ngày thường');
  assert.equal(repeatLabel([0, 6]), 'Cuối tuần');
  assert.equal(repeatLabel([0, 1, 2, 3, 4, 5, 6]), 'Mỗi ngày');
  assert.equal(repeatLabel([6]), 'Thứ 7');
  assert.equal(repeatLabel([5, 1, 3]), 'T2 T4 T6');
  assert.equal(repeatLabel([]), 'Không lặp lại');
  assert.equal(slotSubtitle({ days: [1, 2, 3, 4, 5], start: '19:30' }), 'Tối · Ngày thường');
  assert.equal(slotSubtitle({ days: [0], start: '08:30' }), 'Sáng · Chủ Nhật');
});

test('window length labels', () => {
  assert.equal(slotLengthLabel({ start: '19:30', end: '22:30' }), '3 giờ');
  assert.equal(slotLengthLabel({ start: '19:00', end: '20:30' }), '1 giờ 30 phút');
  assert.equal(slotLengthLabel({ start: '19:00', end: '19:45' }), '45 phút');
  assert.equal(slotLengthLabel({ start: '20:00', end: '19:00' }), '');
});
