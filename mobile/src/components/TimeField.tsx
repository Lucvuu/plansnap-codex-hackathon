// Native time-of-day picker ("HH:mm"): compact inline picker on iOS, clock dialog on Android.
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, tabular } from '@/theme';

interface Props {
  value: string; // HH:mm
  onChange: (next: string) => void;
  accessibilityLabel: string;
}

function toDate(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

const toHHMM = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export function TimeField({ value, onChange, accessibilityLabel }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.iosRow}>
        <DateTimePicker
          value={toDate(value)}
          mode="time"
          display="compact"
          locale="vi-VN"
          minuteInterval={5}
          accentColor={colors.blue}
          accessibilityLabel={accessibilityLabel}
          onValueChange={(_e, date) => date && onChange(toHHMM(date))}
        />
      </View>
    );
  }

  const openAndroid = () =>
    DateTimePickerAndroid.open({
      value: toDate(value),
      mode: 'time',
      is24Hour: true,
      onValueChange: (_e, date) => date && onChange(toHHMM(date)),
    });

  return (
    <Pressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      onPress={openAndroid}
      style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}>
      <Text style={[styles.fieldText, tabular]}>{value}</Text>
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
    borderRadius: radii.md,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  fieldPressed: { backgroundColor: colors.blueSoft, borderColor: colors.brand400 },
  fieldText: { fontSize: 14, color: colors.text, fontFamily: fonts.semibold },
});
