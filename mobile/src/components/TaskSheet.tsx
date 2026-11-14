// Bottom sheet for adding / editing a task (port of #task-modal-backdrop).
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { defaultNewDeadline } from '@/lib/format';
import type { Task } from '@/lib/types';
import type { TaskInput } from '@/state/AppStore';
import { colors, fonts, radii, shadow, type } from '@/theme';

import { BottomSheet } from './BottomSheet';
import { DeadlineField } from './DeadlineField';
import { Icon } from './Icon';
import { Button } from './ui';

const DURATIONS = [30, 45, 60, 90, 120, 180, 240];

const MODES = [
  { value: 'edf', label: 'Tự xếp giờ rảnh' },
  { value: 'fixed', label: 'Giờ cố định' },
] as const;

function durationLabel(min: number) {
  // Hours only for clean half-hour multiples (90 → "1.5 giờ"); otherwise minutes (75 → "75 phút").
  if (min < 60 || min % 30 !== 0) return `${min} phút`;
  return `${min / 60} giờ`;
}

interface Props {
  visible: boolean;
  task: Task | null; // null → create
  defaultMode?: 'edf' | 'fixed';
  /** Changes on every open so the form re-initialises from `task`. */
  formKey: number;
  onClose: () => void;
  onSubmit: (input: TaskInput) => void;
  /** Adds a delete action when editing an existing task. Omit to hide it (the caller owns the removal). */
  onDelete?: (id: string) => void;
}

export function TaskSheet({ visible, task, defaultMode = 'edf', formKey, onClose, onSubmit, onDelete }: Props) {
  const isFixedDefault = task ? Boolean(task.fixed_start_iso) : defaultMode === 'fixed';
  const heading = task
    ? isFixedDefault
      ? 'Chỉnh sửa lịch cố định'
      : 'Chỉnh sửa đầu việc'
    : isFixedDefault
      ? 'Thêm lịch mới'
      : 'Thêm đầu việc mới';

  return (
    <BottomSheet visible={visible} title={heading} onClose={onClose}>
      <TaskForm
        key={formKey}
        task={task}
        defaultMode={defaultMode}
        onClose={onClose}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </BottomSheet>
  );
}

function initialDeadline(task: Task | null): Date {
  const d = task?.deadline_iso ? new Date(task.deadline_iso) : null;
  return d && !isNaN(d.getTime()) ? d : defaultNewDeadline();
}

function initialFixedStart(task: Task | null): Date {
  const d = task?.fixed_start_iso ? new Date(task.fixed_start_iso) : null;
  if (d && !isNaN(d.getTime())) return d;
  const next = new Date(Date.now() + 3600000);
  next.setMinutes(0, 0, 0);
  return next;
}

const sameInstant = (iso: string | null | undefined, d: Date) => !!iso && new Date(iso).getTime() === d.getTime();

/** True when saving the form would change the stored task (so "Lưu" is worth enabling). */
function isTaskChanged(
  task: Task,
  form: { mode: 'edf' | 'fixed'; title: string; deadline: Date; fixedStart: Date; minutes: number },
): boolean {
  if (task.needs_confirmation) return true; // saving confirms the deadline
  if (form.title.trim() !== task.title) return true;
  if (form.minutes !== (task.estimated_minutes || 60)) return true;
  if ((form.mode === 'fixed') !== Boolean(task.fixed_start_iso)) return true;
  return form.mode === 'fixed'
    ? !sameInstant(task.fixed_start_iso, form.fixedStart)
    : !sameInstant(task.deadline_iso, form.deadline);
}

