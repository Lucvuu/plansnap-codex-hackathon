// Web build: expo-secure-store has no web implementation, so the key lives in localStorage
// (the same exposure as the PWA, which kept it in IndexedDB).
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'plansnap.gemini_api_key';

export async function getApiKey(): Promise<string> {
  return (await AsyncStorage.getItem(KEY)) ?? '';
}

export async function setApiKey(value: string): Promise<void> {
  if (value) await AsyncStorage.setItem(KEY, value);
  else await AsyncStorage.removeItem(KEY);
}
