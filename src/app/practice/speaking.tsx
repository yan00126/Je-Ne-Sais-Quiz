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
import { getItemsDoneToday, logAttempt, pickNextItem } from '../../lib/db';
import { SPEAKING_MIN_SHARE, speakingCounts } from '../../lib/plan';

function mmss(s: number) {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

export default function Speaking() {
  const db = useSQLiteContext();
  const [task, setTask] = useState<SpeakingTask>(SPEAKING_TASKS[0]);
  const [uri, setUri] = useState<string | null>(null);
  const [lastSeconds, setLastSeconds] = useState(0);
  const [doneToday, setDoneToday] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    getItemsDoneToday(db, 'speaking').then(setDoneToday);
    chooseNumber(1);
  }, [db]);

  // Each task number has several subjects; open the one practised least.
  async function chooseNumber(n: SpeakingTask['task']) {
    if (state.isRecording) return;
    setTask(await pickNextItem(db, 'speaking', SPEAKING_TASKS.filter((t) => t.task === n)));
    setUri(null);
  }

  async function stop() {
    const seconds = Math.round(elapsed);
    await recorder.stop();
    // Switch the audio session back to playback so the recording plays through the loudspeaker.
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setUri(recorder.uri);
    setLastSeconds(seconds);
    const counts = speakingCounts(seconds, task.seconds);
    await logAttempt(db, 'speaking', task.id, seconds, task.seconds, counts);
    if (counts) setDoneToday((prev) => new Set(prev).add(task.id));
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


  return (
    <Screen>
      <View style={styles.tabs}>
        {([1, 2, 3] as const).map((n) => {
          const done = SPEAKING_TASKS.some((t) => t.task === n && doneToday.has(t.id));
          return (
            <View key={n} style={{ flex: 1 }}>
              <Button title={`${done ? '✓ ' : ''}Tâche ${n}`} variant={n === task.task ? 'solid' : 'outline'} onPress={() => chooseNumber(n)} />
            </View>
          );
        })}
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
          {!speakingCounts(lastSeconds, task.seconds) && (
            <Body>
              Trop court pour compter dans le plan du jour : parlez au moins {mmss(task.seconds * SPEAKING_MIN_SHARE)} (vous avez parlé{' '}
              {mmss(lastSeconds)}).
            </Body>
          )}
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
