import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useSQLiteContext } from 'expo-sqlite';
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { saveRecording, type RecordingMeta } from './recordings';

// Record yourself, then play it back. Used by shadowing and the guided dialogues.
// Each take is kept in « Mes enregistrements » so you can hear your progress later.
export function useRecording() {
  const db = useSQLiteContext();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 250);
  const player = useAudioPlayer(null);
  const [uri, setUri] = useState<string | null>(null);
  // Bumped on every new take or reset, so a late save doesn't bring back a cleared take.
  const take = useRef(0);

  async function start() {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      Alert.alert('Micro non autorisé', 'Autorisez le micro dans Réglages pour vous enregistrer.');
      return;
    }
    Speech.stop();
    player.pause();
    take.current++;
    setUri(null);
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  async function stop(meta: RecordingMeta) {
    const seconds = state.durationMillis / 1000;
    await recorder.stop();
    // Back to playback mode so recordings play through the loudspeaker, not the earpiece.
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    const temp = recorder.uri;
    if (!temp) return;
    setUri(temp);
    // Saving must never lose the take: if it fails, it still plays from the cache.
    const mine = take.current;
    saveRecording(db, temp, seconds, meta).then((saved) => take.current === mine && setUri(saved), () => {});
  }

  function playMine() {
    if (!uri) return;
    Speech.stop();
    player.replace({ uri });
    player.play();
  }

  function reset() {
    take.current++;
    setUri(null);
  }

  return { isRecording: state.isRecording, seconds: state.durationMillis / 1000, uri, start, stop, playMine, reset };
}

export function speakFr(text: string, slow = false, onDone?: () => void) {
  Speech.stop();
  Speech.speak(text, { language: 'fr-FR', rate: slow ? 0.75 : 1, onDone });
}
