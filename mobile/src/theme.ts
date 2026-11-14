// Design tokens mirrored from app/css/style.css (:root variables).
import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  bg: '#f5f5f7',
  surface: '#ffffff',
  subtle: '#f1f3f5',
  border: '#e5e7eb',
  borderStrong: '#d1d5db',
  text: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  blue: '#2563eb',
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
  red: '#dc2626',
  redSoft: '#fef2f2',
  redBorder: '#fecaca',
  overlay: 'rgba(17, 24, 39, 0.4)',
  ink: '#111827',
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
