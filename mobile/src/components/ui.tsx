import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, shadow } from '@/theme';

type ButtonVariant = 'primary' | 'outline' | 'danger-outline';

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
  return (
    <Pressable
      role="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        v.container,
        pressed && !isDisabled && { opacity: 0.85, transform: [{ scale: 0.99 }] },
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

export function ScreenHeading({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.headingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.h1} role="heading">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subMeta}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

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
  btn: {
    flexGrow: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  btnText: { fontSize: 14, fontFamily: fonts.semibold },
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
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  h1: { fontSize: 22, fontFamily: fonts.bold, letterSpacing: -0.5, color: colors.text },
  subMeta: { fontSize: 12.5, color: colors.textMuted, marginTop: 2, fontFamily: fonts.regular },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
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
