// Bottom sheet for adding / editing a task (port of #task-modal-backdrop).
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { defaultNewDeadline } from '@/lib/format';
import type { Task } from '@/lib/types';
import type { TaskInput } from '@/state/AppStore';
import { colors, fonts } from '@/theme';

import { DeadlineField } from './DeadlineField';
import { Icon } from './Icon';
import { Button } from './ui';

const DURATIONS = [30, 45, 60, 90, 120, 180, 240];

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
}

export function TaskSheet({ visible, task, defaultMode = 'edf', formKey, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const isFixedDefault = task ? Boolean(task.fixed_start_iso) : defaultMode === 'fixed';
  const heading = task
    ? isFixedDefault
      ? 'Chỉnh sửa lịch cố định'
      : 'Chỉnh sửa đầu việc'
    : isFixedDefault
      ? 'Thêm lịch mới'
      : 'Thêm đầu việc mới';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {/* Android is edge-to-edge (the window no longer resizes for the keyboard), so pad on both. */}
      <KeyboardAvoidingView behavior={Platform.OS === 'web' ? undefined : 'padding'} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Đóng" />
        <View style={[styles.sheet, { paddingBottom: 24 + insets.bottom }]} role="dialog" aria-modal>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>{heading}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Đóng" hitSlop={8}>
              <Icon name="close" size={14} color={colors.textSecondary} strokeWidth={2.4} />
            </Pressable>
          </View>
          <TaskForm key={formKey} task={task} defaultMode={defaultMode} onClose={onClose} onSubmit={onSubmit} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
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

function TaskForm({
  task,
  defaultMode = 'edf',
  onClose,
  onSubmit,
}: Pick<Props, 'task' | 'defaultMode' | 'onClose' | 'onSubmit'>) {
  const [mode, setMode] = useState<'edf' | 'fixed'>(() =>
    task ? (task.fixed_start_iso ? 'fixed' : 'edf') : defaultMode,
  );
  const [title, setTitle] = useState(() => task?.title ?? '');
  const [deadline, setDeadline] = useState(() => initialDeadline(task));
  const [fixedStart, setFixedStart] = useState(() => initialFixedStart(task));
  const [minutes, setMinutes] = useState(() => task?.estimated_minutes || 60);

  const durationOptions = DURATIONS.includes(minutes) ? DURATIONS : [...DURATIONS, minutes].sort((a, b) => a - b);
  const canSave = title.trim().length > 0;

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
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
      <View style={styles.segmentTrack} role="tablist">
        <Pressable
          role="tab"
          aria-selected={mode === 'edf'}
          onPress={() => setMode('edf')}
          style={[styles.segmentBtn, mode === 'edf' && styles.segmentBtnActive]}>
          <Text style={[styles.segmentText, mode === 'edf' && styles.segmentTextActive]}>Tự xếp giờ rảnh</Text>
        </Pressable>
        <Pressable
          role="tab"
          aria-selected={mode === 'fixed'}
          onPress={() => setMode('fixed')}
          style={[styles.segmentBtn, mode === 'fixed' && styles.segmentBtnActive]}>
          <Text style={[styles.segmentText, mode === 'fixed' && styles.segmentTextActive]}>Giờ cố định</Text>
        </Pressable>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>{mode === 'fixed' ? 'Tên lịch hẹn / Đầu việc' : 'Tên đầu việc'}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={mode === 'fixed' ? 'Ví dụ: Họp nhóm đồ án' : 'Ví dụ: Nộp báo cáo Kinh tế'}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoFocus={!task}
          returnKeyType="done"
          onSubmitEditing={submit}
          accessibilityLabel="Tên đầu việc"
        />
      </View>

      {mode === 'fixed' ? (
        <View style={styles.group}>
          <Text style={styles.label}>Thời gian bắt đầu</Text>
          <DeadlineField value={fixedStart} onChange={setFixedStart} />
        </View>
      ) : (
        <View style={styles.group}>
          <Text style={styles.label}>Hạn chót</Text>
          <DeadlineField value={deadline} onChange={setDeadline} />
        </View>
      )}

      <View style={styles.group}>
        <Text style={styles.label}>Thời lượng dự kiến</Text>
        <View style={styles.pills} role="radiogroup">
          {durationOptions.map((m) => {
            const active = m === minutes;
            return (
              <Pressable
                key={m}
                role="radio"
                aria-checked={active}
                onPress={() => setMinutes(m)}
                style={[styles.pill, active && styles.pillActive]}>
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{durationLabel(m)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.btnRow}>
        <Button label="Hủy" variant="outline" onPress={onClose} />
        <Button label="Lưu" onPress={submit} disabled={!canSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 18,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    maxHeight: '90%',
  },
  grabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 16, fontFamily: fonts.bold, color: colors.text },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { gap: 14 },
  group: { gap: 6 },
  label: { fontSize: 12, fontFamily: fonts.semibold, color: colors.textSecondary },
  input: {
    height: 40,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: colors.text,
    fontFamily: fonts.regular,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  pillText: { fontSize: 12.5, fontFamily: fonts.semibold, color: colors.textSecondary },
  pillTextActive: { color: '#fff' },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: colors.subtle,
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
  },
  segmentText: { fontSize: 12.5, fontFamily: fonts.semibold, color: colors.textSecondary },
  segmentTextActive: { color: colors.text },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
