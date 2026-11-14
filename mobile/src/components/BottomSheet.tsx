// Shared bottom-sheet shell (backdrop, handle, title, close button, keyboard avoidance).
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, layout, radii } from '@/theme';

import { IconButton } from './ui';

interface Props {
  visible: boolean;
  /** Omit to let the content draw its own header (e.g. an iOS-style Hủy | title | Lưu bar). */
  title?: string;
  /** Grouped-list background (slate canvas) instead of white, for Settings-style forms. */
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
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} role="button" accessibilityLabel="Đóng" />
        <View
          style={[
            styles.sheet,
            grouped && { backgroundColor: colors.bg },
            { paddingBottom: layout.bottom + insets.bottom },
          ]}
          role="dialog"
          aria-modal>
          <View style={styles.handle} />
          {title !== undefined && (
            <View style={styles.header}>
              <Text style={styles.title} role="heading" numberOfLines={1}>
                {title}
              </Text>
              <IconButton icon="close" label="Đóng" onPress={onClose} />
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
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingTop: 10,
    paddingHorizontal: layout.gutter,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 14,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 },
  title: { flex: 1, fontSize: 17, fontFamily: fonts.extrabold, letterSpacing: -0.2, color: colors.text },
});
