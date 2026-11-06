import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Storage } from 'expo-sqlite/kv-store';

export type Outcome = 'correct' | 'almost' | 'wrong';

const SOUNDS: Record<Outcome, number> = {
  correct: require('../../assets/sounds/correct.wav'),
  almost: require('../../assets/sounds/almost.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
};

const HAPTICS: Record<Outcome, Haptics.NotificationFeedbackType> = {
  correct: Haptics.NotificationFeedbackType.Success,
  almost: Haptics.NotificationFeedbackType.Warning,
  wrong: Haptics.NotificationFeedbackType.Error,
};

const SOUND_KEY = 'feedbackSound';

export function soundEnabled() {
  try {
    return Storage.getItemSync(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    Storage.setItemSync(SOUND_KEY, on ? 'on' : 'off');
  } catch {}
}

// Called once at app start. Word audio (text-to-speech) shares the app's audio session, and iOS's default
// session goes quiet when the ringer switch is on silent, so set a playback session that ignores the switch
// and mixes with music instead of stopping it.
export function setupAudio() {
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
}

// One player per sound, created on first use and reused afterwards.
// keepAudioSessionActive: otherwise expo-audio switches the session off when a sound ends, which can cut off
// a word being read out at the same moment.
const players: Partial<Record<Outcome, AudioPlayer>> = {};

function playSound(outcome: Outcome) {
  try {
    const player = (players[outcome] ??= createAudioPlayer(SOUNDS[outcome], { keepAudioSessionActive: true }));
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {}
}

// Haptic buzz plus (unless muted) a short sound for an answer's result.
export function answerFeedback(outcome: Outcome) {
  Haptics.notificationAsync(HAPTICS[outcome]).catch(() => {});
  if (soundEnabled()) playSound(outcome);
}
