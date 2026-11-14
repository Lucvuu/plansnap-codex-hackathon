// App state + actions (port of the controller in app/js/app.js).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { useToast } from '@/components/Toast';
import { clarifyOptionIso, formatClarifyOptionLabel } from '@/lib/format';
import { DEFAULT_MODEL, hasUsableKey } from '@/lib/gemini';
import { loadSampleImages } from '@/lib/samples';
import { scheduleTasks } from '@/lib/scheduler';
import { DEFAULT_SLOTS, getEnabledSlotDefs } from '@/lib/slots';
import * as storage from '@/lib/storage';
import type { CapturedImage, PresetType, ScheduledEvent, SlotKey, SlotMap, Task } from '@/lib/types';
import * as VisionAgent from '@/lib/vision-agent';

export const MAX_IMAGES = 5;

export interface TaskInput {
  id?: string;
  title: string;
  deadlineIso: string | null;
  fixedStartIso?: string | null;
  minutes: number;
}

interface AppStore {
  hydrated: boolean;
  images: CapturedImage[];
  tasks: Task[];
  schedule: ScheduledEvent[];
  apiKey: string;
  model: string;
  slots: SlotMap;
  hasKey: boolean;
  pendingCount: number;
  isScanning: boolean;

  addImages: (images: CapturedImage[]) => void;
  removeImage: (id: string) => void;
  loadPreset: (type: PresetType) => Promise<void>;
  runExtraction: () => Promise<boolean>;

  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  upsertTask: (input: TaskInput) => void;
  resolveClarification: (taskId: string, optionIndex: number) => void;

  saveApiSettings: (apiKey: string, model: string) => Promise<void>;
  testApiKey: (apiKey: string, model: string) => Promise<string | null>;
  toggleSlot: (key: SlotKey) => void;
  clearAll: () => Promise<void>;
}

const Ctx = createContext<AppStore | null>(null);

