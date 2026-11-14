// Native deadline picker: inline compact picker on iOS, date → time dialogs on Android.
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDateTimeLabel } from '@/lib/format';
import { colors, fonts } from '@/theme';

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
    <Pressable role="button" accessibilityLabel="Chọn hạn chót" onPress={openAndroid} style={styles.field}>
      <Text style={styles.fieldText}>{formatDateTimeLabel(value)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iosRow: { alignItems: 'flex-start' },
  field: {
    height: 40,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  fieldText: { fontSize: 13.5, color: colors.text, fontFamily: fonts.regular },
});
