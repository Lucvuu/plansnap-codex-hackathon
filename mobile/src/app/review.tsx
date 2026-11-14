// Smart Review — "Kiểm tra hạn chót" (v2.0). Placeholder: the review agent replaces this file.
import { router } from 'expo-router';
import { Text } from 'react-native';

import { Button, Screen, ScreenHeader } from '@/components/ui';
import { type } from '@/theme';

export default function ReviewScreen() {
  return (
    <Screen>
      <ScreenHeader title="Kiểm tra hạn chót" subtitle="Đang hoàn thiện" />
      <Text style={type.body}>Màn hình đang được dựng.</Text>
      <Button label="Quay lại" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
