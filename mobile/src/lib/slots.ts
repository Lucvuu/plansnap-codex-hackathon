import type { SlotDef, SlotKey, SlotMap } from './types';

export const DEFAULT_SLOTS: SlotMap = {
  'weekday-eve': true,
  'sat-morn': true,
  'sat-aft': true,
  'sun-morn': true,
  'sun-aft': true,
};

export interface SlotOption {
  key: SlotKey;
  title: string;
  sub: string;
  defs: SlotDef[];
}

export const SLOT_OPTIONS: SlotOption[] = [
  {
    key: 'weekday-eve',
    title: 'Tối Thứ 2 – Thứ 6',
    sub: '19:30 – 22:30',
    defs: [1, 2, 3, 4, 5].map((day) => ({ day, start: '19:30', end: '22:30' })),
  },
  { key: 'sat-morn', title: 'Sáng Thứ 7', sub: '08:30 – 11:30', defs: [{ day: 6, start: '08:30', end: '11:30' }] },
  { key: 'sat-aft', title: 'Chiều Thứ 7', sub: '14:00 – 17:00', defs: [{ day: 6, start: '14:00', end: '17:00' }] },
  { key: 'sun-morn', title: 'Sáng Chủ Nhật', sub: '08:30 – 11:30', defs: [{ day: 0, start: '08:30', end: '11:30' }] },
  { key: 'sun-aft', title: 'Chiều Chủ Nhật', sub: '14:00 – 17:00', defs: [{ day: 0, start: '14:00', end: '17:00' }] },
];

export function getEnabledSlotDefs(slots: SlotMap): SlotDef[] {
  return SLOT_OPTIONS.filter((opt) => slots[opt.key]).flatMap((opt) => opt.defs);
}
