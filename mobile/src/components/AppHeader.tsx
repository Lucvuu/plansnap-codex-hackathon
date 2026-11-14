import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/state/AppStore';
import { colors, fonts } from '@/theme';

import { Icon } from './Icon';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { hasKey } = useApp();

  return (
    <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <Icon name="calendar" size={16} color="#fff" strokeWidth={2.2} />
        </View>
        <Text style={styles.brandName}>PlanSnap</Text>
      </View>
      <Pressable
        role="button"
        accessibilityLabel="Mở Cài đặt"
        onPress={() => router.navigate('/settings')}
        hitSlop={8}
        style={styles.settingsBtn}>
        <Icon name="settings" size={20} color={colors.textSecondary} strokeWidth={1.8} />
        {hasKey && <View style={styles.onlineDot} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { fontSize: 16, fontFamily: fonts.bold, letterSpacing: -0.3, color: colors.text },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.green,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});
