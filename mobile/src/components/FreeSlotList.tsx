// "Khung giờ rảnh" list, modelled on the iOS Clock → Alarms screen:
// "Sửa" / "+" in the header, large time + "Tối · Ngày thường" rows with a switch, and an
// edit mode where ⊖ reveals a red "Xóa" button and switches become chevrons.
import { useMemo, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { slotSubtitle, slotTimeRange, WEEK_ORDER } from '@/lib/slots';
import type { FreeSlot } from '@/lib/types';
import { useApp } from '@/state/AppStore';
import { colors, fonts, shadow, tabular } from '@/theme';

import { Icon } from './Icon';
import { SlotSheet } from './SlotSheet';
import { GroupLabel, InlineAlert } from './ui';

// react-native-web colours the "on" thumb with its own prop (default teal) instead of thumbColor.
const WEB_SWITCH_PROPS = (Platform.OS === 'web' ? { activeThumbColor: '#fff' } : {}) as object;

const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

export function FreeSlotList() {
  const { slots, toggleSlot, saveSlot, deleteSlot } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [armedDelete, setArmedDelete] = useState<string | null>(null);
  const [sheet, setSheet] = useState<{ visible: boolean; slot: FreeSlot | null; nonce: number }>({
    visible: false,
    slot: null,
    nonce: 0,
  });

  const editing = editMode && slots.length > 0;
  const openSheet = (slot: FreeSlot | null) => {
    setArmedDelete(null);
    setSheet((s) => ({ visible: true, slot, nonce: s.nonce + 1 }));
  };
  const toggleEditMode = () => {
    animate();
    setArmedDelete(null);
    setEditMode((v) => !v);
  };

  // Monday-first by first day, then by start time.
  const sorted = useMemo(
    () =>
      [...slots].sort(
        (a, b) => WEEK_ORDER.indexOf(a.days[0]) - WEEK_ORDER.indexOf(b.days[0]) || a.start.localeCompare(b.start),
      ),
    [slots],
  );
  const enabledCount = slots.filter((s) => s.enabled).length;

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLabel}>
          <GroupLabel>Khung giờ rảnh</GroupLabel>
        </View>
        <Pressable
          role="button"
          accessibilityLabel="Thêm khung giờ rảnh"
          onPress={() => openSheet(null)}
          hitSlop={10}
          style={({ pressed }) => [styles.plusBtn, pressed && { opacity: 0.5 }]}>
          <Icon name="plus" size={17} color={colors.blue} strokeWidth={2.4} />
        </Pressable>
        {slots.length > 0 && (
          <Pressable role="button" onPress={toggleEditMode} hitSlop={10} style={styles.editBtn}>
            {({ pressed }) => (
              <Text style={[styles.headerText, editing && { fontFamily: fonts.bold }, pressed && { opacity: 0.5 }]}>
                {editing ? 'Xong' : 'Sửa'}
              </Text>
            )}
          </Pressable>
        )}
      </View>

      {sorted.length === 0 ? (
        <Pressable onPress={() => openSheet(null)} style={styles.empty} role="button">
          <Text style={styles.emptyText}>Chưa có khung giờ rảnh nào. Chạm + để thêm.</Text>
        </Pressable>
      ) : (
        <View style={styles.list}>
          {sorted.map((slot, i) => {
            const armed = editing && armedDelete === slot.id;
            const dim = !slot.enabled && !editing;
            return (
              <View key={slot.id} style={[styles.row, i > 0 && styles.rowDivider]}>
                {editing && (
                  <Pressable
                    role="button"
                    accessibilityLabel={`Xóa ${slotTimeRange(slot)}`}
                    hitSlop={8}
                    onPress={() => {
                      animate();
                      setArmedDelete(armed ? null : slot.id);
                    }}
                    style={styles.minusHit}>
                    <View style={[styles.minus, armed && styles.minusArmed]}>
                      <View style={styles.minusBar} />
                    </View>
                  </Pressable>
                )}

                <Pressable
                  role="button"
                  accessibilityLabel={`Sửa khung giờ ${slotTimeRange(slot)}, ${slotSubtitle(slot)}`}
                  onPress={() => (armedDelete ? setArmedDelete(null) : openSheet(slot))}
                  style={({ pressed }) => [styles.body, pressed && { opacity: 0.6 }]}>
                  <Text style={[styles.time, tabular, dim && styles.dim]} numberOfLines={1}>
                    {slotTimeRange(slot)}
                  </Text>
                  <Text style={[styles.subtitle, dim && styles.dim]} numberOfLines={1}>
                    {slotSubtitle(slot)}
                  </Text>
                </Pressable>

                {!editing ? (
                  <Switch
                    value={slot.enabled}
                    onValueChange={() => toggleSlot(slot.id)}
                    trackColor={{ true: colors.blue, false: colors.borderStrong }}
                    thumbColor="#fff"
                    ios_backgroundColor={colors.borderStrong}
                    accessibilityLabel={`Bật khung giờ ${slotTimeRange(slot)}`}
                    {...WEB_SWITCH_PROPS}
                  />
                ) : armed ? (
                  <Pressable
                    role="button"
                    onPress={() => {
                      animate();
                      setArmedDelete(null);
                      deleteSlot(slot.id);
                    }}
                    style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.8 }]}>
                    <Text style={styles.deleteText}>Xóa</Text>
                  </Pressable>
                ) : (
                  <Icon name="chevron-right" size={18} color={colors.borderStrong} strokeWidth={2.4} />
                )}
              </View>
            );
          })}
        </View>
      )}

      {slots.length > 0 && enabledCount === 0 ? (
        <InlineAlert>Chưa bật khung giờ nào — PlanSnap sẽ không tự xếp được phiên làm việc.</InlineAlert>
      ) : slots.length > 0 ? (
        <Text style={styles.footnote}>
          PlanSnap chỉ xếp phiên làm việc vào các khung giờ đang bật. Khung trùng nhau được gộp lại.
        </Text>
      ) : null}

      <SlotSheet
        visible={sheet.visible}
        slot={sheet.slot}
        formKey={sheet.nonce}
        onClose={() => setSheet((s) => ({ ...s, visible: false }))}
        onSave={saveSlot}
        onDelete={deleteSlot}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingRight: 4 },
  headerLabel: { flex: 1 },
  headerText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.blue },
  plusBtn: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  editBtn: { minWidth: 28, alignItems: 'flex-end' },
  list: { backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden', ...shadow(1) },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 14 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  minusHit: { paddingVertical: 4 },
  minus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusArmed: { transform: [{ rotate: '90deg' }] },
  minusBar: { width: 10, height: 2, borderRadius: 1, backgroundColor: '#fff' },
  body: { flex: 1, minWidth: 0 },
  time: { fontSize: 18, fontFamily: fonts.medium, color: colors.text },
  subtitle: { fontSize: 12, fontFamily: fonts.regular, color: colors.textMuted, marginTop: 1 },
  dim: { color: colors.textMuted, opacity: 0.7 },
  deleteBtn: {
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  deleteText: { color: '#fff', fontSize: 13, fontFamily: fonts.semibold },
  empty: { backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 22, paddingHorizontal: 16, ...shadow(1) },
  emptyText: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.regular, textAlign: 'center' },
  footnote: { fontSize: 11.5, color: colors.textMuted, fontFamily: fonts.regular, paddingHorizontal: 4, marginTop: -6 },
});
