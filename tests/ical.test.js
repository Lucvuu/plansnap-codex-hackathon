'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
global.window = {};
require('../app/js/ical-export.js');
const ICalExporter = window.ICalExporter;

test('RFC 5545 export uses CRLF, required fields, escaping and VALARM', () => {
  const content = ICalExporter.generateIcsContent([{
    id: 'task_1_s1',
    title: '[PlanSnap] Báo cáo, phần 1; kiểm tra',
    source_quote: 'Nộp báo cáo, trước 17h; thứ 6',
    deadline_iso: '2026-11-20T17:00:00+07:00',
    start: '2026-11-19T12:30:00.000Z',
    end: '2026-11-19T14:00:00.000Z'
  }]);
  assert.ok(content.endsWith('\r\n'));
  assert.equal(content.replace(/\r\n/g, '').includes('\n'), false);
  for (const field of ['UID:', 'DTSTAMP:', 'DTSTART:', 'DTEND:', 'SUMMARY:', 'DESCRIPTION:', 'BEGIN:VALARM', 'TRIGGER:-PT15M']) {
    assert.ok(content.includes(field), `missing ${field}`);
  }
  assert.ok(content.includes('Báo cáo\\, phần 1\\; kiểm tra'));
});

test('Google Calendar link carries title, UTC dates, source and original deadline', () => {
  const link = ICalExporter.getGoogleCalendarLink({
    title: 'Phiên 1/2', source_quote: 'Nguồn thật', deadline_iso: '2026-11-20T17:00:00+07:00',
    start: '2026-11-19T12:30:00.000Z', end: '2026-11-19T14:00:00.000Z'
  });
  assert.ok(link.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
  assert.ok(link.includes('dates=20261119T123000Z/20261119T140000Z'));
  assert.match(decodeURIComponent(link), /Nguồn thật/);
  assert.match(decodeURIComponent(link), /Hạn chót gốc/);
});
