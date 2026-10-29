import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { colors } from '../../components/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

function icon(name: IconName) {
  return ({ color, size }: { color: unknown; size: number }) => <Ionicons name={name} color={color as string} size={size} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.ink },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Aujourd'hui", tabBarIcon: icon('sunny-outline') }} />
      <Tabs.Screen name="cards" options={{ title: 'Vocabulaire', tabBarIcon: icon('albums-outline') }} />
      <Tabs.Screen name="practice" options={{ title: 'Pratique', tabBarIcon: icon('school-outline') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progrès', tabBarIcon: icon('stats-chart-outline') }} />
    </Tabs>
  );
}