function TaskForm({
  task,
  defaultMode = 'edf',
  onClose,
  onSubmit,
  onDelete,
}: Pick<Props, 'task' | 'defaultMode' | 'onClose' | 'onSubmit' | 'onDelete'>) {
  const [mode, setMode] = useState<'edf' | 'fixed'>(() =>
    task ? (task.fixed_start_iso ? 'fixed' : 'edf') : defaultMode,
  );
  const [title, setTitle] = useState(() => task?.title ?? '');
  const [deadline, setDeadline] = useState(() => initialDeadline(task));
  const [fixedStart, setFixedStart] = useState(() => initialFixedStart(task));
  const [minutes, setMinutes] = useState(() => task?.estimated_minutes || 60);
  const [titleFocused, setTitleFocused] = useState(false);

  const durationOptions = DURATIONS.includes(minutes) ? DURATIONS : [...DURATIONS, minutes].sort((a, b) => a - b);
  const canSave =
    title.trim().length > 0 && (!task || isTaskChanged(task, { mode, title, deadline, fixedStart, minutes }));
  const deleteLabel = task?.fixed_start_iso ? 'Xóa lịch cố định' : 'Xóa đầu việc';

  const submit = () => {
    if (!canSave) return;
    if (mode === 'fixed') {
      const endDate = new Date(fixedStart.getTime() + minutes * 60000);
      onSubmit({
        id: task?.id,
        title: title.trim(),
        fixedStartIso: fixedStart.toISOString(),
        deadlineIso: endDate.toISOString(),
        minutes,
      });
    } else {
      onSubmit({
        id: task?.id,
        title: title.trim(),
        fixedStartIso: null,
        deadlineIso: deadline.toISOString(),
        minutes,
      });
    }
    onClose();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.body}>
      <View style={styles.segmentTrack} role="tablist">
        {MODES.map((m) => {
          const active = mode === m.value;
          return (
            <Pressable
              key={m.value}
              role="tab"
              aria-selected={active}
              accessibilityLabel={m.label}
              onPress={() => setMode(m.value)}
              style={[styles.segmentBtn, active && styles.segmentBtnActive]}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.group}>
        <Text style={type.label}>{mode === 'fixed' ? 'Tên lịch hẹn / Đầu việc' : 'Tên đầu việc'}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={mode === 'fixed' ? 'Ví dụ: Họp nhóm đồ án' : 'Ví dụ: Nộp báo cáo Kinh tế'}
          placeholderTextColor={colors.textFaint}
          style={[styles.input, titleFocused && styles.inputFocused]}
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
          autoFocus={!task}
          returnKeyType="done"
          onSubmitEditing={submit}
          accessibilityLabel="Tên đầu việc"
        />
      </View>

      {mode === 'fixed' ? (
        <View style={styles.group}>
          <Text style={type.label}>Thời gian bắt đầu</Text>
          <DeadlineField value={fixedStart} onChange={setFixedStart} />
        </View>
      ) : (
        <View style={styles.group}>
          <Text style={type.label}>Hạn chót</Text>
          <DeadlineField value={deadline} onChange={setDeadline} />
        </View>
      )}

      <View style={styles.group}>
        <Text style={type.label}>Thời lượng dự kiến</Text>
        <View style={styles.pills} role="radiogroup">
          {durationOptions.map((m) => {
            const active = m === minutes;
            return (
              <Pressable
                key={m}
                role="radio"
                aria-checked={active}
                accessibilityLabel={durationLabel(m)}
                onPress={() => setMinutes(m)}
                style={[styles.pill, active && styles.pillActive]}>
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{durationLabel(m)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.btnRow}>
        <Button label="Hủy" variant="secondary" onPress={onClose} />
        <Button label="Lưu" onPress={submit} disabled={!canSave} />
      </View>

      {task && onDelete ? (
        <Pressable
          role="button"
          accessibilityLabel={deleteLabel}
          onPress={() => {
            onDelete(task.id);
            onClose();
          }}
          style={({ pressed }) => [styles.deleteBtn, pressed && { backgroundColor: colors.redSoft }]}>
          <Icon name="trash" size={15} color={colors.red} />
          <Text style={styles.deleteText}>{deleteLabel}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { gap: 16 },
  group: { gap: 6 },
  input: {
    height: 44,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  inputFocused: { borderColor: colors.blue, backgroundColor: colors.surface },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  pillActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  pillText: { fontSize: 12.5, fontFamily: fonts.semibold, color: colors.textBody },
  pillTextActive: { color: colors.surface },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: colors.subtle,
    borderRadius: radii.md + 2,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  segmentBtnActive: { backgroundColor: colors.surface, ...shadow(1) },
  segmentText: { fontSize: 12.5, fontFamily: fonts.semibold, color: colors.textMuted },
  segmentTextActive: { fontFamily: fonts.bold, color: colors.blueHover },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  deleteBtn: {
    height: 44,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.red },
});
