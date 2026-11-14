// Demo screenshots bundled as PNG assets (pre-rendered from the PWA's inline SVG samples).
import { Asset } from 'expo-asset';
import type { CapturedImage, PresetType } from './types';

const SAMPLE_SIZE = { width: 1200, height: 800 };

const PACKS: Record<PresetType, { module: number; name: string }[]> = {
  student: [
    { module: require('../../assets/samples/zalo.png'), name: 'Zalo_Nhom_Marketing.png' },
    { module: require('../../assets/samples/lms.png'), name: 'LMS_Canvas_Quiz4.png' },
    { module: require('../../assets/samples/slide.png'), name: 'Slide_CaseStudy2.png' },
  ],
  judge: [{ module: require('../../assets/samples/handwritten.png'), name: 'Ghi_chu_viet_tay.png' }],
};

export async function loadSampleImages(presetType: PresetType): Promise<CapturedImage[]> {
  const pack = PACKS[presetType];
  const assets = await Asset.loadAsync(pack.map((p) => p.module));
  return assets.map((asset, i) => ({
    id: `preset-${presetType}-${i}-${Date.now()}`,
    uri: asset.localUri ?? asset.uri,
    name: pack[i].name,
    ...SAMPLE_SIZE,
    isPreset: true,
    presetType,
  }));
}
