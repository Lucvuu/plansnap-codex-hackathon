// PlanSnap deterministic scheduler: EDF + 60-90 minute chunking + 3-hour safety buffer.
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

  splitIntoSessions(minutes) {
    const total = Math.max(15, Math.round(Number(minutes) || 60));
    if (total <= 120) return [total];
    const count = Math.ceil(total / 90);
    const base = Math.floor(total / count);
    const extra = total % count;
    return Array.from({ length: count }, (_, index) => base + (index < extra ? 1 : 0));
  }

  schedule(tasks, customSlots = null, referenceDate = new Date()) {
    const scheduledEvents = [];
    const fixedTasks = (tasks || []).filter((task) => !task.completed && task.fixed_start_iso);

    for (const task of fixedTasks) {
      const fixedStart = new Date(task.fixed_start_iso);
      if (Number.isNaN(fixedStart.getTime())) continue;
      const dur = Math.max(15, Math.round(Number(task.estimated_minutes) || 60));
      const fixedEnd = new Date(fixedStart.getTime() + dur * 60000);
      scheduledEvents.push({
        id: `${task.id}_fixed`,
        taskId: task.id,
        title: `[PlanSnap] ${task.title}`,
        originalTitle: task.title,
        source_quote: task.source_quote || 'Lịch cố định',
        deadline_iso: task.deadline_iso || fixedEnd.toISOString(),
        start: fixedStart.toISOString(),
        end: fixedEnd.toISOString(),
        durationMinutes: dur,
        sessionIndex: 1,
        totalSessions: 1,
        isFixed: true,
        isUrgent: false,
        isPastDeadline: false
      });
    }

    const slotsDef = Array.isArray(customSlots) ? customSlots : this.defaultSlots;
    const validTasks = (tasks || [])
      .filter((task) => !task.completed && !task.fixed_start_iso && task.deadline_iso && !task.needs_confirmation)
      .map((task) => ({ ...task, deadlineDate: new Date(task.deadline_iso) }))
      .filter((task) => !Number.isNaN(task.deadlineDate.getTime()))
      .sort((a, b) => a.deadlineDate - b.deadlineDate || String(a.id).localeCompare(String(b.id)));

    if (!slotsDef.length || !validTasks.length) {
      return scheduledEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    }

    const furthestDeadline = Math.max(...validTasks.map((task) => task.deadlineDate.getTime()));
    const horizonDays = Math.max(14, Math.min(90, Math.ceil((furthestDeadline - referenceDate.getTime()) / 86400000) + 7));
    let windows = this.generateAvailableWindows(slotsDef, referenceDate, horizonDays);

    for (const task of validTasks) {
      const chunks = this.splitIntoSessions(task.estimated_minutes);
      const safeCutoff = new Date(task.deadlineDate.getTime() - 3 * 3600000);
      let result = this.tryAllocate(windows, chunks, safeCutoff, false);
      let forcedUrgent = false;

      if (!result) {
        result = this.tryAllocate(windows, chunks, task.deadlineDate, true);
        forcedUrgent = true;
      }
      if (!result) {
        result = this.tryAllocate(windows, chunks, null, false);
        forcedUrgent = true;
      }
      if (!result) continue;

      windows = result.windows;
      result.allocations
        .sort((a, b) => a.start - b.start)
        .forEach((allocation, index) => {
          const sessionIndex = index + 1;
          const end = allocation.end;
          const isUrgent = forcedUrgent || end > safeCutoff;
          const title = chunks.length > 1
            ? `[PlanSnap] ${task.title} (Phiên ${sessionIndex}/${chunks.length})`
            : `[PlanSnap] ${task.title}`;
          scheduledEvents.push({
            id: `${task.id}_s${sessionIndex}`,
            taskId: task.id,
            title,
            originalTitle: task.title,
            source_quote: task.source_quote || '',
            deadline_iso: task.deadline_iso,
            start: allocation.start.toISOString(),
            end: end.toISOString(),
            durationMinutes: allocation.duration,
            sessionIndex,
            totalSessions: chunks.length,
            isUrgent,
            isPastDeadline: end > task.deadlineDate
          });
        });
    }

    return scheduledEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  tryAllocate(sourceWindows, chunks, cutoff = null, preferLatest = false) {
    const windows = sourceWindows.map((window) => ({ ...window, pointer: new Date(window.pointer), end: new Date(window.end) }));
    const allocations = [];
    const workChunks = preferLatest ? [...chunks].reverse() : [...chunks];
    const indexes = windows.map((_, index) => index);
    if (preferLatest) indexes.reverse();

    for (const duration of workChunks) {
      let placed = null;
      for (const index of indexes) {
        const window = windows[index];
        if (preferLatest) {
          const effectiveEnd = cutoff && cutoff < window.end ? cutoff : window.end;
          const start = new Date(effectiveEnd.getTime() - duration * 60000);
          if (start >= window.pointer && (!cutoff || effectiveEnd <= cutoff)) {
            placed = { index, start, end: new Date(effectiveEnd), duration };
            window.end = start;
            break;
          }
        } else {
          const start = new Date(window.pointer);
          const end = new Date(start.getTime() + duration * 60000);
          if (end <= window.end && (!cutoff || end <= cutoff)) {
            placed = { index, start, end, duration };
            window.pointer = end;
            break;
          }
        }
      }
      if (!placed) return null;
      allocations.push(placed);
    }
    return { windows, allocations };
  }

  generateAvailableWindows(slotsDef, startDate, daysCount = 14) {
    const windows = [];
    const now = new Date(startDate);
    now.setSeconds(0, 0);
    for (let dayOffset = 0; dayOffset < daysCount; dayOffset++) {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() + dayOffset);
      slotsDef
        .filter((slot) => slot.day === dayDate.getDay())
        .sort((a, b) => a.start.localeCompare(b.start))
        .forEach((slot) => {
          const [startHour, startMinute] = slot.start.split(':').map(Number);
          const [endHour, endMinute] = slot.end.split(':').map(Number);
          const slotStart = new Date(dayDate);
          const slotEnd = new Date(dayDate);
          slotStart.setHours(startHour, startMinute, 0, 0);
          slotEnd.setHours(endHour, endMinute, 0, 0);
          if (slotEnd <= now) return;
          // Start on the next quarter hour when the current slot is already in progress.
          let pointer = slotStart > now ? slotStart : new Date(Math.ceil(now.getTime() / 900000) * 900000);
          if (pointer < slotEnd) windows.push({ pointer, end: slotEnd });
        });
    }
    return windows;
  }
}

window.PlanSnapScheduler = PlanSnapScheduler;
