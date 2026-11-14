import { router, usePathname } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useEffect, useRef } from 'react';

import { TabBar } from '@/components/TabBar';
import { saveLastTab, TAB_PATHS } from '@/lib/storage';
import { useApp } from '@/state/AppStore';
import { colors } from '@/theme';

// v2 layout: no navigator header (each screen renders its own large title via <Screen>/<ScreenHeader>),
// custom bar = Lịch · centre Snap button · Đầu việc. Declaration order = bar order.
export default function TabsLayout() {
  const { lastTab } = useApp();
  const pathname = usePathname();
  const restored = useRef(false);

  // Swipe-kill → reopen lands on the tab the user left (NFR-02); later tab changes are remembered.
  // Stack routes over the tabs (/settings, /review) are not tabs and are not remembered.
  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      if (lastTab !== '/') router.replace(lastTab);
      return;
    }
    if ((TAB_PATHS as readonly string[]).includes(pathname)) saveLastTab(pathname).catch(() => {});
  }, [pathname, lastTab]);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="schedule" options={{ title: 'Lịch' }} />
      <Tabs.Screen name="index" options={{ title: 'Quét ảnh' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Đầu việc' }} />
    </Tabs>
  );
}
