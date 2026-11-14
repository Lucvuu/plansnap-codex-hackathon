// Tab 1 — Quét ảnh (capture screenshots → extract → schedule)
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { Button, InlineAlert, LinkButton, PillButton } from '@/components/ui';
import { successHaptic } from '@/lib/haptics';
import { PermissionDeniedError, pickImages, type PickSource } from '@/lib/pick-images';
import { MAX_IMAGES, useApp } from '@/state/AppStore';
import { colors, fonts, shadow, tabular } from '@/theme';

export default function CaptureScreen() {
  const { images, isScanning, hasKey, addImages, removeImage, loadPreset, runExtraction } = useApp();
  const toast = useToast();
  const [picking, setPicking] = useState<PickSource | null>(null);
  const [progressText, setProgressText] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [bar] = useState(() => new Animated.Value(0));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const animateBar = (pct: number) =>
    Animated.timing(bar, { toValue: pct, duration: 250, useNativeDriver: false }).start();

  const onPick = async (source: PickSource) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast(`Tối đa ${MAX_IMAGES} ảnh mỗi lần quét.`, 'warning');
      return;
    }
    setPicking(source);
    try {
      const picked = await pickImages(source, remaining);
      if (picked.length) addImages(picked);
    } catch (err) {
      const e = err as Error;
      toast(err instanceof PermissionDeniedError ? e.message : `Lỗi nén ảnh: ${e.message}`, err instanceof PermissionDeniedError ? 'warning' : 'error');
    } finally {
      setPicking(null);
    }
  };

  const onScan = async () => {
    if (!images.length || isScanning) return;
    const startedAt = Date.now();
    setElapsed(0);
    setProgressText('Đang gửi ảnh tới Gemini Vision...');
    bar.setValue(0);
    animateBar(24);
    const tick = setInterval(() => setElapsed(Date.now() - startedAt), 100);
    timers.current.push(
      setTimeout(() => {
        animateBar(68);
        setProgressText('Đang đối chiếu câu trích & thời hạn...');
      }, 450),
    );

    const ok = await runExtraction();
    clearInterval(tick);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setElapsed(Date.now() - startedAt);

    if (!ok) {
      setProgressText(null);
      return;
    }
    successHaptic();
    animateBar(100);
    setProgressText('Hoàn tất xếp lịch!');
    timers.current.push(
      setTimeout(() => {
        setProgressText(null);
        bar.setValue(0);
        router.navigate('/tasks');
      }, 220),
    );
  };

  const count = images.length;

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View>
        <Text style={styles.h1} role="heading">
          Thêm thông báo
        </Text>
        <Text style={styles.lead}>Chọn ảnh Zalo, LMS, slide hoặc chụp trực tiếp ghi chú.</Text>
      </View>

      <View style={styles.surface}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filmstrip}>
          {images.map((img, idx) => (
            <View key={img.id} style={styles.previewItem}>
              <Image source={{ uri: img.uri }} style={styles.previewImg} accessibilityLabel={img.name || `Ảnh ${idx + 1}`} />
              <Pressable
                role="button"
                accessibilityLabel="Xóa ảnh"
                hitSlop={8}
                onPress={() => removeImage(img.id)}
                style={styles.previewRemove}>
                <Icon name="close" size={11} color="#fff" strokeWidth={3} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <Button
        label={count > 0 ? `Trích xuất ${count} ảnh & Xếp lịch` : 'Trích xuất & Xếp lịch'}
        onPress={onScan}
        disabled={count === 0}
        loading={isScanning}
      />

      {progressText && (
        <View style={styles.progress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>{progressText}</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: bar.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
        </View>
      )}

      {!hasKey && (
        <InlineAlert action={<LinkButton label="Cài đặt" onPress={() => router.navigate('/settings')} />}>
          Nhập Gemini API Key để AI đọc ảnh thật của bạn.
        </InlineAlert>
      )}

      <View style={styles.quickTry}>
        <Text style={styles.quickTryLabel}>Thử nhanh:</Text>
        <PillButton label="3 ảnh Zalo / LMS" onPress={() => loadPreset('student')} disabled={isScanning} />
        <PillButton label="Ghi chú viết tay" onPress={() => loadPreset('judge')} disabled={isScanning} />
      </View>
    </ScrollView>
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
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
      <View style={styles.tileIcon}>
        {busy ? <ActivityIndicator size="small" color={colors.blue} /> : <Icon name={icon} size={22} color={colors.blue} strokeWidth={1.8} />}
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSub}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  h1: { fontSize: 22, fontFamily: fonts.bold, letterSpacing: -0.5, color: colors.text },
  lead: { fontSize: 13, color: colors.textMuted, marginTop: 3, fontFamily: fonts.regular },
  surface: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, ...shadow(1) },
  tiles: { flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  tilePressed: { backgroundColor: colors.blueSoft, borderColor: colors.blueBorder, transform: [{ scale: 0.98 }] },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    ...shadow(1),
  },
  tileTitle: { fontSize: 13.5, fontFamily: fonts.semibold, color: colors.text },
  tileSub: { fontSize: 11.5, color: colors.textMuted, fontFamily: fonts.regular },
  hint: { textAlign: 'center', fontSize: 11.5, color: colors.textMuted, marginTop: 10, fontFamily: fonts.regular },
  filmstrip: { gap: 10, paddingVertical: 2 },
  previewItem: {
    width: 84,
    height: 84,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadow(2),
  },
  previewImg: { width: '100%', height: '100%' },
  previewSize: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(17,24,39,0.72)',
    color: '#fff',
    fontSize: 9.5,
    fontFamily: fonts.semibold,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    overflow: 'hidden',
    ...tabular,
  },
  previewRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(17,24,39,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: { backgroundColor: colors.surface, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, gap: 6 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12.5, fontFamily: fonts.semibold, color: colors.blue },
  progressTrack: { height: 5, backgroundColor: colors.subtle, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.blue },
  quickTry: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingTop: 4 },
  quickTryLabel: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.medium },
});
