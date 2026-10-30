import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

// How long a recording may take to start before we give up and use the device voice.
const LOAD_TIMEOUT_MS = 4000;

let player: AudioPlayer | null = null;
let loadedUrl: string | null = null;
let attempt = 0;

const speak = (text: string) => Speech.speak(text, { language: 'fr-FR' });

// Plays a human recording when there is one, and falls back to the device's French voice
// when there is none, or when it fails to load (offline, file gone).
export function play(text: string, url?: string) {
  Speech.stop();
  player?.pause();
  if (!url) {
    speak(text);
    return;
  }

  const id = ++attempt;
  let started = false;
  const fallback = () => {
    if (started || id !== attempt) return;
    started = true;
    speak(text);
  };

  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  // Replaying the recording that is already loaded: no new load event will come.
  if (player && loadedUrl === url && player.isLoaded) {
    player.seekTo(0).then(() => player!.play());
    return;
  }
  loadedUrl = url;
  if (player) player.replace(url);
  else player = createAudioPlayer(url);

  const p = player;
  const sub = p.addListener('playbackStatusUpdate', (status) => {
    if (id !== attempt) return sub.remove();
    if (status.error) {
      sub.remove();
      fallback();
    } else if (status.isLoaded && !started) {
      started = true;
      p.play();
    }
    if (status.didJustFinish) sub.remove();
  });
  setTimeout(fallback, LOAD_TIMEOUT_MS);
}
