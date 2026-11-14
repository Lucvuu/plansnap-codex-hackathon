import assert from 'node:assert/strict';
import { test } from 'node:test';

import { escapeIcsText, foldIcsLine, formatIcsDate, generateIcsContent, getGoogleCalendarLink } from '../ical.ts';
import type { ScheduledEvent } from '../types.ts';

const event: ScheduledEvent = {
  id: 'task_1_s1',
  taskId: 'task_1',
  title: '[PlanSnap] Nộp bản cuối tiểu luận Marketing, nhóm 3; bản cuối (Phiên 1/2)',
  originalTitle: 'Nộp bản cuối tiểu luận Marketing, nhóm 3; bản cuối',
  source_quote: 'Hạn nộp bản cuối tiểu luận trước 17h thứ 6 tuần sau nha cả nhóm',
  deadline_iso: '2026-11-20T10:00:00.000Z',
  start: '2026-11-16T12:30:00.000Z',
  end: '2026-11-16T14:00:00.000Z',
  durationMinutes: 90,
  sessionIndex: 1,
  totalSessions: 2,
  isUrgent: false,
  isPastDeadline: false,
};

const utf8Bytes = (s: string) => Buffer.byteLength(s, 'utf8');

test('formatIcsDate emits UTC basic format', () => {
  assert.equal(formatIcsDate('2026-11-16T12:30:00.000Z'), '20261116T123000Z');
});

test('escapeIcsText escapes TEXT special characters', () => {
  assert.equal(escapeIcsText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
});

test('foldIcsLine keeps every physical line within 75 octets and round-trips', () => {
  const long = 'DESCRIPTION:' + 'Thứ 6 tuần sau là ngày nào? '.repeat(12);
  const folded = foldIcsLine(long);
  for (const line of folded.split('\r\n')) assert.ok(utf8Bytes(line) <= 75, `line too long: ${utf8Bytes(line)}`);
  assert.equal(folded.replace(/\r\n /g, ''), long);
});

test('generateIcsContent produces a valid, folded calendar', () => {
  const ics = generateIcsContent([event], new Date('2026-11-14T06:00:00Z'));
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.ok(!/[^\r]\n/.test(ics), 'all line breaks are CRLF');
  for (const line of ics.split('\r\n')) assert.ok(utf8Bytes(line) <= 75);

  const unfolded = ics.replace(/\r\n /g, '');
  assert.match(unfolded, /\r\nDTSTART:20261116T123000Z\r\n/);
  assert.match(unfolded, /\r\nDTEND:20261116T140000Z\r\n/);
  assert.match(unfolded, /\r\nUID:task_1_s1@plansnap\.app\r\n/);
  assert.match(unfolded, /SUMMARY:\[PlanSnap\] Nộp bản cuối tiểu luận Marketing\\, nhóm 3\\; bản cuối \(Phiên 1\/2\)/);
  assert.match(unfolded, /TRIGGER:-PT15M/);
  assert.equal((unfolded.match(/BEGIN:VEVENT/g) || []).length, 1);
});

test('Google Calendar link carries title and UTC range', () => {
  const url = new URL(getGoogleCalendarLink(event));
  assert.equal(url.searchParams.get('action'), 'TEMPLATE');
  assert.equal(url.searchParams.get('text'), event.title);
  assert.equal(url.searchParams.get('dates'), '20261116T123000Z/20261116T140000Z');
});
