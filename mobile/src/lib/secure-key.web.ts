// Web build: earlier versions kept a user-entered key in localStorage; remove it.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'plansnap.gemini_api_key';

export async function clearStoredApiKey(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
