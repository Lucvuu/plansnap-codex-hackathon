// Per-user Gemini keys (v2.3) are gone: the app uses the built-in key from lib/config.ts.
// This only removes a key a user saved earlier, so it doesn't linger in the Keychain/Keystore.
import * as SecureStore from 'expo-secure-store';

const KEY = 'plansnap.gemini_api_key';

export async function clearStoredApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
