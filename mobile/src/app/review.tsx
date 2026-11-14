// Smart Review — "Kiểm tra hạn chót" (v2.0): every ambiguous deadline on one screen, safest option
// preselected, one button to confirm them all. Nothing is saved until that button is pressed.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { TaskSheet } from '@/components/TaskSheet';
import { Button, IconButton, Screen, ScreenHeader } from '@/components/ui';
import { clarifyOptionIso, formatClarifyOptionLabel } from '@/lib/format';
import { successHaptic, tapHaptic } from '@/lib/haptics';
import type { ClarifyOption, Task } from '@/lib/types';
import { useApp } from '@/state/AppStore';
import { brandShadow, colors, fonts, layout, radii, shadow, type } from '@/theme';

interface DatedOption {
  /** Position in the task's own option list — the index `resolveClarifications` expects. */
  index: number;
  option: ClarifyOption;
  time: number;
}

/** Options that carry a parseable date (the only ones the store can save). */
function datedOptions(task: Task): DatedOption[] {
  return (task.options || task.clarification_options || [])
    .map((option, index) => ({ index, option, time: new Date(clarifyOptionIso(option) ?? '').getTime() }))
    .filter((o) => !isNaN(o.time));
}

// The model gives no recommendation. The earliest date still ahead can never make the user late;
// when every option has already passed, the latest one is the least overdue.
function recommendedIndex(options: DatedOption[], now: number): number {
  const future = options.filter((o) => o.time > now);
  const pick = future.length
    ? future.reduce((a, b) => (b.time < a.time ? b : a))
    : options.reduce((a, b) => (b.time > a.time ? b : a));
  return pick.index;
}

// Pops this screen off the root stack and switches the tab underneath (or replaces this screen when
// there is nothing underneath, e.g. a web reload), so "back" from the schedule never lands here.
const goToSchedule = () => router.dismissTo('/schedule');

const goBack = () => (router.canGoBack() ? router.back() : goToSchedule());

