import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { markActive } from '../lib/activity';
import { DB_NAME, migrate } from '../lib/db';
import { setupAudio } from '../lib/feedback';
import { pruneRecordings } from '../lib/recordings';
import { loadVoiceChoice } from '../lib/speech';
import { font, ThemeProvider, useTheme } from '../theme/ThemeProvider';

export default function RootLayout() {
  useEffect(setupAudio, []);
  return (
    <SQLiteProvider
      databaseName={DB_NAME}
      onInit={async (db) => {
        await migrate(db);
        await pruneRecordings(db).catch(() => {});
        await loadVoiceChoice(db).catch(() => {});
      }}
    >
      <ThemeProvider>
        <StatusBar style="dark" />
        {/* Any touch counts as activity for the study timer. Touches bubble up, so this sees them all. */}
        <View style={{ flex: 1 }} onTouchStart={markActive}>
          <Screens />
        </View>
      </ThemeProvider>
    </SQLiteProvider>
  );
}

function Screens() {
  const t = useTheme();
  return (
    <Stack
      screenOptions={{
        headerTintColor: t.id === 'cahier' ? t.colors.ink : t.colors.accentText,
        headerStyle: { backgroundColor: t.colors.bg },
        headerTitleStyle: { color: t.colors.ink, fontSize: 18, ...font(t, 'body', '700') },
        headerBackTitleStyle: font(t, 'body', '600'),
        headerShadowVisible: t.id !== 'bonbon',
        contentStyle: { backgroundColor: t.colors.bg },
        headerBackTitle: 'Retour',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="practice/listening" options={{ title: 'Compréhension orale' }} />
      <Stack.Screen name="practice/reading" options={{ title: 'Compréhension écrite' }} />
      <Stack.Screen name="practice/writing" options={{ title: 'Expression écrite' }} />
      <Stack.Screen name="practice/speaking" options={{ title: 'Expression orale' }} />
      <Stack.Screen name="practice/shadowing" options={{ title: 'Répéter après le modèle' }} />
      <Stack.Screen name="practice/dialogue" options={{ title: 'Dialogue guidé' }} />
      <Stack.Screen name="mistakes" options={{ title: 'Mes erreurs' }} />
      <Stack.Screen name="recordings" options={{ title: 'Mes enregistrements' }} />
      <Stack.Screen name="voice" options={{ title: 'Voix française' }} />
      <Stack.Screen name="style" options={{ title: 'Style' }} />
    </Stack>
  );
}
