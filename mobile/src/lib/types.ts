export type SlotKey = 'weekday-eve' | 'sat-morn' | 'sat-aft' | 'sun-morn' | 'sun-aft';
export type SlotMap = Record<SlotKey, boolean>;

/** One weekly free-time window. `day` follows Date#getDay (0 = Sunday). */
export interface SlotDef {
  day: number;
  start: string; // HH:mm
  end: string; // HH:mm
}

export type ClarifyOption = string | { label?: string; deadline_iso?: string };

/** ExtractionResult task, as returned by Gemini (or the demo presets). */
export interface Task {
  id: string;
  title: string;
  source_quote?: string | null;
  source_image_index?: number;
  deadline_raw?: string | null;
  deadline_iso: string | null;
  needs_confirmation?: boolean;
  question?: string | null;
  options?: ClarifyOption[];
  clarification_options?: ClarifyOption[];
  estimated_minutes?: number;
  confidence?: number;
  completed?: boolean;
}

export interface ScheduledEvent {
  id: string;
  taskId: string;
  title: string;
  originalTitle: string;
  source_quote?: string | null;
  deadline_iso: string | null;
  start: string; // ISO
  end: string; // ISO
  durationMinutes: number;
  sessionIndex: number;
  totalSessions: number;
  isUrgent: boolean;
  isPastDeadline: boolean;
}

export type PresetType = 'student' | 'judge';

export interface CapturedImage {
  id: string;
  uri: string;
  name: string;
  width?: number;
  height?: number;
  /** JPEG base64 (no data: prefix). Filled lazily for presets. */
  base64?: string;
  mimeType?: string;
  originalSizeKb?: number;
  compressedSizeKb?: number;
  isPreset?: boolean;
  presetType?: PresetType;
}

export interface ExtractionResult {
  tasks: Task[];
  modelUsed: string;
  elapsedMs: number;
}
