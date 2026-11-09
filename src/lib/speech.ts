import type { SQLiteDatabase } from 'expo-sqlite';
import * as Speech from 'expo-speech';
import { speakers, splitTurns } from './script';
import { pickVoice, rankFrenchVoices, voiceTier } from './voices';

// Every French text-to-speech in the app goes through here, so it uses the best installed voice
// (e.g. Amélie Premium) instead of the system default compact voice.

let chosen: string | null = null; // the voice picked in settings; null = automatic
let current: Speech.Voice | undefined;
let second: Speech.Voice | undefined; // a different voice for the other person in a dialogue
let resolved = false;

async function resolve() {
  const voices = await Speech.getAvailableVoicesAsync().catch(() => []);
  current = pickVoice(voices, chosen);
  // The best other French voice, preferring one with a different name (Thomas vs Amélie) to another
  // quality of the same voice. Novelty voices sound robotic, so a pitch change is used instead.
  const others = rankFrenchVoices(voices).filter((v) => v.identifier !== current?.identifier && voiceTier(v) !== 'novelty');
  second = others.find((v) => v.name !== current?.name) ?? others[0];
  // iOS can return an empty list right after launch: try again on the next sentence.
  resolved = voices.length > 0;
}

export async function loadVoiceChoice(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ value: string }>("SELECT value FROM settings WHERE key = 'voice'").catch(() => null);
  chosen = row?.value ?? null;
  await resolve();
}

export async function setVoiceChoice(db: SQLiteDatabase, identifier: string | null) {
  chosen = identifier;
  if (identifier) await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('voice', ?)", identifier);
  else await db.runAsync("DELETE FROM settings WHERE key = 'voice'");
  await resolve();
}

export const getVoiceChoice = () => chosen;

export async function getFrenchVoices() {
  return rankFrenchVoices(await Speech.getAvailableVoicesAsync());
}

export function speak(text: string, options: Speech.SpeechOptions = {}) {
  if (!resolved) resolve();
  Speech.speak(text, {
    language: current?.language ?? 'fr-FR',
    voice: current?.identifier,
    ...options,
  });
}

// Reads a listening script. In a dialogue the speaker labels ("Client : …") are not read aloud,
// and the second speaker gets another voice (or, with only one voice installed, a lower pitch).
export function speakScript(text: string, options: Speech.SpeechOptions = {}) {
  if (!resolved) resolve();
  const turns = splitTurns(text);
  const cast = speakers(turns);
  const { onDone, ...rest } = options;
  turns.forEach((turn, i) => {
    const other = turn.speaker !== null && cast.indexOf(turn.speaker) % 2 === 1;
    const voice = other && second ? second : current;
    Speech.speak(turn.line, {
      language: voice?.language ?? 'fr-FR',
      voice: voice?.identifier,
      ...(other && !second ? { pitch: 0.8 } : {}),
      ...rest,
      // iOS queues the lines and reads them one after another; only the last one ends the playback.
      onDone: i === turns.length - 1 ? onDone : undefined,
    });
  });
}

export function speakFr(text: string, slow = false, onDone?: () => void) {
  Speech.stop();
  speak(text, { rate: slow ? 0.75 : 1, onDone });
}

// Says a sample sentence with one voice, without changing the choice.
export function previewVoice(identifier: string, language: string) {
  Speech.stop();
  Speech.speak('Bonjour ! Je vais vous aider à préparer le TCF Canada.', { voice: identifier, language });
}
