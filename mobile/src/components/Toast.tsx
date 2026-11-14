import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
type ShowToast = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ShowToast>(() => {});
const useNativeDriver = Platform.OS !== 'web';

export const useToast = () => useContext(ToastContext);

const DOT: Record<ToastType, string> = {
  info: '#93c5fd',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [anim] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<ShowToast>(
    (message, type = 'info') => {
      setToast({ message, type });
      if (timer.current) clearTimeout(timer.current);
      Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver }).start();
      timer.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver }).start();
      }, 3200);
    },
    [anim],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          role="status"
          style={[
            styles.toast,
            {
              top: insets.top + 62,
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
            },
          ]}>
          <Animated.View style={[styles.dot, { backgroundColor: DOT[toast.type] }]} />
          <Text style={styles.text} numberOfLines={2}>
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.ink,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    zIndex: 9999,
    elevation: 12,
    shadowColor: colors.ink,
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { color: '#fff', fontSize: 12.5, fontFamily: fonts.medium, flexShrink: 1 },
});
