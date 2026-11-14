// Pure Gemini helpers (no native imports, unit-testable in Node).
import type { Task } from './types';

export const DEFAULT_MODEL = 'gemini-3-flash-preview';
export const MODEL_OPTIONS: { value: string; label: string; hint?: string }[] = [
  { value: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview', hint: 'Nhanh nhất' },
  { value: 'gemini-3.5-flash', label: 'gemini-3.5-flash' },
  { value: 'gemini-3.8-flash', label: 'gemini-3.8-flash' },
];
export const DEPRECATED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
]);

export function hasUsableKey(apiKey: string | null | undefined): apiKey is string {
  return Boolean(apiKey && apiKey.trim().length > 10);
}

/** Preferred model first, then the remaining fallbacks, deduplicated. */
export function getCandidateModels(preferredModel?: string | null): string[] {
  const clean = !preferredModel || DEPRECATED_MODELS.has(preferredModel) ? DEFAULT_MODEL : preferredModel;
  return [...new Set([clean, ...MODEL_OPTIONS.map((m) => m.value)])];
}

/** Parse the model's ExtractionResult JSON (tolerating a stray ```json fence). */
export function parseExtractionJson(rawText: string, now: number = Date.now()): Task[] {
  const clean = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsed = JSON.parse(clean) as { tasks?: Task[] };
  return (parsed.tasks || []).map((t, i) => ({ ...t, id: t.id || `task_live_${now}_${i}` }));
}
