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
  /** Changes on every open so the form re-initialises from `task`. */
  formKey: number;
  onClose: () => void;
  onSubmit: (input: TaskInput) => void;
}

export function TaskSheet({ visible, task, formKey, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {/* Android is edge-to-edge (the window no longer resizes for the keyboard), so pad on both. */}
      <KeyboardAvoidingView behavior={Platform.OS === 'web' ? undefined : 'padding'} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Đóng" />
        <View style={[styles.sheet, { paddingBottom: 24 + insets.bottom }]} role="dialog" aria-modal>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>{task ? 'Chỉnh sửa đầu việc' : 'Thêm đầu việc mới'}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Đóng" hitSlop={8}>
              <Icon name="close" size={14} color={colors.textSecondary} strokeWidth={2.4} />
            </Pressable>
          </View>
          <TaskForm key={formKey} task={task} onClose={onClose} onSubmit={onSubmit} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function initialDeadline(task: Task | null): Date {
  const d = task?.deadline_iso ? new Date(task.deadline_iso) : null;
  return d && !isNaN(d.getTime()) ? d : defaultNewDeadline();
}

function TaskForm({ task, onClose, onSubmit }: Pick<Props, 'task' | 'onClose' | 'onSubmit'>) {
  const [title, setTitle] = useState(() => task?.title ?? '');
  const [deadline, setDeadline] = useState(() => initialDeadline(task));
  const [minutes, setMinutes] = useState(() => task?.estimated_minutes || 60);

  const durationOptions = DURATIONS.includes(minutes) ? DURATIONS : [...DURATIONS, minutes].sort((a, b) => a - b);
  const canSave = title.trim().length > 0;

  const submit = () => {
    if (!canSave) return;
    onSubmit({ id: task?.id, title: title.trim(), deadlineIso: deadline.toISOString(), minutes });
    onClose();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
      <View style={styles.group}>
        <Text style={styles.label}>Tên đầu việc</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ví dụ: Nộp báo cáo Kinh tế"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoFocus={!task}
          returnKeyType="done"
          onSubmitEditing={submit}
          accessibilityLabel="Tên đầu việc"
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Hạn chót</Text>
        <DeadlineField value={deadline} onChange={setDeadline} />
      </View>

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
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
