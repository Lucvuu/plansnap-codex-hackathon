// Built-in Gemini access shared by every user (no per-user key setup).
// Values come from mobile/.env (gitignored; see .env.example) and EAS environment variables.
// Expo inlines EXPO_PUBLIC_* at build time, so the key ships inside the app/web bundle and can
// be extracted — use a restricted, budget-capped key and rotate it after the demo.
import { DEFAULT_MODEL, hasUsableKey } from './gemini';

export const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '').trim();
export const GEMINI_MODEL = (process.env.EXPO_PUBLIC_GEMINI_MODEL ?? '').trim() || DEFAULT_MODEL;

/** False when the build has no key: only the bundled demo samples can be analysed. */
export const HAS_GEMINI_KEY = hasUsableKey(GEMINI_API_KEY);
