// User-defined weekly free-time windows ("Khung giờ rảnh").
import type { FreeSlot, SlotDef, SlotKey, SlotMap } from './types';

/** The scheduler never places a session in a window shorter than this. */
export const MIN_SLOT_MINUTES = 30;

/** Monday-first display order of Date#getDay values. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_CHIP = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_NAME = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// The five fixed windows of v2.2, kept as defaults and for migrating old saved toggles.
const LEGACY_PRESETS: { key: SlotKey; days: number[]; start: string; end: string }[] = [
  { key: 'weekday-eve', days: [1, 2, 3, 4, 5], start: '19:30', end: '22:30' },
  { key: 'sat-morn', days: [6], start: '08:30', end: '11:30' },
  { key: 'sat-aft', days: [6], start: '14:00', end: '17:00' },
  { key: 'sun-morn', days: [0], start: '08:30', end: '11:30' },
  { key: 'sun-aft', days: [0], start: '14:00', end: '17:00' },
];

export const DEFAULT_FREE_SLOTS: FreeSlot[] = LEGACY_PRESETS.map(({ key, ...rest }) => ({
  id: key,
  ...rest,
  enabled: true,
}));

export function migrateLegacySlots(map: Partial<SlotMap>): FreeSlot[] {
  return DEFAULT_FREE_SLOTS.map((slot) => ({ ...slot, enabled: map[slot.id as SlotKey] !== false }));
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.round(total)));
  return `${String(Math.floor(clamped / 60)).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}`;
}

/** Returns a Vietnamese error message, or null when the window is usable. */
export function validateSlot(slot: Pick<FreeSlot, 'days' | 'start' | 'end'>): string | null {
  if (!slot.days.length) return 'Chọn ít nhất 1 ngày trong tuần.';
  if (!HHMM.test(slot.start) || !HHMM.test(slot.end)) return 'Giờ không hợp lệ.';
  const length = timeToMinutes(slot.end) - timeToMinutes(slot.start);
  if (length <= 0) return 'Giờ kết thúc phải sau giờ bắt đầu (trong cùng ngày).';
  if (length < MIN_SLOT_MINUTES) return `Khung giờ cần dài ít nhất ${MIN_SLOT_MINUTES} phút.`;
  return null;
}

/** Validates slots read from storage; returns null if the value is not a slot list. */
export function parseStoredSlots(raw: unknown): FreeSlot[] | null {
  if (!Array.isArray(raw)) return null;
  const slots: FreeSlot[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const { id, days, start, end, enabled } = item as Partial<FreeSlot>;
    if (typeof id !== 'string' || !Array.isArray(days) || typeof start !== 'string' || typeof end !== 'string') {
      continue;
    }
    const cleanDays = [...new Set(days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))];
    const slot: FreeSlot = { id, days: sortDays(cleanDays), start, end, enabled: enabled !== false };
    if (!validateSlot(slot)) slots.push(slot);
  }
  return slots;
}

export function sortDays(days: number[]): number[] {
  return [...days].sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
}

/**
 * Expands enabled windows into per-day defs for the scheduler. Overlapping or touching
 * windows on the same day are merged so a free hour is never booked twice.
 */
export function getEnabledSlotDefs(slots: FreeSlot[]): SlotDef[] {
  const byDay = new Map<number, [number, number][]>();
  for (const slot of slots) {
    if (!slot.enabled || validateSlot(slot)) continue;
    for (const day of slot.days) {
      const list = byDay.get(day) ?? [];
      list.push([timeToMinutes(slot.start), timeToMinutes(slot.end)]);
      byDay.set(day, list);
    }
  }

  const defs: SlotDef[] = [];
  for (const day of WEEK_ORDER) {
    const ranges = (byDay.get(day) ?? []).sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const [start, end] of ranges) {
      const last = merged[merged.length - 1];
      if (last && start <= last[1]) last[1] = Math.max(last[1], end);
      else merged.push([start, end]);
    }
    for (const [start, end] of merged) defs.push({ day, start: minutesToTime(start), end: minutesToTime(end) });
  }
  return defs;
}

/** Apple-Clock-style repeat summary: "Ngày thường", "Cuối tuần", "Mỗi ngày", "Thứ 7", "T2 T4 T6". */
export function repeatLabel(days: number[]): string {
  const sorted = sortDays([...new Set(days)]);
  const key = sorted.join(',');
  if (!sorted.length) return 'Không lặp lại';
  if (sorted.length === 7) return 'Mỗi ngày';
  if (key === '1,2,3,4,5') return 'Ngày thường';
  if (key === '6,0') return 'Cuối tuần';
  if (sorted.length === 1) return DAY_NAME[sorted[0]];
  return sorted.map((d) => DAY_CHIP[d]).join(' ');
}

/** Row in the "Lặp lại" checklist, e.g. "Mỗi Thứ 2", "Mỗi Chủ Nhật". */
export const everyDayLabel = (day: number) => `Mỗi ${DAY_NAME[day]}`;

/** Secondary line under the time range, e.g. "Tối · Ngày thường". */
export function slotSubtitle(slot: Pick<FreeSlot, 'days' | 'start'>): string {
  return `${partOfDay(slot.start)} · ${repeatLabel(slot.days)}`;
}

/** "2 giờ", "45 phút", "1 giờ 30 phút". */
export function slotLengthLabel(slot: Pick<FreeSlot, 'start' | 'end'>): string {
  const total = timeToMinutes(slot.end) - timeToMinutes(slot.start);
  if (total <= 0) return '';
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} phút`;
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

function partOfDay(start: string): string {
  const h = Number(start.slice(0, 2));
  if (h < 11) return 'Sáng';
  if (h < 13) return 'Trưa';
  if (h < 18) return 'Chiều';
  return 'Tối';
}

export function slotTimeRange(slot: Pick<FreeSlot, 'start' | 'end'>): string {
  return `${slot.start} – ${slot.end}`;
}

export function newSlotDraft(): FreeSlot {
  return { id: `slot-${Date.now()}`, days: [1, 2, 3, 4, 5], start: '19:00', end: '21:00', enabled: true };
}

export function sameSlot(a: Pick<FreeSlot, 'days' | 'start' | 'end'>, b: Pick<FreeSlot, 'days' | 'start' | 'end'>) {
  return (
    a.start === b.start && a.end === b.end && sortDays(a.days).join(',') === sortDays(b.days).join(',')
  );
}
