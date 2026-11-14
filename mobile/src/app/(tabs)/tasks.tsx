// Tab 2 — Đầu việc (extracted tasks, 1-tap deadline clarification, manual edits)
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { TaskSheet } from '@/components/TaskSheet';
import { EmptyState, PillButton, ScreenHeading } from '@/components/ui';
import { formatClarifyOptionLabel, formatDeadlineLabel } from '@/lib/format';
import { tapHaptic } from '@/lib/haptics';
import type { Task } from '@/lib/types';
import { useApp } from '@/state/AppStore';
import { colors, fonts, shadow, tabular } from '@/theme';

export default function TasksScreen() {
  const { tasks, toggleTask, deleteTask, upsertTask, resolveClarification, resolveAllClarifications } = useApp();
  const [sheet, setSheet] = useState<{ visible: boolean; task: Task | null; nonce: number }>({
    visible: false,
    task: null,
    nonce: 0,
  });
  const openSheet = (task: Task | null) => setSheet((s) => ({ visible: true, task, nonce: s.nonce + 1 }));

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - doneCount;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const ambiguous = tasks.filter((t) => !t.completed && t.needs_confirmation);

  // Incomplete first, then by deadline.
  const sorted = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        if (Boolean(a.completed) !== Boolean(b.completed)) return a.completed ? 1 : -1;
        const da = a.deadline_iso ? new Date(a.deadline_iso).getTime() : Infinity;
        const db = b.deadline_iso ? new Date(b.deadline_iso).getTime() : Infinity;
        return da - db;
      }),
    [tasks],
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeading
          title="Đầu việc"
          subtitle={total === 0 ? 'Chưa có đầu việc nào' : `${pendingCount} việc cần làm · ${doneCount}/${total} hoàn thành`}
          right={
            <PillButton
              tone="primary-soft"
              label="Thêm việc"
              icon={<Icon name="plus" size={12} color={colors.blue} strokeWidth={2.6} />}
              onPress={() => openSheet(null)}
            />
          }
        />

        <View style={styles.thinTrack}>
          <View style={[styles.thinFill, { width: `${pct}%` }]} />
        </View>

        {ambiguous.length > 0 && (
          <View style={styles.smartReviewCard}>
            <View style={styles.smartReviewHeader}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.smartReviewTitle}>Kiểm tra {ambiguous.length} hạn chót</Text>
                <Text style={styles.smartReviewSub}>AI đã chọn mốc tối ưu. Bấm 1 chạm để chốt hoặc chọn ngày.</Text>
              </View>
              {ambiguous.length > 1 && (
                <Pressable
                  role="button"
                  accessibilityLabel="Xác nhận tất cả"
                  onPress={() => {
                    tapHaptic();
                    resolveAllClarifications();
                  }}
                  style={({ pressed }) => [styles.btnBatchConfirm, pressed && { opacity: 0.85 }]}>
                  <Text style={styles.btnBatchConfirmText}>✓ Chốt tất cả</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.clarifyList}>
              {ambiguous.map((task) => {
                const opts = task.options || task.clarification_options || [];
                return (
                  <View key={task.id} style={styles.clarifyItem}>
                    <View style={styles.clarifyItemHeader}>
                      <Text style={styles.clarifyItemTitle} numberOfLines={1}>{task.title}</Text>
                      {task.source_quote ? (
                        <Text style={styles.clarifyItemQuote} numberOfLines={1}>“{task.source_quote}”</Text>
                      ) : null}
                    </View>
                    <View style={styles.clarifyChips}>
                      {opts.map((opt, i) => (
                        <Pressable
                          key={i}
                          role="button"
                          onPress={() => {
                            tapHaptic();
                            resolveClarification(task.id, i);
                          }}
                          style={({ pressed }) => [
                            styles.chip,
                            i === opts.length - 1 && styles.chipRecommended,
                            pressed && styles.chipPressed,
                          ]}>
                          <Text style={[styles.chipText, i === opts.length - 1 && styles.chipTextRecommended]}>
                            {formatClarifyOptionLabel(opt)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {total === 0 ? (
          <EmptyState>
            Chưa có đầu việc nào. Hãy chụp hoặc nạp ảnh mẫu ở tab <Text style={{ fontFamily: fonts.bold }}>Quét ảnh</Text>.
          </EmptyState>
        ) : (
          <View style={styles.list}>
            {sorted.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => {
                  tapHaptic();
                  toggleTask(task.id);
                }}
                onEdit={() => openSheet(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

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

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const dl = formatDeadlineLabel(task.deadline_iso);
  const done = Boolean(task.completed);
  return (
    <View style={[styles.item, done && styles.itemDone]}>
      <Pressable
        role="checkbox"
        aria-checked={done}
        accessibilityLabel="Đánh dấu hoàn thành"
        hitSlop={10}
        onPress={onToggle}
        style={[styles.check, done && styles.checkDone]}>
        {done && <Icon name="check" size={12} color="#fff" strokeWidth={3} />}
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.title, done && styles.titleDone]}>{task.title}</Text>
        <View style={styles.meta}>
          <Text style={[styles.metaChip, dl.urgent && styles.metaChipUrgent]}>{dl.text}</Text>
          <Text style={styles.metaChip}>{Number(task.estimated_minutes) || 60} phút</Text>
        </View>
        {task.source_quote ? (
          <Text style={styles.quote} numberOfLines={2}>
            “{task.source_quote}”
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable role="button" accessibilityLabel="Sửa" hitSlop={6} onPress={onEdit} style={styles.iconBtn}>
          <Icon name="edit" size={14} color={colors.textSecondary} />
        </Pressable>
        <Pressable role="button" accessibilityLabel="Xóa" hitSlop={6} onPress={onDelete} style={styles.iconBtn}>
          <Icon name="trash" size={14} color={colors.red} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  thinTrack: { height: 3, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' },
  thinFill: { height: '100%', backgroundColor: colors.green },

  smartReviewCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  smartReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  smartReviewTitle: { fontSize: 13.5, fontFamily: fonts.bold, color: '#1e3a8a' },
  smartReviewSub: { fontSize: 11.5, fontFamily: fonts.regular, color: '#3b82f6', lineHeight: 16 },
  btnBatchConfirm: {
    backgroundColor: colors.blue,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnBatchConfirmText: { fontSize: 12, fontFamily: fonts.bold, color: '#fff' },
  clarifyList: { gap: 8 },
  clarifyItem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  clarifyItemHeader: { gap: 2 },
  clarifyItemTitle: { fontSize: 13, fontFamily: fonts.semibold, color: colors.text },
  clarifyItemQuote: { fontSize: 11, fontFamily: fonts.regular, color: colors.textMuted },
  clarifyChips: { flexDirection: 'row', gap: 6 },
  chip: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  chipRecommended: {
    backgroundColor: '#eff6ff',
    borderColor: colors.blue,
  },
  chipPressed: { backgroundColor: colors.blue },
  chipText: { fontSize: 11.5, fontFamily: fonts.medium, color: colors.textSecondary },
  chipTextRecommended: { fontFamily: fonts.bold, color: colors.blue },

  list: { gap: 8 },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    ...shadow(1),
  },
  itemDone: { opacity: 0.55 },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkDone: { backgroundColor: colors.blue, borderColor: colors.blue },
  body: { flex: 1, minWidth: 0, gap: 5 },
  title: { fontSize: 14, fontFamily: fonts.semibold, color: colors.text, lineHeight: 19 },
  titleDone: { textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 2 },
  metaChip: {
    fontSize: 11,
    fontFamily: fonts.semibold,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.subtle,
    color: colors.textSecondary,
    ...tabular,
  },
  metaChipUrgent: { backgroundColor: colors.amberSoft, color: colors.amber },
  quote: { fontSize: 12, color: colors.textMuted, lineHeight: 17, fontFamily: fonts.regular },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
