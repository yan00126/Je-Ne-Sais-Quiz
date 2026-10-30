import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Body, Button, Card, colors, H2, Screen } from '../../components/ui';
import { SPEAKING_TASKS, type SpeakingTask } from '../../data/prompts';
import { logAttempt } from '../../lib/db';

function mmss(s: number) {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

export default function Speaking() {
  const db = useSQLiteContext();
  const [task, setTask] = useState<SpeakingTask>(SPEAKING_TASKS[0]);
  const [uri, setUri] = useState<string | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 250);
  const player = useAudioPlayer(null);

  const elapsed = state.durationMillis / 1000;

  async function start() {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      Alert.alert('Micro non autorisé', "Autorisez le micro dans Réglages pour enregistrer vos réponses.");
      return;
    }
    setUri(null);
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  async function stop() {
    await recorder.stop();
    // Switch the audio session back to playback so the recording plays through the loudspeaker.
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setUri(recorder.uri);
    await logAttempt(db, 'speaking', task.id, 1, 1);
  }

  // The exam stops you at the time limit, so the recorder does too.
  useEffect(() => {
    if (state.isRecording && elapsed >= task.seconds) stop();
  }, [state.isRecording, elapsed]);

  function play() {
    if (!uri) return;
    player.replace({ uri });
    player.play();
  }

  function choose(t: SpeakingTask) {
    if (state.isRecording) return;
    setTask(t);
    setUri(null);
  }

  return (
    <Screen>
      <View style={styles.tabs}>
        {SPEAKING_TASKS.map((t) => (
          <View key={t.id} style={{ flex: 1 }}>
            <Button title={`Tâche ${t.task}`} variant={t.id === task.id ? 'solid' : 'outline'} onPress={() => choose(t)} />
          </View>
        ))}
      </View>
      <Card>
        <H2>
          {task.title} · {mmss(task.seconds)}
        </H2>
        <Body>{task.prompt}</Body>
      </Card>
      <Card style={{ alignItems: 'center' }}>
        <Body muted>{state.isRecording ? 'Enregistrement…' : uri ? 'Réponse enregistrée' : 'Prêt'}</Body>
        <H2>
          {mmss(elapsed)} / {mmss(task.seconds)}
        </H2>
      </Card>
      {state.isRecording ? (
        <Button title="■ Arrêter" color={colors.red} onPress={stop} />
      ) : (
        <Button title={uri ? '● Recommencer' : '● Enregistrer'} color={colors.red} onPress={start} />
      )}
      {uri && !state.isRecording && (
        <>
          <Button title="▶︎ Réécouter ma réponse" variant="outline" onPress={play} />
          <Body muted>
            Réécoutez-vous : avez-vous répondu à toutes les parties de la consigne ? Utilisé des connecteurs ? Parlé sans longues pauses ? La
            transcription et la correction automatique arrivent dans la prochaine version.
          </Body>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 8 },
});
