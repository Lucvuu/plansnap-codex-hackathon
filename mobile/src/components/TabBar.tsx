// v2 bottom bar: "Lịch" · raised centre Snap (camera) button · "Đầu việc".
// Settings left the tab bar — it opens from the gear in each screen header (route /settings).
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { tapHaptic } from '@/lib/haptics';
import { useApp } from '@/state/AppStore';
import { brandShadow, colors, fonts } from '@/theme';

import { Icon, type IconName } from './Icon';

/** Route name → presentation. `index` is the capture (Snap) screen and renders as the centre button. */
const ITEMS: Record<string, { label: string; icon: IconName }> = {
  schedule: { label: 'Lịch', icon: 'calendar' },
  index: { label: 'Quét ảnh', icon: 'camera' },
  tasks: { label: 'Đầu việc', icon: 'tasks' },
};

export const TAB_BAR_HEIGHT = 64;

export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { pendingCount } = useApp();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom, height: TAB_BAR_HEIGHT + insets.bottom }]} role="tablist">
      {state.routes.map((route, index) => {
        const item = ITEMS[route.name];
        if (!item) return null;
        const focused = index === state.index;
        const onPress = () => {
          tapHaptic();
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };

        if (route.name === 'index') {
          return (
            <View key={route.key} style={styles.snapSlot}>
              <Pressable
                role="tab"
                aria-selected={focused}
                accessibilityLabel="Chụp hoặc chọn ảnh thông báo mới"
                onPress={onPress}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.snapBtn,
                  focused && styles.snapBtnFocused,
                  pressed && { transform: [{ translateY: -8 }, { scale: 0.96 }], backgroundColor: colors.blueHover },
                ]}>
                <Icon name="camera" size={22} color="#fff" strokeWidth={2.5} />
              </Pressable>
            </View>
          );
        }

        const color = focused ? colors.blue : colors.textMuted;
        const badge = route.name === 'tasks' && pendingCount > 0 ? pendingCount : 0;
        return (
          <Pressable
            key={route.key}
            role="tab"
            aria-selected={focused}
            accessibilityLabel={badge ? `${item.label}, ${badge} việc chưa xong` : item.label}
            onPress={onPress}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}>
            <View>
              <Icon name={item.icon} size={20} color={color} strokeWidth={focused ? 2.2 : 2} />
              {badge > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color }, focused && { fontFamily: fonts.bold }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.94)' : colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(16px)' } as object) : null),
  },
  item: { flex: 1, height: 64, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontSize: 11, fontFamily: fonts.semibold },
  snapSlot: { flex: 1, height: 64, alignItems: 'center', justifyContent: 'center' },
  snapBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -8 }],
    borderWidth: 3,
    borderColor: colors.surface,
    ...brandShadow('strong'),
  },
  snapBtnFocused: { backgroundColor: colors.blueHover },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeText: { color: '#fff', fontSize: 9.5, fontFamily: fonts.bold, lineHeight: 12 },
});
