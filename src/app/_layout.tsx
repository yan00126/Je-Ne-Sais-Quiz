import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../components/ui';
import { DB_NAME, migrate } from '../lib/db';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DB_NAME} onInit={migrate}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.blue,
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.ink },
          contentStyle: { backgroundColor: colors.bg },
          headerBackTitle: 'Retour',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="practice/listening" options={{ title: 'Compréhension orale' }} />
        <Stack.Screen name="practice/reading" options={{ title: 'Compréhension écrite' }} />
        <Stack.Screen name="practice/writing" options={{ title: 'Expression écrite' }} />
        <Stack.Screen name="practice/speaking" options={{ title: 'Expression orale' }} />
      </Stack>
    </SQLiteProvider>
  );
}
