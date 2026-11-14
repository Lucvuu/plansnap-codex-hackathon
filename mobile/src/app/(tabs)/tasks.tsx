// Tab 2 — Đầu việc (extracted tasks backlog; unclear deadlines are settled on the Smart Review screen)
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { TaskSheet } from '@/components/TaskSheet';
import { EmptyState, IconButton, Screen, ScreenHeader, SettingsButton, TagPill } from '@/components/ui';
import { formatDateTimeLabel, formatDeadlineLabel } from '@/lib/format';
import { tapHaptic } from '@/lib/haptics';
import type { Task } from '@/lib/types';
import { useApp } from '@/state/AppStore';
import { colors, fonts, radii, shadow, tabular } from '@/theme';

export default function TasksScreen() {
  const { tasks, reviewCount, toggleTask, deleteTask, upsertTask } = useApp();
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
      <Screen>
        <ScreenHeader
          title="Đầu việc"
          subtitle={total === 0 ? 'Chưa có đầu việc nào' : `${pendingCount} cần làm · ${doneCount} đã xong`}
          right={
            <>
              <IconButton icon="plus" label="Thêm đầu việc" onPress={() => openSheet(null)} />
              <SettingsButton />
            </>
          }
        />

        {total > 0 && (
          <View
            style={styles.thinTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            accessibilityLabel={`Đã xong ${doneCount} trên ${total} đầu việc`}>
            <View style={[styles.thinFill, { width: `${pct}%` }]} />
          </View>
        )}

        {reviewCount > 0 && (
          <Pressable
            role="button"
            accessibilityLabel={`${reviewCount} hạn chót cần kiểm tra. Mở màn hình kiểm tra`}
            onPress={() => router.push('/review')}
            style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}>
            <Icon name="alert-circle" size={18} color={colors.blue} />
            <View style={styles.bannerBody}>
              <Text style={styles.bannerTitle}>{reviewCount} hạn chót cần kiểm tra</Text>
              <Text style={styles.bannerHint}>Xác nhận một lần để xếp vào lịch</Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.blue} />
          </Pressable>
        )}

        {total === 0 ? (
          <EmptyState>
            Chụp hoặc nạp ảnh thông báo ở tab <Text style={{ fontFamily: fonts.bold }}>Quét ảnh</Text>, hoặc bấm{' '}
            <Text style={{ fontFamily: fonts.bold }}>+</Text> để thêm việc thủ công.
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
              />
            ))}
          </View>
        )}
      </Screen>

      <TaskSheet
        visible={sheet.visible}
        task={sheet.task}
        formKey={sheet.nonce}
        onClose={() => setSheet((s) => ({ ...s, visible: false }))}
        onSubmit={upsertTask}
        onDelete={deleteTask}
      />
    </>
  );
}

type DeadlineTone = 'urgent' | 'soon' | 'muted';

const SOON_MS = 72 * 3600000;

/** Deadline line for a row. The wording carries the status too ("Quá hạn" / "Gấp" / "Sắp đến hạn"), never colour alone. */
function deadlineLine(task: Task): { text: string; tone: DeadlineTone } {
  if (task.fixed_start_iso) return { text: `Cố định · ${formatDateTimeLabel(task.fixed_start_iso)}`, tone: 'muted' };
  const dl = formatDeadlineLabel(task.deadline_iso);
  if (dl.urgent) return { text: dl.text, tone: 'urgent' };
  const due = new Date(task.deadline_iso ?? '').getTime();
  if (isNaN(due)) return { text: dl.text, tone: 'muted' }; // "Chưa rõ hạn"
  if (due - Date.now() < SOON_MS) return { text: `Sắp đến hạn · ${dl.text}`, tone: 'soon' };
  return { text: `Hạn ${dl.text}`, tone: 'muted' };
}

function TaskRow({ task, onToggle, onEdit }: { task: Task; onToggle: () => void; onEdit: () => void }) {
  const done = Boolean(task.completed);
  const dl = deadlineLine(task);
  const minutes = `${Number(task.estimated_minutes) || 60} phút`;
  return (
    <View style={[styles.item, done && styles.itemDone]}>
      {/* Sibling of the edit target (not nested), padded so the whole left edge of the row toggles. */}
      <Pressable
        role="checkbox"
        aria-checked={done}
        accessibilityLabel={`Đánh dấu hoàn thành: ${task.title}`}
        onPress={onToggle}
        style={styles.checkHit}>
        <View style={[styles.check, done && styles.checkDone]}>
          {done && <Icon name="check" size={13} color={colors.surface} strokeWidth={3} />}
        </View>
      </Pressable>

      <Pressable
        role="button"
        accessibilityLabel={`Sửa đầu việc: ${task.title}`}
        onPress={onEdit}
        style={({ pressed }) => [styles.body, pressed && { opacity: 0.6 }]}>
        <View style={styles.bodyText}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, done && styles.titleDone]}>{task.title}</Text>
            {task.needs_confirmation && !done ? <TagPill label="Cần xác nhận" tone="amber" /> : null}
          </View>
          {done ? (
            <Text style={[styles.meta, { color: colors.textFaint }]}>Đã hoàn thành · {minutes}</Text>
          ) : (
            <Text style={styles.meta}>
              <Text style={dl.tone === 'urgent' ? styles.metaUrgent : dl.tone === 'soon' ? styles.metaSoon : null}>
                {dl.text}
              </Text>
              {' · '}
              {minutes}
            </Text>
          )}
          {task.source_quote ? (
            <Text style={styles.quote} numberOfLines={1}>
              “{task.source_quote}”
            </Text>
          ) : null}
        </View>
        <Icon name="chevron-right" size={16} color={colors.textFaint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  thinTrack: { height: 3, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' },
  thinFill: { height: '100%', backgroundColor: colors.green },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blueSoft,
    borderWidth: 1,
    borderColor: colors.brand100,
    borderRadius: radii.xl,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bannerPressed: { backgroundColor: colors.brand100, borderColor: colors.blueBorder },
  bannerBody: { flex: 1, minWidth: 0, gap: 1 },
  bannerTitle: { fontSize: 13.5, fontFamily: fonts.bold, color: colors.blueNavy, ...tabular },
  bannerHint: { fontSize: 11.5, fontFamily: fonts.medium, color: colors.textSecondary },

  list: { gap: 8 },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'stretch',
    ...shadow(1),
  },
  itemDone: { opacity: 0.6 },
  checkHit: { paddingLeft: 14, paddingRight: 12, justifyContent: 'center', minHeight: 48 },
  check: {
    width: 20,
    height: 20,
    borderRadius: radii.xs,
    borderWidth: 1.8,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.blue, borderColor: colors.blue },
  body: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingRight: 12 },
  bodyText: { flex: 1, minWidth: 0, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, minWidth: 0, fontSize: 14, fontFamily: fonts.semibold, color: colors.text, lineHeight: 19 },
  titleDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  meta: { fontSize: 11.5, fontFamily: fonts.semibold, color: colors.textMuted, lineHeight: 16, ...tabular },
  metaUrgent: { color: colors.red },
  metaSoon: { color: colors.amber },
  quote: { fontSize: 11.5, fontFamily: fonts.regular, color: colors.textFaint, lineHeight: 16 },
});
