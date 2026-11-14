// App state + actions (port of the controller in app/js/app.js).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { useToast } from '@/components/Toast';
import { clarifyOptionIso, formatClarifyOptionLabel } from '@/lib/format';
import { GEMINI_API_KEY, GEMINI_MODEL, HAS_GEMINI_KEY } from '@/lib/config';
import { loadSampleImages } from '@/lib/samples';
import { scheduleTasks } from '@/lib/scheduler';
import { DEFAULT_FREE_SLOTS, getEnabledSlotDefs } from '@/lib/slots';
import * as storage from '@/lib/storage';
import type { CapturedImage, FreeSlot, PresetType, ScheduledEvent, Task } from '@/lib/types';
import * as VisionAgent from '@/lib/vision-agent';

export const MAX_IMAGES = 5;

/** Result of a successful scan: how many tasks were added and how many still need a deadline check. */
export interface ExtractionOutcome {
  added: number;
  needsReview: number;
}

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
  slots: FreeSlot[];
  hasKey: boolean;
  pendingCount: number;
  /** Incomplete tasks whose deadline is ambiguous and must be confirmed (Smart Review). */
  reviewCount: number;
  isScanning: boolean;
  /** Tab that was open when the app was last closed (restored on launch). */
  lastTab: storage.TabPath;

  addImages: (images: CapturedImage[]) => void;
  removeImage: (id: string) => void;
  loadPreset: (type: PresetType) => Promise<void>;
  /**
   * Extracts tasks from the staged images, or from `direct` (camera challenge) without staging.
   * Resolves to null when nothing was added (error / no tasks found — a toast already explained it).
   */
  runExtraction: (direct?: CapturedImage[]) => Promise<ExtractionOutcome | null>;

  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  upsertTask: (input: TaskInput) => void;
  /** Returns false when the chosen option carries no usable date. */
  resolveClarification: (taskId: string, optionIndex: number) => boolean;
  /**
   * Smart Review "1 chạm": confirm many ambiguous deadlines at once. `choices` maps task id → chosen
   * option index; tasks whose option has no usable date are skipped. Returns how many were confirmed.
   */
  resolveClarifications: (choices: Record<string, number>) => number;

  toggleSlot: (id: string) => void;
  /** Adds the window, or replaces the one with the same id. */
  saveSlot: (slot: FreeSlot) => void;
  deleteSlot: (id: string) => void;
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
  const [slots, setSlots] = useState<FreeSlot[]>(DEFAULT_FREE_SLOTS);
  const [isScanning, setIsScanning] = useState(false);
  const [lastTab, setLastTab] = useState<storage.TabPath>('/');
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
        setSlots(saved.slots);
        setLastTab(saved.lastTab);
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
  const reviewCount = useMemo(() => tasks.filter((t) => !t.completed && t.needs_confirmation).length, [tasks]);
  const hasKey = HAS_GEMINI_KEY;

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

  const runExtraction = useCallback(async (direct?: CapturedImage[]) => {
    const source = direct ?? images;
    if (!source.length || isScanning) return null;
    setIsScanning(true);
    try {
      const result = await VisionAgent.extractTasks(source, GEMINI_API_KEY, GEMINI_MODEL);
      const newTasks = result.tasks.map((t) => ({ ...t, completed: Boolean(t.completed) }));
      if (newTasks.length === 0) {
        // FR-2.1: an image without tasks yields nothing — say so instead of "added 0".
        toast('Không tìm thấy đầu việc hay hạn chót nào trong ảnh.', 'warning');
        return null;
      }
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
      if (!direct) setImages([]);
      touchClock();
      // v2 "anti-AI-slop": no benchmark seconds or model ids in the UI.
      const needsReview = newTasks.filter((t) => !t.completed && t.needs_confirmation).length;
      toast(
        HAS_GEMINI_KEY ? `Đã thêm ${newTasks.length} đầu việc` : `Bản demo: đã thêm ${newTasks.length} đầu việc mẫu`,
        'success',
      );
      return { added: newTasks.length, needsReview };
    } catch (err) {
      toast(`Không đọc được ảnh: ${(err as Error).message}`, 'error');
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [images, isScanning, toast, touchClock]);

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
      if (!task || !chosen || !iso) return false;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, deadline_iso: iso, needs_confirmation: false } : t)),
      );
      touchClock();
      toast(`Đã chốt hạn: ${formatClarifyOptionLabel(chosen)}`, 'success');
      return true;
    },
    [tasks, toast, touchClock],
  );

  const resolveClarifications = useCallback(
    (choices: Record<string, number>) => {
      const resolved = new Map<string, string>();
      for (const t of tasks) {
        if (t.completed || !t.needs_confirmation || !(t.id in choices)) continue;
        const opts = t.options || t.clarification_options || [];
        const iso = clarifyOptionIso(opts[choices[t.id]]);
        if (iso) resolved.set(t.id, iso);
      }
      if (resolved.size === 0) return 0;
      setTasks((prev) =>
        prev.map((t) => (resolved.has(t.id) ? { ...t, deadline_iso: resolved.get(t.id)!, needs_confirmation: false } : t)),
      );
      touchClock();
      toast(`Đã chốt ${resolved.size} hạn chót và xếp vào lịch.`, 'success');
      return resolved.size;
    },
    [tasks, toast, touchClock],
  );

  // ---- Settings -------------------------------------------------------------
  const toggleSlot = useCallback(
    (id: string) => {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
      touchClock();
      toast('Đã cập nhật lịch theo khung giờ mới.', 'info');
    },
    [toast, touchClock],
  );

  const saveSlot = useCallback(
    (slot: FreeSlot) => {
      setSlots((prev) =>
        prev.some((s) => s.id === slot.id) ? prev.map((s) => (s.id === slot.id ? slot : s)) : [...prev, slot],
      );
      touchClock();
      toast('Đã lưu khung giờ rảnh.', 'success');
    },
    [toast, touchClock],
  );

  const deleteSlot = useCallback(
    (id: string) => {
      setSlots((prev) => prev.filter((s) => s.id !== id));
      touchClock();
      toast('Đã xóa khung giờ rảnh.', 'info');
    },
    [toast, touchClock],
  );

  const clearAll = useCallback(async () => {
    await storage.clearAllData();
    setImages([]);
    setTasks([]);
    setSlots(DEFAULT_FREE_SLOTS);
    toast('Đã xóa toàn bộ dữ liệu cục bộ.', 'info');
  }, [toast]);

  const value: AppStore = {
    hydrated,
    images,
    tasks,
    schedule,
    slots,
    hasKey,
    pendingCount,
    reviewCount,
    isScanning,
    lastTab,
    addImages,
    removeImage,
    loadPreset,
    runExtraction,
    toggleTask,
    deleteTask,
    upsertTask,
    resolveClarification,
    resolveClarifications,
    toggleSlot,
    saveSlot,
    deleteSlot,
    clearAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
