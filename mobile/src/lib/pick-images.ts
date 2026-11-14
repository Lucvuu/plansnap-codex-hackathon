// Gallery / camera capture (replaces the PWA's <input type="file"> + drag & drop).
import * as ImagePicker from 'expo-image-picker';

import { compressImage } from './image';
import type { CapturedImage } from './types';

export type PickSource = 'library' | 'camera';

export class PermissionDeniedError extends Error {}

export async function pickImages(source: PickSource, limit: number): Promise<CapturedImage[]> {
  let result: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      throw new PermissionDeniedError('Chưa được cấp quyền máy ảnh. Hãy bật trong Cài đặt của máy.');
    }
    result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
  } else {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, limit),
      orderedSelection: true,
    });
  }

  if (result.canceled) return [];

  return Promise.all(
    result.assets.map(async (asset, i) => {
      const compressed = await compressImage(asset.uri);
      return {
        id: `img-${Date.now()}-${i}`,
        uri: compressed.uri,
        name: asset.fileName || `Ảnh ${i + 1}`,
        width: compressed.width,
        height: compressed.height,
        base64: compressed.base64,
        mimeType: 'image/jpeg',
        originalSizeKb: asset.fileSize ? Math.round(asset.fileSize / 1024) : undefined,
        compressedSizeKb: compressed.compressedSizeKb,
      } satisfies CapturedImage;
    }),
  );
}
