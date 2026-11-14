// Tab 1 — Lịch tuần (EDF-scheduled sessions, fixed schedule, 7-day strip, + Thêm lịch, .ics export)
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Icon } from '@/components/Icon';
import { TaskSheet } from '@/components/TaskSheet';
import { useToast } from '@/components/Toast';
import { EmptyState, GroupLabel, IconButton, Screen, ScreenHeader, SettingsButton, TagPill } from '@/components/ui';
import { exportIcs } from '@/lib/export-ics';
import { DAY_FULL, DAY_SHORT, formatDayKey, formatTimeHM } from '@/lib/format';
import { getGoogleCalendarLink } from '@/lib/ical';
import type { ScheduledEvent } from '@/lib/types';
import { useApp } from '@/state/AppStore';
import { brandShadow, colors, fonts, layout, radii, shadow, tabular, type } from '@/theme';

const pad = (n: number) => String(n).padStart(2, '0');

export default function ScheduleScreen() {
  const { schedule, upsertTask } = useApp();
  const toast = useToast();
  const [selectedDayKey, setSelectedDayKey] = useState<string>('all');
  const [exporting, setExporting] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [manualModal, setManualModal] = useState<{ visible: boolean; nonce: number }>({ visible: false, nonce: 0 });

  const days = useMemo(() => {
    const eventDayKeys = new Set(schedule.map((ev) => formatDayKey(ev.start)));
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const key = formatDayKey(d);
      const hasEvents = eventDayKeys.has(key);
      return {
        key,
        name: i === 0 ? 'Nay' : DAY_SHORT[d.getDay()],
        num: d.getDate(),
        hasEvents,
        a11y: `${i === 0 ? 'Hôm nay, ' : ''}${DAY_FULL[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}${hasEvents ? ', có phiên' : ''}`,
      };
    });
  }, [schedule]);

  const groups = useMemo(() => {
    const filtered =
      selectedDayKey === 'all' ? schedule : schedule.filter((ev) => formatDayKey(ev.start) === selectedDayKey);
    const map = new Map<string, { date: Date; items: ScheduledEvent[] }>();
    for (const ev of filtered) {
      const key = formatDayKey(ev.start);
      if (!map.has(key)) map.set(key, { date: new Date(ev.start), items: [] });
      map.get(key)!.items.push(ev);
    }
    return [...map.entries()];
  }, [schedule, selectedDayKey]);

  const onExport = async () => {
    if (!schedule.length || exporting) return;
    setExporting(true);
    try {
      await exportIcs(schedule);
      if (Platform.OS === 'web') toast('Đã xuất tệp lịch .ics!', 'success');
    } catch (err) {
      toast(`Không xuất được .ics: ${(err as Error).message}`, 'error');
    } finally {
      setExporting(false);
    }
  };

  const onAddFromPhoto = () => {
    setAddSheetOpen(false);
    router.navigate('/');
    toast('Chọn hoặc chụp ảnh mới để nối vào lịch.', 'info');
  };

  const onAddManual = () => {
    setAddSheetOpen(false);
    setManualModal((s) => ({ visible: true, nonce: s.nonce + 1 }));
  };

  const today = new Date();
  const todayKey = formatDayKey(today);

  return (
    <>
      <Screen>
        <ScreenHeader
          title="Lịch tuần"
          subtitle={`${DAY_FULL[today.getDay()]}, ${today.getDate()} tháng ${today.getMonth() + 1} · ${
            schedule.length ? `${schedule.length} phiên` : 'chưa có phiên nào'
          }`}
          right={
            <>
              <IconButton icon="plus" tone="primary" label="Thêm lịch" onPress={() => setAddSheetOpen(true)} />
              <IconButton
                icon="download"
                label="Xuất .ics"
                onPress={onExport}
                disabled={schedule.length === 0 || exporting}
              />
              <SettingsButton />
            </>
          }
        />

        <ScrollView
          horizontal
          role="tablist"
          showsHorizontalScrollIndicator={false}
          style={styles.strip}
          contentContainerStyle={styles.stripContent}>
          <DayPill
            name="Tất cả"
            num="∞"
            label="Tất cả các ngày"
            active={selectedDayKey === 'all'}
            onPress={() => setSelectedDayKey('all')}
          />
          {days.map((d) => (
            <DayPill
              key={d.key}
              name={d.name}
              num={String(d.num)}
              label={d.a11y}
              dot={d.hasEvents}
              active={selectedDayKey === d.key}
              onPress={() => setSelectedDayKey(d.key)}
            />
          ))}
        </ScrollView>

        {groups.length === 0 ? (
          <EmptyState>
            {schedule.length === 0
              ? 'Chưa có phiên nào được xếp. Bấm nút + ở góc trên để quét ảnh hoặc nhập thủ công.'
              : 'Không có phiên làm việc nào trong ngày đã chọn.'}
          </EmptyState>
        ) : (
          groups.map(([key, group]) => {
            const d = group.date;
            return (
              <View key={key} style={styles.dayGroup}>
                <GroupLabel>
                  {`${key === todayKey ? 'Hôm nay · ' : ''}${DAY_FULL[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`}
                </GroupLabel>
                {group.items.map((ev) => (
                  <SessionCard key={ev.id} ev={ev} />
                ))}
              </View>
            );
          })
        )}
      </Screen>

      {/* Thêm lịch: từ ảnh chụp hoặc thủ công */}
      <BottomSheet visible={addSheetOpen} title="Thêm lịch mới" onClose={() => setAddSheetOpen(false)}>
        <View style={styles.sheetOpts}>
          <AddOption
            icon="camera"
            title="Từ ảnh chụp / Camera"
            desc="Chụp hoặc chọn ảnh Zalo, LMS, ghi chú viết tay để tự trích xuất & nối vào lịch"
            onPress={onAddFromPhoto}
          />
          <AddOption
            icon="edit"
            title="Thêm lịch thủ công"
            desc="Tự đặt khung giờ cố định hoặc nhập hạn chót để máy tự xếp vào giờ rảnh"
            onPress={onAddManual}
          />
        </View>
      </BottomSheet>

      <TaskSheet
        visible={manualModal.visible}
        task={null}
        defaultMode="fixed"
        formKey={manualModal.nonce}
        onClose={() => setManualModal((s) => ({ ...s, visible: false }))}
        onSubmit={upsertTask}
      />
    </>
  );
}

