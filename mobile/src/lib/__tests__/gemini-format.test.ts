import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  formatClarifyOptionLabel,
  formatDeadlineLabel,
  formatDayKey,
  toLocalIsoWithOffset,
} from '../format.ts';
import { DEFAULT_MODEL, getCandidateModels, hasUsableKey, parseExtractionJson } from '../gemini.ts';

test('candidate models: preferred first, deprecated migrated, no duplicates', () => {
  assert.deepEqual(getCandidateModels('gemini-3.8-flash'), ['gemini-3.8-flash', 'gemini-3-flash-preview', 'gemini-3.5-flash']);
  assert.equal(getCandidateModels('gemini-2.5-flash')[0], DEFAULT_MODEL);
  assert.equal(getCandidateModels(null)[0], DEFAULT_MODEL);
  assert.equal(new Set(getCandidateModels('custom-model')).size, 4);
});

test('hasUsableKey mirrors the PWA length check', () => {
  assert.equal(hasUsableKey(''), false);
  assert.equal(hasUsableKey('   short   '), false);
  assert.equal(hasUsableKey('AIzaSyExampleKey123'), true);
});

test('parseExtractionJson strips code fences and fills missing ids', () => {
  const tasks = parseExtractionJson('```json\n{"tasks":[{"title":"A","deadline_iso":null},{"id":"x","title":"B","deadline_iso":null}]}\n```', 42);
  assert.deepEqual(tasks.map((t) => t.id), ['task_live_42_0', 'x']);
  assert.deepEqual(parseExtractionJson('{}'), []);
});

test('deadline labels: overdue, urgent, normal, unknown', () => {
  const now = new Date(2026, 10, 14, 12, 0);
  assert.equal(formatDeadlineLabel(null, now).text, 'Chưa rõ hạn');
  assert.equal(formatDeadlineLabel(new Date(2026, 10, 14, 10, 5).toISOString(), now).text, 'Quá hạn (14/11 10:05)');
  assert.deepEqual(formatDeadlineLabel(new Date(2026, 10, 15, 8, 0).toISOString(), now), { text: 'Gấp · 08:00 15/11', urgent: true });
  assert.deepEqual(formatDeadlineLabel(new Date(2026, 10, 20, 17, 0).toISOString(), now), { text: '17:00 · 20/11', urgent: false });
});

test('clarify option labels and local ISO offsets', () => {
  assert.equal(formatClarifyOptionLabel(new Date(2026, 10, 20, 17, 0).toISOString()), 'Thứ 6, 20/11 · 17:00');
  assert.equal(formatClarifyOptionLabel({ label: 'Tuần này' }), 'Tuần này');
  assert.match(toLocalIsoWithOffset(new Date(2026, 10, 14, 9, 5, 7)), /^2026-11-14T09:05:07[+-]\d{2}:\d{2}$/);
  assert.equal(formatDayKey(new Date(2026, 0, 5)), '2026-1-5');
});
