import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { Icon, type IconName } from '@/components/Icon';
import { useApp } from '@/state/AppStore';
import { colors, fonts } from '@/theme';

function TabIcon({ name, color }: { name: IconName; color: ColorValue }) {
  return <Icon name={name} size={20} color={color} strokeWidth={1.9} />;
}

export default function TabsLayout() {
  const { pendingCount } = useApp();

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
