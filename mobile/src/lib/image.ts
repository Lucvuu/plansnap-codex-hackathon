// Client-side image compression (replaces the PWA's Canvas compressor).
// Decodes the image bounded to MAX_DIMENSION (never upscaling, aspect ratio kept — the same
// rule as app/js/compressor.js) and re-encodes it as JPEG with base64 for Gemini.
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export const MAX_DIMENSION = 1200;
export const JPEG_QUALITY = 0.78;

export interface CompressedImage {
  uri: string;
  base64: string;
  width: number;
  height: number;
  compressedSizeKb: number;
}

export async function compressImage(uri: string): Promise<CompressedImage> {
  const rendered = await ImageManipulator.manipulate(uri, {
    maxWidth: MAX_DIMENSION,
    maxHeight: MAX_DIMENSION,
  }).renderAsync();
  const result = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: JPEG_QUALITY, base64: true });
  const base64 = result.base64 ?? '';
  return {
    uri: result.uri,
    base64,
    width: result.width,
    height: result.height,
    compressedSizeKb: Math.round((base64.length * 3) / 4 / 1024),
  };
}
