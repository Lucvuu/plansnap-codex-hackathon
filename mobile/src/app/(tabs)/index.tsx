// Tab 1 — Quét thông báo (capture screenshots → extract → schedule)
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Icon, type IconName } from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { Button, InlineAlert, PillButton, Screen, ScreenHeader, SettingsButton } from '@/components/ui';
import { successHaptic } from '@/lib/haptics';
import { PermissionDeniedError, pickImages, type PickSource } from '@/lib/pick-images';
import type { CapturedImage } from '@/lib/types';
import { MAX_IMAGES, useApp } from '@/state/AppStore';
import { brandShadow, colors, fonts, radii, type } from '@/theme';

export default function CaptureScreen() {
  const { images, isScanning, hasKey, addImages, removeImage, loadPreset, runExtraction } = useApp();
  const toast = useToast();
  const [picking, setPicking] = useState<PickSource | 'challenge' | null>(null);

  const pick = async (source: PickSource, limit: number, busy: PickSource | 'challenge' = source) => {
    setPicking(busy);
    try {
      return await pickImages(source, limit);
    } catch (err) {
      const e = err as Error;
      toast(err instanceof PermissionDeniedError ? e.message : `Lỗi nén ảnh: ${e.message}`, err instanceof PermissionDeniedError ? 'warning' : 'error');
      return [];
    } finally {
      setPicking(null);
    }
  };

  const onPick = async (source: PickSource) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast(`Tối đa ${MAX_IMAGES} ảnh mỗi lần quét.`, 'warning');
      return;
    }
    const picked = await pick(source, remaining);
    if (picked.length) addImages(picked);
  };

  // FR-5.2: one tap → camera → AI → the new task is appended and scheduled, no staging step.
  const onChallenge = async () => {
    const picked = await pick('camera', 1, 'challenge');
    if (picked.length) onScan(picked);
  };

  const onScan = async (direct?: CapturedImage[]) => {
    if (!(direct ?? images).length || isScanning) return;
    const outcome = await runExtraction(direct);
    if (!outcome) return; // the store already explained why in a toast
    successHaptic();
    // Ambiguous deadlines go through Smart Review first; otherwise straight to the week plan.
    if (outcome.needsReview > 0) router.push('/review');
    else router.navigate('/schedule');
  };

  const count = images.length;

  return (
    <Screen>
      <ScreenHeader
        title="Quét thông báo"
        subtitle="Chọn ảnh Zalo, LMS, slide hoặc chụp trực tiếp ghi chú."
        right={<SettingsButton />}
      />

      <View style={styles.upload}>
        <View style={styles.tiles}>
          <CaptureTile
            icon="image"
            title="Thư viện ảnh"
            sub={`Tối đa ${MAX_IMAGES} ảnh`}
            busy={picking === 'library'}
            onPress={() => onPick('library')}
          />
          <CaptureTile
            icon="camera"
            title="Chụp ảnh"
            sub="Mở máy ảnh"
            busy={picking === 'camera'}
            onPress={() => onPick('camera')}
          />
        </View>
        <Text style={styles.hint}>Ảnh được nén ngay trên máy trước khi gửi AI</Text>
      </View>

      {count > 0 && (
        <View style={styles.loaded}>
          <Text style={type.label}>
            Ảnh đã nạp ({count}/{MAX_IMAGES})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filmstrip}>
            {images.map((img, idx) => (
              <View key={img.id} style={styles.thumb}>
                <Image source={{ uri: img.uri }} style={styles.thumbImg} accessibilityLabel={img.name || `Ảnh ${idx + 1}`} />
                <Pressable
                  role="button"
                  accessibilityLabel={`Xóa ảnh ${idx + 1}`}
                  onPress={() => removeImage(img.id)}
                  style={styles.thumbRemove}>
                  <View style={styles.thumbRemoveDot}>
                    <Icon name="close" size={11} color={colors.surface} strokeWidth={3} />
                  </View>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Button
        label="Trích xuất & Tự động xếp lịch"
        icon={<Icon name="play-circle" size={18} color={colors.surface} />}
        onPress={() => onScan()}
        disabled={count === 0}
        loading={isScanning}
      />

      {isScanning && <ReadingCard />}

      <Button
        variant="secondary"
        label="Thử thách viết tay: chụp & xếp ngay"
        icon={<Icon name="camera" size={16} color={colors.textBody} />}
        onPress={onChallenge}
        disabled={isScanning}
        loading={picking === 'challenge'}
      />

      {!hasKey && <InlineAlert>Bản demo chưa kết nối Gemini — chỉ ảnh mẫu bên dưới mới cho kết quả.</InlineAlert>}

      <View style={styles.quickTry}>
        <Text style={type.meta}>Thử nhanh:</Text>
        <PillButton label="3 ảnh Zalo / LMS" onPress={() => loadPreset('student')} disabled={isScanning} />
        <PillButton label="Ghi chú viết tay" onPress={() => loadPreset('judge')} disabled={isScanning} />
      </View>
    </Screen>
  );
}

function CaptureTile({
  icon,
  title,
  sub,
  busy,
  onPress,
}: {
  icon: IconName;
  title: string;
  sub: string;
  busy: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={title}
      accessibilityState={{ busy }}
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
      <View style={styles.tileIcon}>
        {busy ? <ActivityIndicator size="small" color={colors.blue} /> : <Icon name={icon} size={26} color={colors.blue} />}
      </View>
      <Text style={type.cardTitle}>{title}</Text>
      <Text style={type.meta}>{sub}</Text>
    </Pressable>
  );
}

/** Calm "reading" state: one status line + a shimmer bar (v2: no seconds, sizes or model ids). */
function ReadingCard() {
  const [width, setWidth] = useState(0);
  const [sweep] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web', // no native animated module on web
      }),
    );
    // Reduce-motion users get the static bar.
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => {
        if (!reduce && !cancelled) loop.start();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      loop.stop();
    };
  }, [sweep]);

  return (
    <View style={styles.reading} aria-live="polite">
      <Text style={styles.readingText}>Đang đọc thông báo…</Text>
      <View style={styles.shimmerTrack} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-width, width] }) }] },
          ]}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="snapShimmer" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colors.border} />
                <Stop offset="0.5" stopColor={colors.borderStrong} />
                <Stop offset="1" stopColor={colors.border} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#snapShimmer)" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  upload: {
    backgroundColor: colors.blueSoft,
    borderRadius: radii.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.brand400,
    paddingVertical: 18,
    paddingHorizontal: 12,
    gap: 10,
  },
  tiles: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, borderRadius: radii.lg, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', gap: 2 },
  tilePressed: { backgroundColor: colors.brand100, transform: [{ scale: 0.98 }] },
  tileIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...brandShadow('soft'),
  },
  hint: { ...type.meta, textAlign: 'center' },
  loaded: { gap: 8 },
  filmstrip: { gap: 10 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  thumbImg: { width: '100%', height: '100%' },
  // 36pt touch target kept inside the thumbnail (Android ignores hitSlop past a clipping parent); the dot is the 20pt visual.
  thumbRemove: { position: 'absolute', top: 0, right: 0, width: 36, height: 36, alignItems: 'flex-end', padding: 4 },
  thumbRemoveDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reading: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  readingText: { fontSize: 12.5, fontFamily: fonts.semibold, color: colors.blueHover },
  shimmerTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  quickTry: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
});
