// PlanSnap iCalendar (.ics) generation — RFC 5545 (ported from app/js/ical-export.js)
import type { ScheduledEvent } from './types';

export const ICS_FILENAME = 'plansnap_lich_lam_viec.ics';

const pad = (n: number) => String(n).padStart(2, '0');

export function formatIcsDate(value: Date | string): string {
  const d = new Date(value);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Escape a TEXT property value (RFC 5545 §3.3.11). */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Fold content lines longer than 75 octets (RFC 5545 §3.1), UTF-8 aware. */
export function foldIcsLine(line: string): string {
  const utf8Len = (ch: string) => {
    const cp = ch.codePointAt(0) ?? 0;
    return cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  };
  const parts: string[] = [];
  let current = '';
  let octets = 0;
  let limit = 75;
  for (const ch of line) {
    const len = utf8Len(ch);
    if (octets + len > limit) {
      parts.push(current);
      current = '';
      octets = 0;
      limit = 74; // continuation lines start with a single space
    }
    current += ch;
    octets += len;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function generateIcsContent(events: ScheduledEvent[], now: Date = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//technoComplex//PlanSnap Hackathon//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kế hoạch làm việc PlanSnap',
    'X-WR-TIMEZONE:Asia/Ho_Chi_Minh',
  ];

  const stamp = formatIcsDate(now);

  for (const event of events) {
    const summary = escapeIcsText(event.title);
    const description = escapeIcsText(
      `Phiên làm việc do PlanSnap tự động xếp lịch.\nNguồn: "${event.source_quote || 'Chụp từ ảnh'}"\nHạn chót: ${event.deadline_iso || 'Chưa rõ'}`,
    );

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@plansnap.app`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatIcsDate(event.start)}`,
      `DTEND:${formatIcsDate(event.end)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      // 15-minute reminder
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Nhắc nhở: ${summary}`,
      'END:VALARM',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldIcsLine).join('\r\n') + '\r\n';
}

export function getGoogleCalendarLink(event: ScheduledEvent): string {
  const dates = `${formatIcsDate(event.start)}/${formatIcsDate(event.end)}`;
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(
    `Nguồn trích dẫn: ${event.source_quote || ''}\nLên lịch tự động bởi PlanSnap`,
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
}
