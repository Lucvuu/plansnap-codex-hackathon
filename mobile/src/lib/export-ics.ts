// Native .ics export: write to the cache dir, then open the OS share sheet
// (Save to Files, Calendar, Zalo, Gmail, …).
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generateIcsContent, ICS_FILENAME } from './ical';
import type { ScheduledEvent } from './types';

export async function exportIcs(events: ScheduledEvent[]): Promise<void> {
  const file = new File(Paths.cache, ICS_FILENAME);
  file.create({ overwrite: true });
  await file.write(generateIcsContent(events));

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Thiết bị không hỗ trợ chia sẻ tệp.');
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/calendar',
    UTI: 'com.apple.ical.ics',
    dialogTitle: 'Xuất lịch PlanSnap',
  });
}
