// Native deadline picker: inline compact picker on iOS, date → time dialogs on Android.
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDateTimeLabel } from '@/lib/format';
import { colors, fonts, radii, tabular } from '@/theme';

import { Icon } from './Icon';

interface Props {
  value: Date;
  onChange: (next: Date) => void;
}

export function DeadlineField({ value, onChange }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.iosRow}>
        <DateTimePicker
          value={value}
          mode="datetime"
          display="compact"
          locale="vi-VN"
          minuteInterval={5}
          accentColor={colors.blue}
          onValueChange={(_e, date) => date && onChange(date)}
        />
      </View>
    );
  }

  const openAndroid = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      onValueChange: (_e, date) => {
        if (!date) return;
        DateTimePickerAndroid.open({
          value: date,
          mode: 'time',
          is24Hour: true,
          onValueChange: (_e2, time) => time && onChange(time),
        });
      },
    });
  };

  return (
    <Pressable
      role="button"
      // Used for both a deadline and a fixed start, so the label names the value rather than the field.
      accessibilityLabel={`Chọn ngày giờ, đang chọn ${formatDateTimeLabel(value)}`}
      onPress={openAndroid}
      style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}>
      <Icon name="calendar" size={16} color={colors.textMuted} />
      <Text style={styles.fieldText}>{formatDateTimeLabel(value)}</Text>
      <Icon name="chevron-down" size={16} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iosRow: { alignItems: 'flex-start', minHeight: 44, justifyContent: 'center' },
  field: {
    height: 44,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldPressed: { borderColor: colors.blue, backgroundColor: colors.surface },
  fieldText: { flex: 1, fontSize: 14, color: colors.text, fontFamily: fonts.regular, ...tabular },
});
