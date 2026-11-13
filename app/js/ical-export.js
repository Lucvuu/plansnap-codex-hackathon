// PlanSnap iCalendar (.ics) Export Module - RFC 5545 Compliant
class ICalExporter {
  static formatIcsDate(dateString) {
    const d = new Date(dateString);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      'Z'
    );
  }

  static generateIcsContent(scheduledEvents) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//technoComplex//PlanSnap Hackathon//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Kế hoạch làm việc PlanSnap',
      'X-WR-TIMEZONE:Asia/Ho_Chi_Minh'
    ];

    const nowStr = ICalExporter.formatIcsDate(new Date().toISOString());

    scheduledEvents.forEach((event) => {
      const startStr = ICalExporter.formatIcsDate(event.start);
      const endStr = ICalExporter.formatIcsDate(event.end);
      const summary = event.title.replace(/[,;]/g, ' ');
      const description = `Phiên làm việc do PlanSnap tự động xếp lịch.\\nNguồn: "${event.source_quote || 'Chụp từ ảnh'}"\\nHạn chót: ${event.deadline_iso || 'Chưa rõ'}`;

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${event.id}@plansnap.app`);
      lines.push(`DTSTAMP:${nowStr}`);
      lines.push(`DTSTART:${startStr}`);
      lines.push(`DTEND:${endStr}`);
      lines.push(`SUMMARY:${summary}`);
      lines.push(`DESCRIPTION:${description}`);
      lines.push('STATUS:CONFIRMED');
      // Thêm chuông nhắc nhở trước 15 phút
      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-PT15M');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:Nhắc nhở: ${summary}`);
      lines.push('END:VALARM');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  static downloadIcsFile(scheduledEvents, filename = 'plansnap_lich_lam_viec.ics') {
    const content = ICalExporter.generateIcsContent(scheduledEvents);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static getGoogleCalendarLink(event) {
    const startStr = ICalExporter.formatIcsDate(event.start);
    const endStr = ICalExporter.formatIcsDate(event.end);
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(`Nguồn trích dẫn: ${event.source_quote || ''}\nLên lịch tự động bởi PlanSnap`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startStr}/${endStr}&details=${details}`;
  }
}

window.ICalExporter = ICalExporter;

