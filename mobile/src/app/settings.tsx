// Settings sheet (modal route, opened from the gear in screen headers): free-time windows,
// Gemini status, local data. Gemini access is built in (lib/config.ts) — there is no key input.
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FreeSlotList } from '@/components/FreeSlotList';
import { Icon } from '@/components/Icon';
import { Button, IconButton } from '@/components/ui';
import { useApp } from '@/state/AppStore';
import { colors, fonts, layout, radii, type } from '@/theme';

export default function SettingsScreen() {
  const { clearAll, hasKey } = useApp();
  const insets = useSafeAreaInsets();
  const [confirmClear, setConfirmClear] = useState(false);

  // iOS presents `modal` as a page sheet that already starts below the status bar; the root
  // provider's top inset would double-pad it. Android (edge-to-edge push) needs the inset.
  const topInset = Platform.OS === 'ios' ? 0 : insets.top;
  // Opened directly by URL (web reload) there is nothing to go back to.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={[styles.sheet, { paddingTop: topInset + 10 }]}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <Text style={styles.title} role="heading" numberOfLines={1}>
          Cài đặt & Giờ rảnh
        </Text>
        <IconButton icon="close" label="Đóng cài đặt" onPress={close} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: layout.bottom + insets.bottom }]}>
        <View style={styles.section}>
          <FreeSlotList />
        </View>

        <View style={styles.section}>
          <Text style={type.label} role="heading">
            Gemini
          </Text>
          <View style={styles.status}>
            <View style={[styles.statusIcon, { backgroundColor: hasKey ? colors.greenSoft : colors.amberSoft }]}>
              <Icon
                name={hasKey ? 'check' : 'info'}
                size={16}
                color={hasKey ? colors.green : colors.amber}
                strokeWidth={2.4}
              />
            </View>
            <View style={styles.statusBody}>
              <Text style={[styles.statusTitle, { color: hasKey ? colors.green : colors.amberText }]}>
                {hasKey ? 'Đã kết nối' : 'Chế độ demo'}
              </Text>
              <Text style={type.body}>
                {hasKey
                  ? 'Đã tích hợp sẵn — bạn không cần nhập khóa hay thiết lập gì thêm.'
                  : 'Bản này chưa kết nối Gemini — chỉ phân tích được các ảnh mẫu có sẵn.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={type.label} role="heading">
            Dữ liệu cục bộ
          </Text>
          <Button
            label="Xóa dữ liệu đã lưu"
            variant="danger-outline"
            icon={<Icon name="trash" size={16} color={colors.red} />}
            onPress={() => setConfirmClear(true)}
          />
          {confirmClear && (
            <View style={styles.confirm} role="alert">
              <Text style={styles.confirmText}>Xóa toàn bộ đầu việc, lịch và khung giờ rảnh đã chỉnh?</Text>
              <View style={styles.confirmActions}>
                <Button
                  label="Hủy"
                  variant="secondary"
                  style={styles.confirmBtn}
                  onPress={() => setConfirmClear(false)}
                />
                <Button
                  label="Xóa"
                  variant="danger-outline"
                  style={styles.confirmBtn}
                  onPress={async () => {
                    await clearAll();
                    setConfirmClear(false);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.surface },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: layout.gutter,
    paddingBottom: 12,
  },
  title: { flex: 1, fontSize: 17, fontFamily: fonts.extrabold, letterSpacing: -0.2, color: colors.text },
  content: { paddingTop: 4, paddingHorizontal: layout.gutter, gap: 24 },
  section: { gap: 10 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: 14,
  },
  statusIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  statusBody: { flex: 1, minWidth: 0, gap: 2 },
  statusTitle: { fontSize: 13, fontFamily: fonts.bold },
  confirm: {
    backgroundColor: colors.redSoft,
    borderWidth: 1,
    borderColor: colors.redBorder,
    borderRadius: radii.xl,
    padding: 14,
    gap: 12,
  },
  confirmText: { fontSize: 13, fontFamily: fonts.medium, color: colors.textBody, lineHeight: 18 },
  confirmActions: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 1, height: 40 },
});
