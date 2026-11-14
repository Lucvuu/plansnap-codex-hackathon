// Design tokens — PlanSnap UI v2.0 "Tonal" palette (docs/PlanSnap-Figma-Prototype.html on frontend-v2.0):
// Deep navy / brand blue scale on slate surfaces, emerald for success, coral for urgent.
import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  // Surfaces (slate)
  bg: '#f8fafc', // slate-50 canvas
  surface: '#ffffff',
  subtle: '#f1f5f9', // slate-100
  border: '#e2e8f0', // slate-200
  borderStrong: '#cbd5e1', // slate-300

  // Text (slate)
  text: '#0f172a', // slate-900 ink
  textBody: '#334155', // slate-700
  textSecondary: '#475569', // slate-600
  textMuted: '#64748b', // slate-500
  textFaint: '#94a3b8', // slate-400

  // Brand (blue / indigo scale)
  brand900: '#0f1e4a',
  blueNavy: '#1e3a8a', // brand-800
  blueHover: '#1d4ed8', // brand-700
  blue: '#2563eb', // brand-600 — primary
  brand500: '#3b82f6',
  brand400: '#60a5fa',
  blueBorder: '#bfdbfe',
  brand100: '#dbeafe',
  blueSoft: '#eff6ff', // brand-50

  // Semantic
  green: '#059669', // emerald-600
  greenBorder: '#a7f3d0',
  greenTint: '#d1fae5', // emerald-100
  greenSoft: '#ecfdf5', // emerald-50
  amber: '#d97706',
  amberSoft: '#fffbeb',
  amberTint: '#fef3c7',
  amberBorder: '#fcd34d',
  amberChip: '#f59e0b',
  amberText: '#92400e',
  alertBorder: '#fde68a',
  red: '#e11d48', // coral-600 — urgent / destructive
  redSoft: '#fff1f2', // coral-50
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
  extrabold: 'BeVietnamPro_800ExtraBold',
} as const;

export const radii = {
  xs: 6, // tag pills
  sm: 8,
  md: 10, // inputs, toggle options
  lg: 14, // date chips, review items, primary buttons
  xl: 16, // session cards, banners
  card: 18, // generic cards
  sheet: 28, // bottom-sheet top corners
} as const;

/** Screen gutters from the prototype: 16 top · 20 sides · 24 bottom, 16 between blocks. */
export const layout = {
  gutter: 20,
  top: 16,
  bottom: 24,
  gap: 16,
} as const;

export const type = {
  /** Screen title — 22 / ExtraBold / tight. */
  title: { fontSize: 22, fontFamily: fonts.extrabold, letterSpacing: -0.4, color: colors.text } as TextStyle,
  /** Line under a screen title. */
  subtitle: { fontSize: 12.5, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 2 } as TextStyle,
  /** Card / row title. */
  cardTitle: { fontSize: 14, fontFamily: fonts.bold, color: colors.text, lineHeight: 19 } as TextStyle,
  /** Section label inside a screen or sheet. */
  label: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.textBody } as TextStyle,
  body: { fontSize: 13, fontFamily: fonts.regular, color: colors.textSecondary, lineHeight: 18 } as TextStyle,
  meta: { fontSize: 11.5, fontFamily: fonts.medium, color: colors.textMuted } as TextStyle,
} as const;

export const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

/** Neutral elevation for cards (1) and floating surfaces (2). */
export function shadow(level: 1 | 2 = 1): ViewStyle {
  const opacity = level === 1 ? 0.04 : 0.08;
  return Platform.select<ViewStyle>({
    ios: { shadowColor: '#000', shadowOpacity: opacity, shadowRadius: level * 3, shadowOffset: { width: 0, height: 1 } },
    android: { elevation: level },
    default: { boxShadow: `0 1px ${level * 3}px rgba(0,0,0,${opacity})` } as ViewStyle,
  })!;
}

/** Blue glow under primary actions (primary button, centre Snap button, active date chip). */
export function brandShadow(strength: 'soft' | 'strong' = 'soft'): ViewStyle {
  const opacity = strength === 'soft' ? 0.25 : 0.35;
  const radius = strength === 'soft' ? 12 : 18;
  return Platform.select<ViewStyle>({
    ios: { shadowColor: colors.blue, shadowOpacity: opacity, shadowRadius: radius / 2, shadowOffset: { width: 0, height: 4 } },
    android: { elevation: strength === 'soft' ? 3 : 6, shadowColor: colors.blue },
    default: { boxShadow: `0 4px ${radius}px rgba(37,99,235,${opacity})` } as ViewStyle,
  })!;
}
