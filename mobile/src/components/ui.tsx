import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { brandShadow, colors, fonts, layout, radii, shadow, type } from '@/theme';

import { Icon, type IconName } from './Icon';

// ---- Screen shell ------------------------------------------------------------

/**
 * Scrollable screen body for a tab/stack route: applies the top safe-area inset (tabs have no
 * navigator header in v2) and the prototype's gutters (16 top · 20 sides · 24 bottom · 16 gap).
 */
export function Screen({
  children,
  contentStyle,
  ...rest
}: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> } & Omit<ScrollViewProps, 'contentContainerStyle'>) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...rest}
      contentContainerStyle={[styles.screen, { paddingTop: layout.top + insets.top }, contentStyle]}>
      {children}
    </ScrollView>
  );
}

/** Large in-screen title (22 / ExtraBold) + muted subtitle, with an optional right-side action slot. */
export function ScreenHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.headerRow}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={type.title} role="heading" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={type.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.headerActions}>{right}</View> : null}
    </View>
  );
}

/** 36pt round icon button (white, 1px slate border) used in screen headers. */
export function IconButton({
  icon,
  label,
  onPress,
  tone = 'default',
  disabled,
  badge,
}: {
  icon: IconName;
  /** Accessibility label (icon-only control). */
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'primary';
  disabled?: boolean;
  /** Small dot in the top-right corner (e.g. something needs attention). */
  badge?: boolean;
}) {
  const primary = tone === 'primary';
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconBtn,
        primary && styles.iconBtnPrimary,
        pressed && !disabled && (primary ? { backgroundColor: colors.blueHover } : styles.iconBtnPressed),
        disabled && styles.disabled,
      ]}>
      {({ pressed }) => (
        <>
          <Icon
            name={icon}
            size={18}
            strokeWidth={2}
            color={primary ? '#fff' : pressed ? colors.blue : colors.textBody}
          />
          {badge ? <View style={styles.iconBtnBadge} /> : null}
        </>
      )}
    </Pressable>
  );
}

/** Gear button that opens the Settings sheet (top-right of tab screens). */
export function SettingsButton() {
  return <IconButton icon="settings" label="Mở Cài đặt & Giờ rảnh" onPress={() => router.push('/settings')} />;
}

type TagTone = 'neutral' | 'blue' | 'red' | 'green' | 'amber';

/** Small status tag (6pt radius). Always pair colour with a text label (a11y rule from the brand guide). */
export function TagPill({ label, tone = 'neutral' }: { label: string; tone?: TagTone }) {
  const t = tagTones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: t.bg }]}>
      <Text style={[styles.tagText, { color: t.fg }, tone === 'red' && { fontFamily: fonts.bold }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const tagTones: Record<TagTone, { bg: string; fg: string }> = {
  neutral: { bg: colors.subtle, fg: colors.textSecondary },
  blue: { bg: colors.blueSoft, fg: colors.blueHover },
  red: { bg: colors.redSoft, fg: colors.red },
  green: { bg: colors.greenSoft, fg: colors.green },
  amber: { bg: colors.amberSoft, fg: colors.amber },
};

// ---- Buttons -------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger-outline';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  icon,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
}) {
  const v = buttonVariants[variant];
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      role="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        v.container,
        isPrimary && !isDisabled && brandShadow('soft'),
        pressed && !isDisabled && (isPrimary ? { backgroundColor: colors.blueHover } : { opacity: 0.85 }),
        pressed && !isDisabled && { transform: [{ scale: 0.99 }] },
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? <ActivityIndicator size="small" color={v.textColor} /> : icon}
      <Text style={[styles.btnText, { color: v.textColor }]}>{label}</Text>
    </Pressable>
  );
}

const buttonVariants: Record<ButtonVariant, { container: ViewStyle; textColor: string }> = {
  primary: { container: { backgroundColor: colors.blue }, textColor: '#fff' },
  secondary: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    textColor: colors.textBody,
  },
  outline: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
    textColor: colors.text,
  },
  'danger-outline': {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.redBorder },
    textColor: colors.red,
  },
};

export function PillButton({
  label,
  onPress,
  tone = 'default',
  icon,
  disabled,
  active,
}: {
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'primary-soft';
  icon?: ReactNode;
  disabled?: boolean;
  active?: boolean;
}) {
  const soft = tone === 'primary-soft';
  return (
    <Pressable
      role="button"
      disabled={disabled}
      accessibilityState={{ disabled: !!disabled, selected: active }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.pill,
        soft && styles.pillSoft,
        active && styles.pillActive,
        pressed && { opacity: 0.7 },
        disabled && styles.disabled,
      ]}>
      {icon}
      <Text style={[styles.pillText, (soft || active) && { color: colors.blue }]}>{label}</Text>
    </Pressable>
  );
}

/** @deprecated v1 heading — use `ScreenHeader` inside `Screen`. */
export const ScreenHeading = ScreenHeader;

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function GroupLabel({ children }: { children: string }) {
  return <Text style={styles.groupLabel}>{children.toUpperCase()}</Text>;
}

export function InlineAlert({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <View style={styles.alert}>
      <Text style={styles.alertText}>{children}</Text>
      {action}
    </View>
  );
}

export function LinkButton({ label, onPress, color = colors.blue }: { label: string; onPress: () => void; color?: string }) {
  return (
    <Pressable role="button" onPress={onPress} hitSlop={8}>
      {({ pressed }) => <Text style={[styles.link, { color, opacity: pressed ? 0.6 : 1 }]}>{label}</Text>}
    </Pressable>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <Text style={styles.empty}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: layout.gutter, paddingBottom: layout.bottom, gap: layout.gap },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(1),
  },
  iconBtnPressed: { backgroundColor: colors.blueSoft, borderColor: colors.brand400 },
  iconBtnPrimary: { backgroundColor: colors.blue, borderColor: colors.blue },
  iconBtnBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  tag: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: radii.xs, alignSelf: 'flex-start' },
  tagText: { fontSize: 11, fontFamily: fonts.semibold },
  btn: {
    flexGrow: 1,
    height: 50,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  btnText: { fontSize: 14, fontFamily: fonts.bold },
  disabled: { opacity: 0.4 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  pillSoft: { backgroundColor: colors.blueSoft, borderColor: 'transparent' },
  pillActive: { borderColor: colors.blue, backgroundColor: colors.blueSoft },
  pillText: { fontSize: 12, fontFamily: fonts.semibold, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
    ...shadow(1),
  },
  groupLabel: {
    fontSize: 11.5,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  alert: {
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: colors.alertBorder,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  alertText: { flex: 1, fontSize: 12.5, color: colors.amberText, fontFamily: fonts.regular },
  link: { fontSize: 12.5, fontFamily: fonts.bold },
  empty: {
    textAlign: 'center',
    paddingVertical: 36,
    paddingHorizontal: 16,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19.5,
    fontFamily: fonts.regular,
  },
});