export default function ReviewScreen() {
  const { tasks, resolveClarifications, upsertTask } = useApp();
  const insets = useSafeAreaInsets();
  // Frozen at mount so "Khuyên dùng" cannot jump to another option while the screen is open.
  const [now] = useState(() => Date.now());
  // Only what the user changed; every other item falls back to its recommended option.
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [sheet, setSheet] = useState<{ visible: boolean; task: Task | null; nonce: number }>({
    visible: false,
    task: null,
    nonce: 0,
  });

  const items = tasks
    .filter((t) => !t.completed && t.needs_confirmation)
    .map((task) => {
      const options = datedOptions(task);
      const recommended = options.length ? recommendedIndex(options, now) : -1;
      return { task, options, recommended, selected: overrides[task.id] ?? recommended };
    });
  const pickable = items.filter((it) => it.options.length > 0);
  const manualCount = items.length - pickable.length;

  const confirmAll = () => {
    const confirmed = resolveClarifications(Object.fromEntries(pickable.map((it) => [it.task.id, it.selected])));
    if (confirmed === 0) return;
    successHaptic();
    // Items still waiting for a hand-picked date stay on screen rather than being left behind.
    if (manualCount === 0) goToSchedule();
  };

  return (
    <>
      <Screen contentStyle={{ paddingBottom: layout.bottom + insets.bottom }}>
        <View style={styles.header}>
          <IconButton icon="chevron-left" label="Quay lại" onPress={goBack} />
          <View style={styles.headerTitle}>
            <ScreenHeader
              title="Kiểm tra hạn chót"
              subtitle={items.length ? `${items.length} đầu việc cần xác nhận ngày` : 'Không còn gì cần xác nhận'}
            />
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Icon name="check" size={22} color={colors.green} strokeWidth={2.6} />
            </View>
            <Text style={type.cardTitle}>Mọi hạn chót đã rõ ràng</Text>
            <Text style={[type.body, styles.centered]}>Không còn đầu việc nào cần kiểm tra ngày.</Text>
            <Button
              label="Xem lịch"
              onPress={goToSchedule}
              icon={<Icon name="calendar" size={16} color={colors.surface} />}
              style={styles.emptyBtn}
            />
          </View>
        ) : (
          <>
            <View style={styles.banner}>
              {pickable.length > 0 ? (
                <Text style={styles.bannerText}>
                  Có <Text style={styles.strong}>{pickable.length} hạn chót chưa rõ ngày</Text>. Đã chọn sẵn mốc an toàn
                  nhất cho từng việc (ngày sớm nhất chưa qua) — chạm vào ngày khác nếu muốn đổi.
                </Text>
              ) : null}
              {manualCount > 0 ? (
                <Text style={styles.bannerText}>
                  <Text style={styles.strong}>{manualCount} đầu việc chưa đọc được ngày</Text> từ ảnh. Hãy chọn ngày giờ
                  cho từng việc để xếp vào lịch.
                </Text>
              ) : null}
              {pickable.length > 0 ? (
                <Button
                  label="Đồng ý tất cả & Xếp vào lịch"
                  onPress={confirmAll}
                  icon={<Icon name="check" size={16} color={colors.surface} strokeWidth={3} />}
                />
              ) : null}
            </View>

            <View style={styles.list}>
              {items.map(({ task, options, recommended, selected }) => (
                <View key={task.id} style={styles.item}>
                  <Text style={type.cardTitle}>{task.title}</Text>
                  {task.source_quote ? <Text style={type.meta}>Nguồn ảnh: “{task.source_quote}”</Text> : null}
                  {options.length > 0 ? (
                    <View style={styles.options} role="radiogroup" accessibilityLabel={`Hạn chót cho ${task.title}`}>
                      {options.map(({ index, option }) => {
                        const isSelected = index === selected;
                        const isRecommended = index === recommended;
                        const label = formatClarifyOptionLabel(option);
                        return (
                          <Pressable
                            key={index}
                            role="radio"
                            accessibilityLabel={isRecommended ? `${label}, khuyên dùng` : label}
                            accessibilityState={{ selected: isSelected, checked: isSelected }}
                            onPress={() => {
                              tapHaptic();
                              setOverrides((prev) => ({ ...prev, [task.id]: index }));
                            }}
                            style={({ pressed }) => [
                              styles.option,
                              isSelected && styles.optionSelected,
                              pressed && { opacity: 0.85 },
                            ]}>
                            <View style={styles.optionRow}>
                              {isSelected ? <Icon name="check" size={13} color={colors.surface} strokeWidth={3} /> : null}
                              <Text style={[styles.optionText, isSelected && styles.onBrand]}>{label}</Text>
                            </View>
                            {isRecommended ? (
                              <Text style={[styles.recommended, isSelected && styles.onBrand]}>Khuyên dùng</Text>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <Button
                      label="Chọn ngày giờ"
                      variant="secondary"
                      onPress={() => setSheet((s) => ({ visible: true, task, nonce: s.nonce + 1 }))}
                      icon={<Icon name="calendar" size={16} color={colors.textBody} />}
                      style={styles.pickBtn}
                    />
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </Screen>

      <TaskSheet
        visible={sheet.visible}
        task={sheet.task}
        formKey={sheet.nonce}
        onClose={() => setSheet((s) => ({ ...s, visible: false }))}
        onSubmit={upsertTask}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { flex: 1, minWidth: 0 },
  banner: {
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.brand100,
    borderRadius: radii.xl,
    padding: 16,
    gap: 10,
  },
  bannerText: { ...type.body, color: colors.textBody },
  strong: { fontFamily: fonts.bold, color: colors.text },
  list: { gap: 10 },
  item: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: 14,
    gap: 8,
    ...shadow(1),
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  option: {
    // Two options share a row; a third (or a narrow screen) wraps instead of squeezing the labels.
    flexGrow: 1,
    flexBasis: 120,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  optionSelected: { backgroundColor: colors.blue, borderColor: colors.blue, ...brandShadow('soft') },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  optionText: { flexShrink: 1, fontSize: 12, fontFamily: fonts.semibold, color: colors.textBody, textAlign: 'center' },
  recommended: { fontSize: 10.5, fontFamily: fonts.bold, color: colors.green },
  onBrand: { color: colors.surface },
  pickBtn: { height: 44, marginTop: 4 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 36, paddingHorizontal: 16 },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: { textAlign: 'center' },
  emptyBtn: { alignSelf: 'stretch', marginTop: 6 },
});
