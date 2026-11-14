// Persistent local state (replaces the PWA's IndexedDB store).
// Tasks, free-time windows and the last tab → AsyncStorage. (Gemini access is built in: lib/config.ts.)
// The schedule is not stored: it is derived from tasks + slots on every launch.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearStoredApiKey } from './secure-key';
import { DEFAULT_FREE_SLOTS, migrateLegacySlots, parseStoredSlots } from './slots';
import type { FreeSlot, SlotMap, Task } from './types';

const KEYS = {
  tasks: 'plansnap.tasks',
  /** v2.3 per-user model choice; only cleaned up now. */
  legacyModel: 'plansnap.gemini_model',
  freeSlots: 'plansnap.free_slots',
  /** v2.2 on/off map of the five fixed windows; migrated into freeSlots on load. */
  legacySlots: 'plansnap.available_slots',
  lastTab: 'plansnap.last_tab',
} as const;

/** Tab routes that can be restored after the app is killed and reopened. */
export const TAB_PATHS = ['/', '/tasks', '/schedule'] as const;
export type TabPath = (typeof TAB_PATHS)[number];

export interface PersistedState {
  tasks: Task[];
  slots: FreeSlot[];
  lastTab: TabPath;
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadPersistedState(): Promise<PersistedState> {
  const entries = await AsyncStorage.multiGet([KEYS.tasks, KEYS.freeSlots, KEYS.legacySlots, KEYS.lastTab]);
  // Drop per-user Gemini settings saved by earlier versions; the built-in key replaces them.
  clearStoredApiKey().catch(() => {});
  AsyncStorage.removeItem(KEYS.legacyModel).catch(() => {});
  const map = Object.fromEntries(entries);

  const tasks = parseJson<Task[]>(map[KEYS.tasks], []);
  const legacy = parseJson<Partial<SlotMap> | null>(map[KEYS.legacySlots], null);
  const slots =
    parseStoredSlots(parseJson<unknown>(map[KEYS.freeSlots], null)) ??
    (legacy && typeof legacy === 'object' ? migrateLegacySlots(legacy) : DEFAULT_FREE_SLOTS);

  const lastTab = TAB_PATHS.find((p) => p === map[KEYS.lastTab]) ?? '/';

  return { tasks: Array.isArray(tasks) ? tasks : [], slots, lastTab };
}

export const saveLastTab = (path: string) => AsyncStorage.setItem(KEYS.lastTab, path);
export const saveTasks = (tasks: Task[]) => AsyncStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
export const saveSlots = (slots: FreeSlot[]) => AsyncStorage.setItem(KEYS.freeSlots, JSON.stringify(slots));

export async function clearAllData() {
  await Promise.all([AsyncStorage.multiRemove(Object.values(KEYS)), clearStoredApiKey()]);
}
