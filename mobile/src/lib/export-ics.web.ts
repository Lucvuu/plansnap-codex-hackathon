// Web .ics export: trigger a browser download (same as the PWA).
import { generateIcsContent, ICS_FILENAME } from './ical';
import type { ScheduledEvent } from './types';

export async function exportIcs(events: ScheduledEvent[]): Promise<void> {
  const blob = new Blob([generateIcsContent(events)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ICS_FILENAME;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
