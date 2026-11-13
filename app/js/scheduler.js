// PlanSnap Deterministic Scheduling Engine (Code thuần)
// Nguyên tắc: Earliest Deadline First (EDF) + Buffer an toàn + Chia nhỏ task dài
class PlanSnapScheduler {
  constructor() {
    // Khung giờ rảnh mặc định của sinh viên (User Availability)
    // Các ngày trong tuần (Mon-Fri): Tối 19:30 - 22:30
    // Cuối tuần (Sat-Sun): Sáng 08:30 - 11:30 & Chiều 14:00 - 17:00
    this.defaultSlots = [
      { day: 1, start: '19:30', end: '22:30' }, // Thứ Hai
      { day: 2, start: '19:30', end: '22:30' }, // Thứ Ba
      { day: 3, start: '19:30', end: '22:30' }, // Thứ Tư
      { day: 4, start: '19:30', end: '22:30' }, // Thứ Năm
      { day: 5, start: '19:30', end: '22:30' }, // Thứ Sáu
      { day: 6, start: '08:30', end: '11:30' }, // Thứ Bảy sáng
      { day: 6, start: '14:00', end: '17:00' }, // Thứ Bảy chiều
      { day: 0, start: '08:30', end: '11:30' }, // Chủ Nhật sáng
      { day: 0, start: '14:00', end: '17:00' }  // Chủ Nhật chiều
    ];
  }

  // Thuật toán chính: Xếp lịch các task vào khung giờ rảnh
  schedule(tasks, customSlots = null, referenceDate = new Date()) {
    const slotsDef = customSlots || this.defaultSlots;
    
    // 1. Lọc các task hợp lệ và sắp xếp theo Earliest Deadline First (EDF)
    const validTasks = tasks
      .filter(t => t.deadline_iso && !t.needs_confirmation)
      .map(t => ({
        ...t,
        deadlineDate: new Date(t.deadline_iso),
        remainingMinutes: t.estimated_minutes || 60
      }))
      .sort((a, b) => a.deadlineDate - b.deadlineDate);

    // 2. Tạo danh sách các slot khả dụng trong 14 ngày tới
    const availableWindows = this.generateAvailableWindows(slotsDef, referenceDate, 14);

    const scheduledEvents = [];
    let windowIndex = 0;

    for (const task of validTasks) {
      // Phân chia task thành các phiên tối đa 90 phút (nếu task > 120 phút)
      const sessionLength = task.estimated_minutes > 120 ? 90 : Math.min(task.estimated_minutes, 90);
      let taskMinutesRemaining = task.estimated_minutes;
      let sessionIndex = 1;
      const totalSessions = Math.ceil(task.estimated_minutes / sessionLength);

      while (taskMinutesRemaining > 0 && windowIndex < availableWindows.length) {
        const currentWindow = availableWindows[windowIndex];
        const duration = Math.min(taskMinutesRemaining, sessionLength, currentWindow.remainingMinutes);

        // Kiểm tra Buffer an toàn: Phiên làm việc phải kết thúc trước deadline tối thiểu 3 tiếng
        const sessionStart = new Date(currentWindow.currentPointer);
        const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);
        const bufferThreshold = new Date(task.deadlineDate.getTime() - 3 * 60 * 60 * 1000);

        if (sessionEnd > bufferThreshold && sessionEnd > task.deadlineDate) {
          // Nếu vượt quá deadline thì cảnh báo gấp nhưng vẫn cố xếp trước deadline
          console.warn(`[Scheduler] Task "${task.title}" xếp sát hoặc quá deadline!`);
        }

        const sessionTitle = totalSessions > 1 
          ? `[PlanSnap] ${task.title} (Phiên ${sessionIndex}/${totalSessions})`
          : `[PlanSnap] ${task.title}`;

        scheduledEvents.push({
          id: `${task.id}_s${sessionIndex}`,
          taskId: task.id,
          title: sessionTitle,
          originalTitle: task.title,
          source_quote: task.source_quote,
          deadline_iso: task.deadline_iso,
          start: sessionStart.toISOString(),
          end: sessionEnd.toISOString(),
          durationMinutes: duration,
          sessionIndex,
          totalSessions,
          isUrgent: sessionEnd > bufferThreshold
        });

        // Cập nhật slot
        currentWindow.remainingMinutes -= duration;
        currentWindow.currentPointer = sessionEnd;
        taskMinutesRemaining -= duration;
        sessionIndex++;

        // Nếu window đã dùng hết, chuyển sang window tiếp theo
        if (currentWindow.remainingMinutes < 30) {
          windowIndex++;
        }
      }
    }

    return scheduledEvents;
  }

  // Sinh các khoảng thời gian trống theo ngày
  generateAvailableWindows(slotsDef, startDate, daysCount = 14) {
    const windows = [];
    const current = new Date(startDate);
    current.setSeconds(0, 0);

    for (let i = 0; i < daysCount; i++) {
      const dayDate = new Date(current);
      dayDate.setDate(dayDate.getDate() + i);
      const dayOfWeek = dayDate.getDay(); // 0 is Sunday, 1 is Monday...

      const matchingSlots = slotsDef.filter(s => s.day === dayOfWeek);

      for (const slot of matchingSlots) {
        const [startH, startM] = slot.start.split(':').map(Number);
        const [endH, endM] = slot.end.split(':').map(Number);

        const slotStart = new Date(dayDate);
        slotStart.setHours(startH, startM, 0, 0);

        const slotEnd = new Date(dayDate);
        slotEnd.setHours(endH, endM, 0, 0);

        // Chỉ lấy các slot trong tương lai so với startDate
        if (slotEnd > startDate) {
          const actualStart = slotStart > startDate ? slotStart : new Date(startDate.getTime() + 15 * 60 * 1000);
          const totalMinutes = Math.max(0, Math.round((slotEnd - actualStart) / (60 * 1000)));

          if (totalMinutes >= 30) {
            windows.push({
              start: actualStart,
              end: slotEnd,
              currentPointer: actualStart,
              remainingMinutes: totalMinutes
            });
          }
        }
      }
    }
    return windows;
  }
}

window.PlanSnapScheduler = PlanSnapScheduler;

