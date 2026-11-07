import { Tabs } from 'expo-router/js-tabs';
import { ThemedTabBar } from '../../components/ThemedTabBar';
import { font, useTheme } from '../../theme/ThemeProvider';

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      tabBar={(props) => <ThemedTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: t.colors.bg },
        headerTitleStyle: { color: t.colors.ink, fontSize: 18, ...font(t, 'body', '700') },
        headerShadowVisible: t.id !== 'bonbon',
        sceneStyle: { backgroundColor: t.colors.bg },
      }}
    >
      {/* Today draws its own greeting, so it has no header bar. */}
      <Tabs.Screen name="index" options={{ title: "Aujourd'hui", headerShown: false }} />
      <Tabs.Screen name="cards" options={{ title: 'Vocabulaire' }} />
      <Tabs.Screen name="practice" options={{ title: 'Pratique' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progrès' }} />
    </Tabs>
  );
}
