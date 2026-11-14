// Persistent local state (replaces the PWA's IndexedDB store).
// Tasks and settings → AsyncStorage; the API key → secure storage (see secure-key.ts).
// The schedule is not stored: it is derived from tasks + slots on every launch.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiKey, setApiKey } from './secure-key';
import { DEFAULT_SLOTS } from './slots';
import type { SlotMap, Task } from './types';
import { DEFAULT_MODEL, DEPRECATED_MODELS } from './gemini';

const KEYS = {
  tasks: 'plansnap.tasks',
  model: 'plansnap.gemini_model',
  slots: 'plansnap.available_slots',
  lastTab: 'plansnap.last_tab',
} as const;

/** Tab routes that can be restored after the app is killed and reopened. */
export const TAB_PATHS = ['/', '/tasks', '/schedule', '/settings'] as const;
export type TabPath = (typeof TAB_PATHS)[number];

export interface PersistedState {
  tasks: Task[];
  apiKey: string;
  model: string;
  slots: SlotMap;
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
  const [entries, apiKey] = await Promise.all([
    AsyncStorage.multiGet([KEYS.tasks, KEYS.model, KEYS.slots, KEYS.lastTab]),
    getApiKey(),
  ]);
  const map = Object.fromEntries(entries);

  const tasks = parseJson<Task[]>(map[KEYS.tasks], []);
  const savedModel = map[KEYS.model];
  const slots = { ...DEFAULT_SLOTS, ...parseJson<Partial<SlotMap>>(map[KEYS.slots], {}) };

  // Auto-migrate deprecated models to the fast default.
  let model = savedModel || DEFAULT_MODEL;
  if (!savedModel || DEPRECATED_MODELS.has(savedModel)) {
    model = DEFAULT_MODEL;
    await AsyncStorage.setItem(KEYS.model, DEFAULT_MODEL);
  }

  const lastTab = TAB_PATHS.find((p) => p === map[KEYS.lastTab]) ?? '/';

  return { tasks: Array.isArray(tasks) ? tasks : [], apiKey, model, slots, lastTab };
}

export const saveLastTab = (path: string) => AsyncStorage.setItem(KEYS.lastTab, path);
export const saveTasks = (tasks: Task[]) => AsyncStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
export const saveSlots = (slots: SlotMap) => AsyncStorage.setItem(KEYS.slots, JSON.stringify(slots));

export async function saveApiSettings(apiKey: string, model: string) {
  await Promise.all([setApiKey(apiKey), AsyncStorage.setItem(KEYS.model, model)]);
}

export async function clearAllData() {
  await Promise.all([AsyncStorage.multiRemove(Object.values(KEYS)), setApiKey('')]);
}
