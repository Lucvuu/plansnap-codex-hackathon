import { router, usePathname } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useEffect, useRef } from 'react';
import type { ColorValue } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { Icon, type IconName } from '@/components/Icon';
import { saveLastTab } from '@/lib/storage';
import { useApp } from '@/state/AppStore';
import { colors, fonts } from '@/theme';

function TabIcon({ name, color }: { name: IconName; color: ColorValue }) {
  return <Icon name={name} size={20} color={color} strokeWidth={1.9} />;
}

export default function TabsLayout() {
  const { pendingCount, lastTab } = useApp();
  const pathname = usePathname();
  const restored = useRef(false);

  // Swipe-kill → reopen lands on the tab the user left (NFR-02); later tab changes are remembered.
  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      if (lastTab !== '/') router.replace(lastTab);
      return;
    }
    saveLastTab(pathname).catch(() => {});
  }, [pathname, lastTab]);

  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10.5, fontFamily: fonts.semibold },
        tabBarStyle: { backgroundColor: 'rgba(255,255,255,0.96)', borderTopColor: colors.border },
        tabBarBadgeStyle: {
          backgroundColor: colors.blue,
          color: '#fff',
          fontSize: 9.5,
          fontFamily: fonts.bold,
          minWidth: 16,
          height: 16,
          lineHeight: 16,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Quét ảnh', tabBarIcon: ({ color }) => <TabIcon name="camera" color={color} /> }} />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Đầu việc',
          tabBarIcon: ({ color }) => <TabIcon name="tasks" color={color} />,
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
        }}
      />
      <Tabs.Screen name="schedule" options={{ title: 'Lịch tuần', tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Cài đặt', tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} /> }} />
    </Tabs>
  );
}
