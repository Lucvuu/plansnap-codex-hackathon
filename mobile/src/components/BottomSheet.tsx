// Shared bottom-sheet shell (backdrop, grabber, title, close button, keyboard avoidance).
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';

import { Icon } from './Icon';

interface Props {
  visible: boolean;
  /** Omit to let the content draw its own header (e.g. an iOS-style Hủy | title | Lưu bar). */
  title?: string;
  /** Grouped-list background (light grey) instead of white, for Settings-style forms. */
  grouped?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, title, grouped, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {/* Android is edge-to-edge (the window no longer resizes for the keyboard), so pad on both. */}
      <KeyboardAvoidingView behavior={Platform.OS === 'web' ? undefined : 'padding'} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Đóng" />
        <View
          style={[styles.sheet, grouped && { backgroundColor: colors.bg }, { paddingBottom: 24 + insets.bottom }]}
          role="dialog"
          aria-modal>
          <View style={styles.grabber} />
          {title !== undefined && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Đóng" hitSlop={8}>
                <Icon name="close" size={14} color={colors.textSecondary} strokeWidth={2.4} />
              </Pressable>
            </View>
          )}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
});
