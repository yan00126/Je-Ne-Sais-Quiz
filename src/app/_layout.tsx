import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { colors } from '../components/ui';
import { markActive } from '../lib/activity';
import { DB_NAME, migrate } from '../lib/db';
import { setupAudio } from '../lib/feedback';
import { pruneRecordings } from '../lib/recordings';
import { loadVoiceChoice } from '../lib/speech';

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
      <StatusBar style="dark" />
      {/* Any touch counts as activity for the study timer. Touches bubble up, so this sees them all. */}
      <View style={{ flex: 1 }} onTouchStart={markActive}>
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
          <Stack.Screen name="practice/shadowing" options={{ title: 'Répéter après le modèle' }} />
          <Stack.Screen name="practice/dialogue" options={{ title: 'Dialogue guidé' }} />
          <Stack.Screen name="mistakes" options={{ title: 'Mes erreurs' }} />
          <Stack.Screen name="recordings" options={{ title: 'Mes enregistrements' }} />
          <Stack.Screen name="voice" options={{ title: 'Voix française' }} />
        </Stack>
      </View>
    </SQLiteProvider>
  );
}
