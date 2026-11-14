// Tab 3 — Lịch tuần (EDF-scheduled sessions, 7-day strip, .ics export)
import * as Linking from 'expo-linking';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { useToast } from '@/components/Toast';
import { EmptyState, PillButton, ScreenHeading } from '@/components/ui';
import { exportIcs } from '@/lib/export-ics';
import { DAY_FULL, DAY_SHORT, formatDayKey, formatTimeHM } from '@/lib/format';
import { getGoogleCalendarLink } from '@/lib/ical';
import type { ScheduledEvent } from '@/lib/types';
import { useApp } from '@/state/AppStore';
import { colors, fonts, shadow, tabular } from '@/theme';

const pad = (n: number) => String(n).padStart(2, '0');

export default function ScheduleScreen() {
  const { schedule } = useApp();
  const toast = useToast();
  const [selectedDayKey, setSelectedDayKey] = useState<string>('all');
  const [exporting, setExporting] = useState(false);

  const totalMins = schedule.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const hrs = (totalMins / 60).toFixed(1).replace(/\.0$/, '');

  const days = useMemo(() => {
    const eventDayKeys = new Set(schedule.map((ev) => formatDayKey(ev.start)));
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const key = formatDayKey(d);
      return { key, label: i === 0 ? 'Nay' : DAY_SHORT[d.getDay()], num: d.getDate(), hasEvents: eventDayKeys.has(key) };
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

  const todayKey = formatDayKey(new Date());

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeading
        title="Lịch làm việc"
        subtitle={schedule.length ? `${schedule.length} phiên · Tổng ${hrs} giờ làm việc` : 'Chưa có phiên làm việc nào'}
        right={
          <PillButton
            tone="primary-soft"
            label={Platform.OS === 'web' ? 'Tải .ics' : 'Xuất .ics'}
            icon={<Icon name="download" size={14} color={colors.blue} strokeWidth={2.2} />}
            onPress={onExport}
            disabled={schedule.length === 0 || exporting}
          />
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekStrip}>
        <DayPill label="Lịch" num="Tất cả" active={selectedDayKey === 'all'} onPress={() => setSelectedDayKey('all')} />
        {days.map((d) => (
          <DayPill
            key={d.key}
            label={d.label}
            num={String(d.num)}
            dot={d.hasEvents}
            active={selectedDayKey === d.key}
            onPress={() => setSelectedDayKey(d.key)}
          />
        ))}
      </ScrollView>

      {groups.length === 0 ? (
        <EmptyState>
          {schedule.length === 0
            ? 'Chưa có phiên học nào được xếp. Hãy trích xuất việc từ ảnh hoặc thêm thủ công.'
            : 'Không có phiên làm việc nào trong ngày đã chọn.'}
        </EmptyState>
      ) : (
        groups.map(([key, group]) => {
          const d = group.date;
          return (
            <View key={key} style={styles.dayGroup}>
              <Text style={styles.dayHeader}>
                {`${key === todayKey ? 'Hôm nay · ' : ''}${DAY_FULL[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`.toUpperCase()}
              </Text>
              {group.items.map((ev) => (
                <AgendaRow key={ev.id} ev={ev} />
              ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

function DayPill({
  label,
  num,
  active,
  dot,
  onPress,
}: {
  label: string;
  num: string;
  active: boolean;
  dot?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.dayPill, active && styles.dayPillActive]}>
      <Text style={[styles.wdName, active && { color: '#fff' }]}>{label}</Text>
      <Text style={[styles.wdNum, active && { color: '#fff' }]}>{num}</Text>
      <View style={[styles.wdDot, { opacity: dot ? 1 : 0 }, active && { backgroundColor: '#fff' }]} />
    </Pressable>
  );
}

function AgendaRow({ ev }: { ev: ScheduledEvent }) {
  const urgent = ev.isUrgent || ev.isPastDeadline;
  return (
    <View style={styles.agendaRow}>
      <View style={styles.timeCol}>
        <Text style={[styles.start, tabular]}>{formatTimeHM(ev.start)}</Text>
        <Text style={[styles.end, tabular]}>{formatTimeHM(ev.end)}</Text>
      </View>
      <View style={[styles.card, urgent && { borderLeftColor: colors.red }]}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{ev.originalTitle || ev.title}</Text>
          {ev.totalSessions > 1 && (
            <Text style={styles.badge}>
              Phiên {ev.sessionIndex}/{ev.totalSessions}
            </Text>
          )}
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>{ev.durationMinutes} phút</Text>
          {ev.isUrgent && <Text style={styles.urgentTag}>Ưu tiên gấp</Text>}
          <Pressable
            role="link"
            accessibilityLabel="Thêm vào Google Calendar"
            hitSlop={6}
            onPress={() => Linking.openURL(getGoogleCalendarLink(ev))}
            style={({ pressed }) => [styles.gcal, pressed && { opacity: 0.6 }]}>
            <Text style={styles.gcalText}>Google Calendar</Text>
            <Icon name="external" size={11} color={colors.blue} strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  weekStrip: { gap: 6, paddingVertical: 2 },
  dayPill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 11,
    minWidth: 52,
    alignItems: 'center',
    gap: 3,
  },
  dayPillActive: { backgroundColor: colors.text, borderColor: colors.text },
  wdName: { fontSize: 10.5, fontFamily: fonts.semibold, color: colors.textSecondary },
  wdNum: { fontSize: 13.5, fontFamily: fonts.bold, color: colors.text, ...tabular },
  wdDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.blue },

  dayGroup: { gap: 10 },
  dayHeader: { fontSize: 12, fontFamily: fonts.bold, color: colors.textMuted, letterSpacing: 0.5, paddingTop: 4 },
  agendaRow: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  timeCol: { width: 54, alignItems: 'flex-end', paddingTop: 10 },
  start: { fontSize: 12, fontFamily: fonts.bold, color: colors.text },
  end: { fontSize: 11, fontFamily: fonts.regular, color: colors.textMuted },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.blue,
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 6,
    ...shadow(1),
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { flex: 1, fontSize: 13.5, fontFamily: fonts.semibold, color: colors.text, lineHeight: 18 },
  badge: {
    fontSize: 10.5,
    fontFamily: fonts.bold,
    color: colors.blue,
    backgroundColor: colors.blueSoft,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 11.5, color: colors.textMuted, fontFamily: fonts.regular },
  urgentTag: { fontSize: 11.5, color: colors.red, fontFamily: fonts.bold },
  gcal: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.blueSoft,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 7,
  },
  gcalText: { fontSize: 11.5, fontFamily: fonts.semibold, color: colors.blue },
});
