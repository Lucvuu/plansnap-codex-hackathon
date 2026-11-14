import { StyleSheet, Text, View } from 'react-native';
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
      <View
        accessibilityLabel={hasKey ? 'Đang dùng Gemini' : 'Chế độ demo: chỉ ảnh mẫu'}
        style={[styles.status, hasKey && styles.statusLive]}>
        <View style={[styles.dot, hasKey && { backgroundColor: colors.green }]} />
        <Text style={[styles.statusText, hasKey && { color: colors.green }]}>{hasKey ? 'Gemini Live' : 'Demo'}</Text>
      </View>
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
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.subtle,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusLive: { backgroundColor: colors.greenSoft },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textMuted },
  statusText: { fontSize: 11.5, fontFamily: fonts.semibold, color: colors.textSecondary },
});
