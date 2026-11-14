// PlanSnap Deterministic Scheduling Engine (ported from app/js/scheduler.js)
// Earliest Deadline First (EDF) + 3h safety buffer + user free-time windows.
import type { ScheduledEvent, SlotDef, Task } from './types';

export const DEFAULT_SLOT_DEFS: SlotDef[] = [
  { day: 1, start: '19:30', end: '22:30' },
  { day: 2, start: '19:30', end: '22:30' },
  { day: 3, start: '19:30', end: '22:30' },
  { day: 4, start: '19:30', end: '22:30' },
  { day: 5, start: '19:30', end: '22:30' },
  { day: 6, start: '08:30', end: '11:30' },
  { day: 6, start: '14:00', end: '17:00' },
  { day: 0, start: '08:30', end: '11:30' },
  { day: 0, start: '14:00', end: '17:00' },
];

const MIN_WINDOW_MINUTES = 30;
const BUFFER_HOURS = 3;
const HORIZON_DAYS = 14;

interface AvailableWindow {
  start: Date;
  end: Date;
  currentPointer: Date;
  remainingMinutes: number;
}

export function generateAvailableWindows(
  slotsDef: SlotDef[],
  startDate: Date,
  daysCount = HORIZON_DAYS,
): AvailableWindow[] {
  const windows: AvailableWindow[] = [];
  const current = new Date(startDate);
  current.setSeconds(0, 0);

  for (let i = 0; i < daysCount; i++) {
    const dayDate = new Date(current);
    dayDate.setDate(dayDate.getDate() + i);
    const dayOfWeek = dayDate.getDay();

    const matchingSlots = slotsDef
      .filter((s) => s.day === dayOfWeek)
      .sort((a, b) => a.start.localeCompare(b.start));

    for (const slot of matchingSlots) {
      const [startH, startM] = slot.start.split(':').map(Number);
      const [endH, endM] = slot.end.split(':').map(Number);

      const slotStart = new Date(dayDate);
      slotStart.setHours(startH, startM, 0, 0);

      const slotEnd = new Date(dayDate);
      slotEnd.setHours(endH, endM, 0, 0);

      if (slotEnd > startDate) {
        // A window already in progress starts 15 minutes from now.
        const actualStart =
          slotStart > startDate ? slotStart : new Date(startDate.getTime() + 15 * 60 * 1000);
        const totalMinutes = Math.max(0, Math.round((slotEnd.getTime() - actualStart.getTime()) / 60000));

        if (totalMinutes >= MIN_WINDOW_MINUTES) {
          windows.push({
            start: actualStart,
            end: slotEnd,
            currentPointer: actualStart,
            remainingMinutes: totalMinutes,
          });
        }
      }
    }
  }
  return windows;
}

export function scheduleTasks(
  tasks: Task[],
  customSlots: SlotDef[] | null = null,
  referenceDate: Date = new Date(),
): ScheduledEvent[] {
  const slotsDef = Array.isArray(customSlots) ? customSlots : DEFAULT_SLOT_DEFS;
  if (slotsDef.length === 0) return [];

  const validTasks = tasks
    .filter((t) => !t.completed && t.deadline_iso && !t.needs_confirmation)
    .map((t) => ({
      ...t,
      deadlineDate: new Date(t.deadline_iso as string),
      estimated_minutes: Math.max(30, t.estimated_minutes || 60),
    }))
    .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());

  const availableWindows = generateAvailableWindows(slotsDef, referenceDate, HORIZON_DAYS);
  const scheduledEvents: ScheduledEvent[] = [];
  let windowIndex = 0;

  for (const task of validTasks) {
    const baseSessionLen = task.estimated_minutes > 120 ? 90 : Math.min(task.estimated_minutes, 90);
    let taskMinutesRemaining = task.estimated_minutes;
    let sessionIndex = 1;
    const estimatedSessions = Math.ceil(task.estimated_minutes / baseSessionLen);
    const firstEventIndex = scheduledEvents.length;

    while (taskMinutesRemaining > 0 && windowIndex < availableWindows.length) {
      const currentWindow = availableWindows[windowIndex];
      if (currentWindow.remainingMinutes < MIN_WINDOW_MINUTES) {
        windowIndex++;
        continue;
      }

      // Avoid leaving a final sliver under 20 minutes when the window can hold the rest.
      let targetDuration = Math.min(taskMinutesRemaining, baseSessionLen);
      const leftoverAfter = taskMinutesRemaining - targetDuration;
      if (
        leftoverAfter > 0 &&
        leftoverAfter < 20 &&
        currentWindow.remainingMinutes >= taskMinutesRemaining &&
        taskMinutesRemaining <= 110
      ) {
        targetDuration = taskMinutesRemaining;
      }

      const duration = Math.min(targetDuration, currentWindow.remainingMinutes);
      const sessionStart = new Date(currentWindow.currentPointer);
      const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);
      const bufferThreshold = new Date(task.deadlineDate.getTime() - BUFFER_HOURS * 60 * 60 * 1000);

      const isPastDeadline = sessionEnd > task.deadlineDate;
      const isUrgent = sessionEnd > bufferThreshold;

      const sessionTitle =
        estimatedSessions > 1
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
        isPastDeadline,
      });

      currentWindow.remainingMinutes -= duration;
      currentWindow.currentPointer = sessionEnd;
      taskMinutesRemaining -= duration;
      sessionIndex++;

      if (currentWindow.remainingMinutes < MIN_WINDOW_MINUTES) {
        windowIndex++;
      }
    }

    // Fragmented windows can split a task into more sessions than estimated (the PWA then
    // showed "Phiên 3/2"). Re-number with the real count; a partially placed task keeps the
    // larger estimate so "Phiên 1/2" still signals that work is missing.
    const placed = scheduledEvents.length - firstEventIndex;
    const totalSessions = Math.max(estimatedSessions, placed);
    if (totalSessions !== estimatedSessions) {
      for (let i = firstEventIndex; i < scheduledEvents.length; i++) {
        const ev = scheduledEvents[i];
        ev.totalSessions = totalSessions;
        ev.title = `[PlanSnap] ${task.title} (Phiên ${ev.sessionIndex}/${totalSessions})`;
      }
    }
  }

  return scheduledEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
