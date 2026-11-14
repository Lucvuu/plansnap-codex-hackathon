// Gemini API key storage — iOS Keychain / Android Keystore via expo-secure-store.
import * as SecureStore from 'expo-secure-store';

const KEY = 'plansnap.gemini_api_key';

export async function getApiKey(): Promise<string> {
  try {
    return (await SecureStore.getItemAsync(KEY)) ?? '';
  } catch {
    return '';
  }
}

export async function setApiKey(value: string): Promise<void> {
  if (value) await SecureStore.setItemAsync(KEY, value);
  else await SecureStore.deleteItemAsync(KEY);
}