export function useApp(): AppStore {
  const store = useContext(Ctx);
  if (!store) throw new Error('useApp must be used inside <AppProvider>');
  return store;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [slots, setSlots] = useState<SlotMap>({ ...DEFAULT_SLOTS });
  const [isScanning, setIsScanning] = useState(false);
  // Bumped when the app returns to the foreground so the schedule re-anchors to "now".
  const [clock, setClock] = useState(() => Date.now());

  // ---- Hydrate from storage -------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    storage
      .loadPersistedState()
      .then((saved) => {
        if (cancelled) return;
        setTasks(saved.tasks);
        setApiKey(saved.apiKey);
        setModel(saved.model);
        setSlots(saved.slots);
      })
      .catch((err) => toast(`Không đọc được dữ liệu đã lưu: ${err.message}`, 'error'))
      .finally(() => !cancelled && setHydrated(true));
    return () => {
      cancelled = true;
    };
  }, [toast]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s === 'active' && setClock(Date.now()));
    return () => sub.remove();
  }, []);

  // ---- Persist on change (after hydration) ----------------------------------
  useEffect(() => {
    if (hydrated) storage.saveTasks(tasks).catch(() => {});
  }, [tasks, hydrated]);
  useEffect(() => {
    if (hydrated) storage.saveSlots(slots).catch(() => {});
  }, [slots, hydrated]);

  // ---- Derived --------------------------------------------------------------
  const schedule = useMemo(
    () => scheduleTasks(tasks.filter((t) => !t.completed), getEnabledSlotDefs(slots), new Date(clock)),
    [tasks, slots, clock],
  );
  const pendingCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const hasKey = Boolean(apiKey.trim());

  const touchClock = useCallback(() => setClock(Date.now()), []);

  // ---- Capture --------------------------------------------------------------
  const addImages = useCallback(
    (incoming: CapturedImage[]) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) {
        toast(`Tối đa ${MAX_IMAGES} ảnh mỗi lần quét.`, 'warning');
        return;
      }
      const accepted = incoming.slice(0, remaining);
      setImages((prev) => [...prev, ...accepted].slice(0, MAX_IMAGES));
      if (incoming.length > remaining) {
        toast(`Đã thêm ${accepted.length} ảnh (tối đa ${MAX_IMAGES} ảnh).`, 'warning');
      }
    },
    [images.length, toast],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const loadPreset = useCallback(
    async (type: PresetType) => {
      try {
        setImages(await loadSampleImages(type));
        toast(type === 'judge' ? 'Đã nạp ảnh ghi chú viết tay mẫu.' : 'Đã nạp 3 ảnh mẫu Zalo / LMS / Slide.', 'info');
      } catch (err) {
        toast(`Không nạp được ảnh mẫu: ${(err as Error).message}`, 'error');
      }
    },
    [toast],
  );

  const runExtraction = useCallback(async () => {
    if (!images.length || isScanning) return false;
    setIsScanning(true);
    try {
      const result = await VisionAgent.extractTasks(images, apiKey, model);
      const newTasks = result.tasks.map((t) => ({ ...t, completed: Boolean(t.completed) }));
      setTasks((prev) => {
        const merged = [...prev];
        for (const nt of newTasks) {
          const ntKey = `${(nt.title || '').trim().toLowerCase()}|${nt.deadline_iso || ''}`;
          const idx = merged.findIndex(
            (ex) => `${(ex.title || '').trim().toLowerCase()}|${ex.deadline_iso || ''}` === ntKey,
          );
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...nt, id: merged[idx].id };
          } else {
            merged.push(nt);
          }
        }
        return merged;
      });
      setImages([]);
      touchClock();
      const sec = (result.elapsedMs / 1000).toFixed(1);
      toast(
        hasUsableKey(apiKey)
          ? `Đã thêm ${newTasks.length} đầu việc (${sec}s · ${result.modelUsed})`
          : `Demo: đã thêm ${newTasks.length} đầu việc (${sec}s)`,
        'success',
      );
      return true;
    } catch (err) {
      toast(`Lỗi AI: ${(err as Error).message}`, 'error');
      return false;
    } finally {
      setIsScanning(false);
    }
  }, [images, isScanning, apiKey, model, toast, touchClock]);

  // ---- Tasks ----------------------------------------------------------------
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    touchClock();
  }, [touchClock]);

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      touchClock();
      toast('Đã xóa đầu việc.', 'info');
    },
    [toast, touchClock],
  );

  const upsertTask = useCallback(
    ({ id, title, deadlineIso, fixedStartIso, minutes }: TaskInput) => {
      const duration = Math.max(15, Number(minutes) || 60);
      if (id) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  title,
                  deadline_iso: deadlineIso,
                  fixed_start_iso: fixedStartIso ?? null,
                  estimated_minutes: duration,
                  needs_confirmation: false,
                }
              : t,
          ),
        );
        toast(fixedStartIso ? 'Đã cập nhật lịch cố định.' : 'Đã cập nhật đầu việc.', 'success');
      } else {
        setTasks((prev) => [
          ...prev,
          {
            id: `manual-${Date.now()}`,
            title,
            deadline_iso: deadlineIso,
            fixed_start_iso: fixedStartIso ?? null,
            estimated_minutes: duration,
            source_quote: fixedStartIso ? 'Lịch cố định' : 'Thêm thủ công',
            needs_confirmation: false,
            completed: false,
          },
        ]);
        toast(fixedStartIso ? 'Đã thêm lịch cố định mới.' : 'Đã thêm đầu việc mới.', 'success');
      }
      touchClock();
    },
    [toast, touchClock],
  );

  const resolveClarification = useCallback(
    (taskId: string, optionIndex: number) => {
      const task = tasks.find((t) => t.id === taskId);
      const opts = task?.options || task?.clarification_options || [];
      const chosen = opts[optionIndex];
      const iso = clarifyOptionIso(chosen);
      if (!task || !chosen || !iso) return;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, deadline_iso: iso, needs_confirmation: false } : t)),
      );
      touchClock();
      toast(`Đã chốt hạn: ${formatClarifyOptionLabel(chosen)}`, 'success');
    },
    [tasks, toast, touchClock],
  );

  // ---- Settings -------------------------------------------------------------
  const saveApiSettings = useCallback(
    async (key: string, nextModel: string) => {
      const trimmed = key.trim();
      await storage.saveApiSettings(trimmed, nextModel);
      setApiKey(trimmed);
      setModel(nextModel);
      toast(trimmed ? 'Đã lưu API Key và Model.' : 'Đã chuyển về chế độ Demo.', 'success');
    },
    [toast],
  );

  /** Returns the model that answered, or null on failure. Saves the key on success. */
  const testApiKey = useCallback(
    async (key: string, preferredModel: string) => {
      const trimmed = key.trim();
      if (!trimmed) {
        toast('Vui lòng nhập Gemini API Key trước.', 'warning');
        return null;
      }
      try {
        const res = await VisionAgent.testApiKey(trimmed, preferredModel);
        await storage.saveApiSettings(trimmed, res.model);
        setApiKey(trimmed);
        setModel(res.model);
        toast(`Kết nối thành công (${res.model} · ${(res.elapsedMs / 1000).toFixed(2)}s)!`, 'success');
        return res.model;
      } catch (err) {
        toast(`Kết nối thất bại: ${(err as Error).message}`, 'error');
        return null;
      }
    },
    [toast],
  );

  const toggleSlot = useCallback(
    (key: SlotKey) => {
      setSlots((prev) => ({ ...prev, [key]: !prev[key] }));
      touchClock();
      toast('Đã cập nhật lịch theo khung giờ mới.', 'info');
    },
    [toast, touchClock],
  );

  const clearAll = useCallback(async () => {
    await storage.clearAllData();
    setImages([]);
    setTasks([]);
    setApiKey('');
    setModel(DEFAULT_MODEL);
    setSlots({ ...DEFAULT_SLOTS });
    toast('Đã xóa toàn bộ dữ liệu cục bộ.', 'info');
  }, [toast]);

  const value: AppStore = {
    hydrated,
    images,
    tasks,
    schedule,
    apiKey,
    model,
    slots,
    hasKey,
    pendingCount,
    isScanning,
    addImages,
    removeImage,
    loadPreset,
    runExtraction,
    toggleTask,
    deleteTask,
    upsertTask,
    resolveClarification,
    saveApiSettings,
    testApiKey,
    toggleSlot,
    clearAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