function DayPill({
  name,
  num,
  label,
  active,
  dot,
  onPress,
}: {
  name: string;
  num: string;
  /** Accessibility label (the visible text is abbreviated). */
  label: string;
  active: boolean;
  dot?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.dayPill, active && styles.dayPillActive, pressed && !active && styles.pressed]}>
      <Text style={[styles.wdName, active && styles.onBrand]}>{name}</Text>
      <Text style={[styles.wdNum, active && styles.onBrand]}>{num}</Text>
      <View style={[styles.wdDot, !dot && { opacity: 0 }, active && { backgroundColor: colors.surface }]} />
    </Pressable>
  );
}

function SessionCard({ ev }: { ev: ScheduledEvent }) {
  const urgent = ev.isUrgent || ev.isPastDeadline;
  const safe = !ev.isFixed && !urgent;
  // A fixed event's deadline_iso is only its own end time (scheduler fallback), so it is not shown as a deadline.
  const deadline = new Date(ev.deadline_iso ?? '');
  const footer = ev.isFixed
    ? 'Giữ nguyên giờ đã đặt'
    : isNaN(deadline.getTime())
      ? 'Theo khung giờ rảnh'
      : `${ev.isPastDeadline ? 'Trễ hạn chót' : 'Hạn chót'}: ${DAY_SHORT[deadline.getDay()]} ${pad(deadline.getDate())}/${pad(deadline.getMonth() + 1)} · ${formatTimeHM(deadline)}`;
  return (
    <View style={[styles.card, urgent && { borderLeftColor: colors.red }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardMain}>
          <Text style={type.cardTitle}>{ev.originalTitle || ev.title}</Text>
          <View style={styles.timeRow}>
            <Icon name="clock" size={13} color={colors.textMuted} />
            <Text style={styles.timeText}>
              {formatTimeHM(ev.start)} – {formatTimeHM(ev.end)} · {ev.durationMinutes} phút
            </Text>
          </View>
        </View>
        {urgent ? <TagPill tone="red" label="Ưu tiên gấp" /> : ev.isFixed ? <TagPill label="Giờ cố định" /> : null}
      </View>
      {(ev.totalSessions > 1 || safe) && (
        <View style={styles.tags}>
          {ev.totalSessions > 1 && <TagPill tone="blue" label={`Phiên ${ev.sessionIndex}/${ev.totalSessions}`} />}
          {safe && <TagPill tone="green" label="Xong trước hạn ≥ 3 giờ" />}
        </View>
      )}
      <View style={styles.cardFooter}>
        <Text style={[styles.footText, ev.isPastDeadline && styles.footLate]}>{footer}</Text>
        <Pressable
          role="link"
          accessibilityLabel="Thêm vào Google Calendar"
          hitSlop={6}
          onPress={() => Linking.openURL(getGoogleCalendarLink(ev))}
          style={({ pressed }) => [styles.gcal, pressed && styles.pressed]}>
          <Text style={styles.gcalText}>Google Calendar</Text>
          <Icon name="arrow-up-right" size={12} color={colors.blue} strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

function AddOption({
  icon,
  title,
  desc,
  onPress,
}: {
  icon: 'camera' | 'edit';
  title: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={`${title}. ${desc}`}
      onPress={onPress}
      style={({ pressed }) => [styles.optBtn, pressed && styles.optBtnPressed]}>
      <View style={styles.optIcon}>
        <Icon name={icon} size={20} color={colors.blue} />
      </View>
      <View style={styles.optText}>
        <Text style={type.cardTitle}>{title}</Text>
        <Text style={styles.optDesc}>{desc}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Bleeds to the screen edges; the bottom padding keeps the active chip's glow from being clipped
  // by the horizontal ScrollView, and the negative margin gives that space back to the layout.
  strip: { flexGrow: 0, marginHorizontal: -layout.gutter, marginBottom: -10 },
  stripContent: { gap: 8, paddingHorizontal: layout.gutter, paddingTop: 2, paddingBottom: 14 },
  dayPill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 50,
    alignItems: 'center',
    gap: 2,
  },
  dayPillActive: { backgroundColor: colors.blue, borderColor: colors.blue, ...brandShadow('soft') },
  pressed: { opacity: 0.6 },
  onBrand: { color: colors.surface },
  wdName: { fontSize: 10, fontFamily: fonts.bold, color: colors.textMuted, textTransform: 'uppercase' },
  wdNum: { fontSize: 14, fontFamily: fonts.extrabold, color: colors.text, ...tabular },
  wdDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brand500, marginTop: 2 },

  dayGroup: { gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    ...shadow(1),
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  cardMain: { flex: 1, gap: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { flex: 1, fontSize: 12, fontFamily: fonts.regular, color: colors.textMuted, ...tabular },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.subtle,
    paddingTop: 8,
    marginTop: 2,
  },
  footText: { flex: 1, fontSize: 11.5, fontFamily: fonts.regular, color: colors.textMuted, ...tabular },
  footLate: { color: colors.red, fontFamily: fonts.semibold },
  // Padding (not just hitSlop, which web ignores) makes the real target ~36pt; the negative margin keeps the footer compact.
  gcal: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, marginVertical: -6 },
  gcalText: { fontSize: 11.5, fontFamily: fonts.bold, color: colors.blue },

  sheetOpts: { gap: 10 },
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: 14,
  },
  optBtnPressed: { borderColor: colors.brand400, backgroundColor: colors.blueSoft },
  optIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optText: { flex: 1, gap: 2 },
  optDesc: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary, lineHeight: 17 },
});
