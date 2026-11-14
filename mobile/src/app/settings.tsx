// Tab 4 — Cài đặt (free-time windows, local data). Gemini access is built in (lib/config.ts).
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FreeSlotList } from '@/components/FreeSlotList';
import { Button, Card, GroupLabel, InlineAlert, LinkButton } from '@/components/ui';
import { useApp } from '@/state/AppStore';
import { colors, fonts } from '@/theme';

export default function SettingsScreen() {
  const { clearAll } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.h1} role="heading">
        Cài đặt
      </Text>

      <FreeSlotList />

      <GroupLabel>Dữ liệu cục bộ</GroupLabel>
      <Card>
        <Button label="Xóa dữ liệu đã lưu" variant="danger-outline" onPress={() => setConfirmClear(true)} />
        {confirmClear && (
          <InlineAlert
            action={
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <LinkButton label="Hủy" color={colors.textSecondary} onPress={() => setConfirmClear(false)} />
                <LinkButton
                  label="Xóa"
                  color={colors.red}
                  onPress={async () => {
                    await clearAll();
                    setConfirmClear(false);
                  }}
                />
              </View>
            }>
            Xóa toàn bộ đầu việc, lịch và khung giờ rảnh đã chỉnh?
          </InlineAlert>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  h1: { fontSize: 22, fontFamily: fonts.bold, letterSpacing: -0.5, color: colors.text },
});
