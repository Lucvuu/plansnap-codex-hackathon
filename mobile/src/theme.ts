// Design tokens mirrored from app/css/style.css (:root variables).
import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  bg: '#f8fafc',
  surface: '#ffffff',
  subtle: '#f1f5f9',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  blue: '#2563eb',
  blueNavy: '#1e3a8a',
  blueHover: '#1d4ed8',
  blueSoft: '#eff6ff',
  blueBorder: '#bfdbfe',
  green: '#059669',
  greenSoft: '#ecfdf5',
  amber: '#d97706',
  amberSoft: '#fffbeb',
  amberBorder: '#fcd34d',
  amberChip: '#f59e0b',
  amberText: '#92400e',
  alertBorder: '#fde68a',
  red: '#e11d48',
  redSoft: '#fff1f2',
  redBorder: '#fecdd3',
  overlay: 'rgba(15, 23, 42, 0.45)',
  ink: '#0f172a',
} as const;

// Custom fonts need one family per weight (fontWeight does not pick font files on Android).
export const fonts = {
  regular: 'BeVietnamPro_400Regular',
  medium: 'BeVietnamPro_500Medium',
  semibold: 'BeVietnamPro_600SemiBold',
  bold: 'BeVietnamPro_700Bold',
} as const;

export const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export function shadow(level: 1 | 2 = 1): ViewStyle {
  const opacity = level === 1 ? 0.04 : 0.08;
  return Platform.select<ViewStyle>({
    ios: { shadowColor: '#000', shadowOpacity: opacity, shadowRadius: level * 3, shadowOffset: { width: 0, height: 1 } },
    android: { elevation: level },
    default: { boxShadow: `0 1px ${level * 3}px rgba(0,0,0,${opacity})` } as ViewStyle,
  })!;
}
