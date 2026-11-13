// PlanSnap Deterministic Scheduling Engine
// Thuật toán: Earliest Deadline First (EDF) + Khoảng đệm an toàn 3 giờ + Tôn trọng khung giờ rảnh
class PlanSnapScheduler {
  constructor() {
    this.defaultSlots = [
      { day: 1, start: '19:30', end: '22:30' },
      { day: 2, start: '19:30', end: '22:30' },
      { day: 3, start: '19:30', end: '22:30' },
      { day: 4, start: '19:30', end: '22:30' },
      { day: 5, start: '19:30', end: '22:30' },
      { day: 6, start: '08:30', end: '11:30' },
      { day: 6, start: '14:00', end: '17:00' },
      { day: 0, start: '08:30', end: '11:30' },
      { day: 0, start: '14:00', end: '17:00' }
    ];
  }

  schedule(tasks, customSlots = null, referenceDate = new Date()) {
    const slotsDef = Array.isArray(customSlots) ? customSlots : this.defaultSlots;
    if (slotsDef.length === 0) return [];

    const validTasks = tasks
      .filter(t => !t.completed && t.deadline_iso && !t.needs_confirmation)
      .map(t => ({
        ...t,
        deadlineDate: new Date(t.deadline_iso),
        estimated_minutes: Math.max(30, t.estimated_minutes || 60)
      }))
      .sort((a, b) => a.deadlineDate - b.deadlineDate);

    const availableWindows = this.generateAvailableWindows(slotsDef, referenceDate, 14);
    const scheduledEvents = [];
    let windowIndex = 0;

    for (const task of validTasks) {
      const baseSessionLen = task.estimated_minutes > 120 ? 90 : Math.min(task.estimated_minutes, 90);
      let taskMinutesRemaining = task.estimated_minutes;
      let sessionIndex = 1;
      const estimatedSessions = Math.ceil(task.estimated_minutes / baseSessionLen);

      while (taskMinutesRemaining > 0 && windowIndex < availableWindows.length) {
        const currentWindow = availableWindows[windowIndex];
        if (currentWindow.remainingMinutes < 30) {
          windowIndex++;
          continue;
        }

        // Tránh cắt lẻ phiên cuối dưới 20 phút nếu khung giờ hiện tại đủ chứa
        let targetDuration = Math.min(taskMinutesRemaining, baseSessionLen);
        const leftoverAfter = taskMinutesRemaining - targetDuration;
        if (leftoverAfter > 0 && leftoverAfter < 20 && currentWindow.remainingMinutes >= taskMinutesRemaining && taskMinutesRemaining <= 110) {
          targetDuration = taskMinutesRemaining;
        }

        const duration = Math.min(targetDuration, currentWindow.remainingMinutes);
        const sessionStart = new Date(currentWindow.currentPointer);
        const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);
        const bufferThreshold = new Date(task.deadlineDate.getTime() - 3 * 60 * 60 * 1000);

        const isPastDeadline = sessionEnd > task.deadlineDate;
        const isUrgent = sessionEnd > bufferThreshold;

        const sessionTitle = estimatedSessions > 1
          ? `[PlanSnap] ${task.title} (Phiên ${sessionIndex}/${estimatedSessions})`
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
          totalSessions: estimatedSessions,
          isUrgent,
          isPastDeadline
        });

        currentWindow.remainingMinutes -= duration;
        currentWindow.currentPointer = sessionEnd;
        taskMinutesRemaining -= duration;
        sessionIndex++;

        if (currentWindow.remainingMinutes < 30) {
          windowIndex++;
        }
      }
    }

    return scheduledEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  generateAvailableWindows(slotsDef, startDate, daysCount = 14) {
    const windows = [];
    const current = new Date(startDate);
    current.setSeconds(0, 0);

    for (let i = 0; i < daysCount; i++) {
      const dayDate = new Date(current);
      dayDate.setDate(dayDate.getDate() + i);
      const dayOfWeek = dayDate.getDay();

      const matchingSlots = slotsDef
        .filter(s => s.day === dayOfWeek)
        .sort((a, b) => a.start.localeCompare(b.start));

      for (const slot of matchingSlots) {
        const [startH, startM] = slot.start.split(':').map(Number);
        const [endH, endM] = slot.end.split(':').map(Number);

        const slotStart = new Date(dayDate);
        slotStart.setHours(startH, startM, 0, 0);

        const slotEnd = new Date(dayDate);
        slotEnd.setHours(endH, endM, 0, 0);

        if (slotEnd > startDate) {
          const actualStart = slotStart > startDate ? slotStart : new Date(startDate.getTime() + 15 * 60 * 1000);
          const totalMinutes = Math.max(0, Math.round((slotEnd - actualStart) / 60000));

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
