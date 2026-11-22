import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { speak as speakFrench } from './speech';

// How long a recording may take to start before we give up and use the device voice.
const LOAD_TIMEOUT_MS = 4000;

let player: AudioPlayer | null = null;
let loadedUrl: string | null = null;
let attempt = 0;
let cancelPending: (() => void) | null = null;

const speak = (text: string) => speakFrench(text);

// Plays a human recording when there is one, and falls back to the device's French voice
// when there is none, or when it fails to load (offline, file gone).
export function play(text: string, url?: string) {
  const id = ++attempt;
  cancelPending?.();
  Speech.stop();
  player?.pause();
  if (!url) {
    speak(text);
    return;
  }

  let started = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let sub: { remove: () => void } | undefined;
  const cleanup = () => {
    if (timer !== undefined) clearTimeout(timer);
    sub?.remove();
    if (cancelPending === cleanup) cancelPending = null;
  };
  const fallback = () => {
    if (started || id !== attempt) return;
    started = true;
    cleanup();
    speak(text);
  };

  // Replaying the recording that is already loaded: no new load event will come.
  if (player && loadedUrl === url && player.isLoaded) {
    const p = player;
    p.seekTo(0).then(() => {
      if (id === attempt) p.play();
    }).catch(fallback);
    return;
  }
  loadedUrl = url;
  if (player) player.replace(url);
  else player = createAudioPlayer(url, { keepAudioSessionActive: true });

  const p = player;
  cancelPending = cleanup;
  sub = p.addListener('playbackStatusUpdate', (status) => {
    if (id !== attempt || started) return;
    if (status.error) {
      fallback();
    } else if (status.isLoaded && !started) {
      started = true;
      cleanup();
      p.play();
    }
  });
  if (started) cleanup();
  else timer = setTimeout(fallback, LOAD_TIMEOUT_MS);
}
