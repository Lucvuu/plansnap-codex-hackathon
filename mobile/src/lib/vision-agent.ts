// PlanSnap multi-modal Vision Agent (ported from app/js/vision-agent.js).
// Gemini Vision with model auto-fallback; demo presets work offline without a key.
import { buildHandwrittenDemoTask, buildStudentDemoTasks } from './demo-tasks';
import { DEFAULT_MODEL, getCandidateModels, hasUsableKey, parseExtractionJson } from './gemini';
import { toLocalIsoWithOffset } from './format';
import { compressImage } from './image';
import { buildSystemPrompt } from './prompt';
import type { CapturedImage, ExtractionResult } from './types';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export class NoApiKeyError extends Error {
  code = 'NO_API_KEY' as const;
  constructor() {
    super('Chưa có Gemini API Key để phân tích ảnh thật.');
  }
}

const REQUEST_TIMEOUT_MS = 15000;

/** A failure worth one automatic retry: dropped connection or an unusable model answer. */
class TransientError extends Error {}

async function geminiRequest(model: string, apiKey: string, body: unknown) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch {
    // A timeout is not retried automatically: the user has already waited 15s.
    if (ctrl.signal.aborted) throw new Error('Mạng đang chậm (quá 15 giây). Bấm lại để thử lại.');
    throw new TransientError('Không kết nối được Gemini. Kiểm tra mạng rồi bấm thử lại.');
  } finally {
    clearTimeout(timer);
  }
}

/** Try each candidate model; fall through on 404 (unknown model) and 503 (overloaded). */
async function callWithFallback(apiKey: string, preferredModel: string, body: unknown, errChars: number) {
  let lastErr: Error | null = null;
  for (const model of getCandidateModels(preferredModel)) {
    const response = await geminiRequest(model, apiKey, body);
    if (response.ok) return { response, model };
    const errText = await response.text();
    lastErr = new Error(`HTTP ${response.status}: ${errText.slice(0, errChars)}`);
    if (response.status !== 404 && response.status !== 503) throw lastErr;
  }
  throw lastErr ?? new Error('Không thể kết nối Gemini API.');
}

export async function testApiKey(apiKey: string, model = DEFAULT_MODEL) {
  const t0 = Date.now();
  const { model: used } = await callWithFallback(
    apiKey.trim(),
    model,
    { contents: [{ parts: [{ text: 'OK' }] }] },
    100,
  );
  return { model: used, elapsedMs: Date.now() - t0 };
}

async function ensureBase64(img: CapturedImage): Promise<{ mimeType: string; data: string }> {
  if (img.base64) return { mimeType: img.mimeType || 'image/jpeg', data: img.base64 };
  const compressed = await compressImage(img.uri);
  return { mimeType: 'image/jpeg', data: compressed.base64 };
}

export async function callGeminiApi(
  images: CapturedImage[],
  apiKey: string,
  model = DEFAULT_MODEL,
): Promise<ExtractionResult> {
  const t0 = Date.now();
  const clientCurrentTime = toLocalIsoWithOffset(new Date());
  let timezone = 'Asia/Ho_Chi_Minh';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || timezone;
  } catch {
    // Intl unavailable — keep the default
  }

  const parts: object[] = [{ text: buildSystemPrompt(clientCurrentTime, timezone) }];
  const rasters = await Promise.all(images.map(ensureBase64));
  for (const r of rasters) {
    if (r.data && r.data.length > 50) {
      parts.push({ inline_data: { mime_type: r.mimeType, data: r.data } });
    }
  }

  const body = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.0, response_mime_type: 'application/json' },
  };

  const attempt = async (): Promise<ExtractionResult> => {
    const { response, model: modelUsed } = await callWithFallback(apiKey, model, body, 140);
    try {
      const data = await response.json();
      const rawJsonText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJsonText) throw new Error('empty');
      return { tasks: parseExtractionJson(rawJsonText), modelUsed, elapsedMs: Date.now() - t0 };
    } catch {
      throw new TransientError('Gemini trả về dữ liệu không đọc được. Bấm lại để thử lại.');
    }
  };

  try {
    return await attempt();
  } catch (err) {
    if (!(err instanceof TransientError)) throw err;
    return attempt(); // one automatic retry (NFR-04)
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function extractTasks(
  images: CapturedImage[],
  apiKey: string | null,
  model = DEFAULT_MODEL,
): Promise<ExtractionResult> {
  if (hasUsableKey(apiKey)) {
    return callGeminiApi(images, apiKey.trim(), model);
  }

  const isPresetPack = images.length > 0 && images.every((img) => img.isPreset);
  if (!isPresetPack) throw new NoApiKeyError();

  if (images.length === 1 && images[0].presetType === 'judge') {
    await delay(350);
    return { tasks: [buildHandwrittenDemoTask()], modelUsed: 'preset', elapsedMs: 350 };
  }

  await delay(400);
  return { tasks: buildStudentDemoTasks(), modelUsed: 'preset', elapsedMs: 400 };
}
