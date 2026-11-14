import type { ClarifyOption } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

export const DAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const DAY_MEDIUM = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
export const DAY_FULL = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export function formatDayKey(value: Date | string): string {
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function formatTimeHM(value: Date | string): string {
  const d = new Date(value);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateTimeLabel(value: Date | string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${DAY_MEDIUM[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${formatTimeHM(d)}`;
}

export function formatDeadlineLabel(iso: string | null | undefined, now: Date = new Date()) {
  if (!iso) return { text: 'Chưa rõ hạn', urgent: false };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { text: 'Chưa rõ hạn', urgent: false };
  const diffHours = (d.getTime() - now.getTime()) / 3600000;
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const hm = formatTimeHM(d);
  if (diffHours < 0) return { text: `Quá hạn (${dd}/${mm} ${hm})`, urgent: true };
  if (diffHours < 24) return { text: `Gấp · ${hm} ${dd}/${mm}`, urgent: true };
  return { text: `${hm} · ${dd}/${mm}`, urgent: false };
}

export function clarifyOptionIso(opt: ClarifyOption | undefined): string | undefined {
  if (!opt) return undefined;
  return typeof opt === 'string' ? opt : opt.deadline_iso;
}

export function formatClarifyOptionLabel(opt: ClarifyOption): string {
  if (opt && typeof opt === 'object' && opt.label) return opt.label;
  const iso = clarifyOptionIso(opt);
  const d = new Date(iso ?? '');
  if (isNaN(d.getTime())) return String(iso ?? '');
  return formatDateTimeLabel(d);
}

/** Default deadline for a new manual task: two days from now at 23:59. */
export function defaultNewDeadline(now: Date = new Date()): Date {
  const d = new Date(now.getTime() + 48 * 3600000);
  d.setHours(23, 59, 0, 0);
  return d;
}

/** Local time with numeric offset, e.g. 2026-11-14T13:52:00+07:00. */
export function toLocalIsoWithOffset(d: Date): string {
  const tzOffsetMin = -d.getTimezoneOffset();
  const sign = tzOffsetMin >= 0 ? '+' : '-';
  const absMin = Math.abs(tzOffsetMin);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `${sign}${pad(Math.floor(absMin / 60))}:${pad(absMin % 60)}`
  );
}

/** Value for an HTML datetime-local input (web only). */
export function toDatetimeLocalValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${formatTimeHM(d)}`;
}
