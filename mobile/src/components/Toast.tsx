import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radii, shadow } from '@/theme';

import { Icon, type IconName } from './Icon';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
type ShowToast = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ShowToast>(() => {});
const useNativeDriver = Platform.OS !== 'web';

export const useToast = () => useContext(ToastContext);

// Icon + tint per type (status is never colour-only); the light tints stay legible on the ink surface.
const TONE: Record<ToastType, { icon: IconName; color: string }> = {
  info: { icon: 'info', color: colors.blueBorder },
  success: { icon: 'check', color: colors.greenBorder },
  warning: { icon: 'alert-circle', color: colors.amberBorder },
  error: { icon: 'alert-circle', color: colors.redBorder },
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
              top: insets.top + 12,
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
            },
          ]}>
          <Icon name={TONE[toast.type].icon} size={16} color={TONE[toast.type].color} strokeWidth={2.4} />
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.lg,
    zIndex: 9999,
    ...shadow(2),
    elevation: 12,
  },
  text: { color: colors.surface, fontSize: 12.5, fontFamily: fonts.medium, flexShrink: 1 },
});
