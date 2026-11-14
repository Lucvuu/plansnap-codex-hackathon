// Add / edit one free-time window — modelled on the iOS Clock "Edit Alarm" sheet:
// Hủy | title | Lưu bar, grouped rows (Bắt đầu, Kết thúc, Lặp lại ›), a "Lặp lại" checklist
// page, and a red "Xóa khung giờ" row when editing.
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  everyDayLabel,
  newSlotDraft,
  repeatLabel,
  sameSlot,
  slotLengthLabel,
  sortDays,
  validateSlot,
  WEEK_ORDER,
} from '@/lib/slots';
import type { FreeSlot } from '@/lib/types';
import { colors, fonts } from '@/theme';

import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';
import { TimeField } from './TimeField';

interface Props {
  visible: boolean;
  slot: FreeSlot | null; // null → create
  /** Changes on every open so the form re-initialises from `slot`. */
  formKey: number;
  onClose: () => void;
  onSave: (slot: FreeSlot) => void;
  onDelete: (id: string) => void;
}

export function SlotSheet({ visible, slot, formKey, onClose, onSave, onDelete }: Props) {
  return (
    <BottomSheet visible={visible} grouped onClose={onClose}>
      <SlotForm key={formKey} slot={slot} onClose={onClose} onSave={onSave} onDelete={onDelete} />
    </BottomSheet>
  );
}

function SlotForm({ slot, onClose, onSave, onDelete }: Omit<Props, 'visible' | 'formKey'>) {
  const [initial] = useState(() => slot ?? newSlotDraft());
  const [days, setDays] = useState(() => initial.days);
  const [start, setStart] = useState(() => initial.start);
  const [end, setEnd] = useState(() => initial.end);
  const [page, setPage] = useState<'main' | 'repeat'>('main');

  const draft = { ...initial, days: sortDays(days), start, end };
  const error = validateSlot(draft);
  const canSave = !error && (!slot || !sameSlot(draft, slot));

  const save = () => {
    if (!canSave) return;
    onSave(draft);
    onClose();
  };

  if (page === 'repeat') {
    return (
      <>
        <NavBar
          title="Lặp lại"
          left={
            <Pressable role="button" onPress={() => setPage('main')} hitSlop={10} style={styles.backBtn}>
              <Icon name="chevron-left" size={18} color={colors.blue} strokeWidth={2.4} />
              <Text style={styles.navAction}>Quay lại</Text>
            </Pressable>
          }
        />
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.group} role="group" aria-label="Lặp lại">
            {WEEK_ORDER.map((day, i) => {
              const checked = days.includes(day);
              return (
                <Pressable
                  key={day}
                  role="checkbox"
                  aria-checked={checked}
                  onPress={() => setDays((prev) => (checked ? prev.filter((d) => d !== day) : [...prev, day]))}
                  style={({ pressed }) => [styles.row, i > 0 && styles.rowDivider, pressed && styles.rowPressed]}>
                  <Text style={styles.rowLabel}>{everyDayLabel(day)}</Text>
                  {checked && <Icon name="check" size={18} color={colors.blue} strokeWidth={2.6} />}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <NavBar
        title={slot ? 'Sửa khung giờ' : 'Thêm khung giờ'}
        left={<NavAction label="Hủy" onPress={onClose} />}
        right={<NavAction label="Lưu" bold onPress={save} disabled={!canSave} />}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Bắt đầu</Text>
            <View style={styles.timeSlot}>
              <TimeField value={start} onChange={setStart} accessibilityLabel="Giờ bắt đầu" />
            </View>
          </View>
          <View style={[styles.row, styles.rowDivider]}>
            <Text style={styles.rowLabel}>Kết thúc</Text>
            <View style={styles.timeSlot}>
              <TimeField value={end} onChange={setEnd} accessibilityLabel="Giờ kết thúc" />
            </View>
          </View>
        </View>
        {error && error !== 'Chọn ít nhất 1 ngày trong tuần.' ? (
          <Text style={[styles.footnote, styles.error]} role="alert">
            {error}
          </Text>
        ) : (
          <Text style={styles.footnote}>Kéo dài {slotLengthLabel(draft)}</Text>
        )}

        <View style={styles.group}>
          <Pressable
            role="button"
            accessibilityLabel={`Lặp lại: ${repeatLabel(days)}`}
            onPress={() => setPage('repeat')}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <Text style={styles.rowLabel}>Lặp lại</Text>
            <View style={styles.rowValueWrap}>
              <Text style={[styles.rowValue, !days.length && { color: colors.red }]} numberOfLines={1}>
                {days.length ? repeatLabel(days) : 'Chọn ngày'}
              </Text>
              <Icon name="chevron-right" size={16} color={colors.borderStrong} strokeWidth={2.4} />
            </View>
          </Pressable>
        </View>

        {slot && (
          <View style={styles.group}>
            <Pressable
              role="button"
              onPress={() => {
                onDelete(slot.id);
                onClose();
              }}
              style={({ pressed }) => [styles.row, styles.rowCenter, pressed && styles.rowPressed]}>
              <Text style={styles.deleteText}>Xóa khung giờ</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
}

function NavBar({ title, left, right }: { title: string; left?: ReactNode; right?: ReactNode }) {
  return (
    <View style={styles.nav}>
      <View style={[styles.navSide, { alignItems: 'flex-start' }]}>{left}</View>
      <Text style={styles.navTitle} role="heading" numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.navSide, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

function NavAction({
  label,
  onPress,
  bold,
  disabled,
}: {
  label: string;
  onPress: () => void;
  bold?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable role="button" onPress={onPress} disabled={disabled} hitSlop={10} accessibilityState={{ disabled }}>
      {({ pressed }) => (
        <Text
          style={[
            styles.navAction,
            bold && { fontFamily: fonts.bold },
            disabled && { color: colors.borderStrong },
            pressed && { opacity: 0.5 },
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, minHeight: 28 },
  navSide: { flex: 1 },
  navTitle: { fontSize: 16, fontFamily: fonts.bold, color: colors.text, textAlign: 'center' },
  navAction: { fontSize: 15, fontFamily: fonts.medium, color: colors.blue },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -4 },
  body: { gap: 8, paddingBottom: 8 },
  group: { backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  row: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowCenter: { justifyContent: 'center' },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowPressed: { backgroundColor: colors.subtle },
  rowLabel: { fontSize: 15, fontFamily: fonts.regular, color: colors.text },
  rowValueWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  rowValue: { fontSize: 15, fontFamily: fonts.regular, color: colors.textMuted, flexShrink: 1 },
  timeSlot: { width: 112, alignItems: 'flex-end' },
  footnote: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.regular, marginTop: -4, marginBottom: 8, paddingHorizontal: 16 },
  error: { color: colors.red, fontFamily: fonts.semibold },
  deleteText: { fontSize: 15, fontFamily: fonts.medium, color: colors.red },
});
