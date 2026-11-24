// Shadowing by level: you pick a level, get a series of sentences written for it, and each
// sentence plays twice, slow then at the level's normal speed, with a pause after each play for you
// to repeat out loud. The higher the level, the longer the sentences and the faster both speeds.
//
// Everything here is plain logic with injected speech and timers, so it is tested without a phone.

export type ShadowLevel = 'A1' | 'A2' | 'B1' | 'B2';
export const SHADOW_LEVELS: ShadowLevel[] = ['A1', 'A2', 'B1', 'B2'];

export type LevelSpec = {
  level: ShadowLevel;
  name: string;
  detail: string; // what the sentences are like
  words: [number, number]; // sentence length range, in words
  slowRate: number; // expo-speech rate: 1 is the voice's normal speed
  normalRate: number;
};

export const LEVEL_SPECS: Record<ShadowLevel, LevelSpec> = {
  A1: { level: 'A1', name: 'Débutant', detail: 'Phrases courtes du quotidien, au présent', words: [3, 8], slowRate: 0.6, normalRate: 0.8 },
  A2: { level: 'A2', name: 'Élémentaire', detail: 'Passé composé, futur proche, comparaisons', words: [6, 12], slowRate: 0.65, normalRate: 0.9 },
  B1: { level: 'B1', name: 'Intermédiaire', detail: 'Connecteurs, hypothèses, subjonctif', words: [10, 18], slowRate: 0.75, normalRate: 1 },
  B2: { level: 'B2', name: 'Avancé', detail: 'Phrases longues et argumentées, comme au TCF', words: [16, 30], slowRate: 0.85, normalRate: 1.1 },
};

// How much time you get to repeat, as a multiple of how long the sentence just took to say.
export type PauseLength = 'short' | 'medium' | 'long';
export const PAUSES: Record<PauseLength, { label: string; factor: number }> = {
  short: { label: 'Courte', factor: 1 },
  medium: { label: 'Moyenne', factor: 1.4 },
  long: { label: 'Longue', factor: 1.9 },
};
export const PAUSE_ORDER: PauseLength[] = ['short', 'medium', 'long'];

// When the sentence text is on screen: always, only once you have heard it slowly, or never.
export type TextMode = 'always' | 'after' | 'hidden';
export const TEXT_MODES: Record<TextMode, string> = { always: 'Visible', after: 'Après', hidden: 'Masqué' };
// What each text setting does, shown under the choice.
export const TEXT_HINTS: Record<TextMode, string> = {
  always: 'Le texte reste affiché pendant toute la phrase.',
  after: 'Le texte s’affiche après la lecture lente : écoutez d’abord.',
  hidden: 'Sans texte, comme à l’examen : seulement à l’oreille.',
};
export const TEXT_ORDER: TextMode[] = ['always', 'after', 'hidden'];

export const SESSION_SIZE = 8;
// A session counts toward the daily plan once this share of its sentences has been played through.
export const COUNTS_AT = 0.75;

export const isLevel = (v: unknown): v is ShadowLevel => SHADOW_LEVELS.includes(v as ShadowLevel);
export const isPause = (v: unknown): v is PauseLength => PAUSE_ORDER.includes(v as PauseLength);
export const isTextMode = (v: unknown): v is TextMode => TEXT_ORDER.includes(v as TextMode);

export function countWords(text: string) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

// About how long the voice takes to say a text at a rate, used when the real time is unknown.
// Amélie at rate 1 says about 14 letters a second.
export function estimateSpeechMs(text: string, rate: number) {
  const letters = text.replace(/[^\p{L}\p{N}]/gu, '').length;
  return Math.round(400 + (letters / 14 / rate) * 1000);
}

export const MIN_GAP_MS = 2500;
export const MAX_GAP_MS = 20000;

// The pause after a play: long enough to say the sentence yourself, a bit slower than the voice.
export function gapMs(spokenMs: number, pause: PauseLength) {
  const ms = Math.round(spokenMs * PAUSES[pause].factor + 800);
  return Math.min(MAX_GAP_MS, Math.max(MIN_GAP_MS, ms));
}

// Speed shown to the learner, e.g. « ×0,75 ».
export const rateLabel = (rate: number) => `×${String(rate).replace('.', ',')}`;

// 1 to 4 bars for the speed meter on the level picker.
export const speedBars = (level: ShadowLevel) => SHADOW_LEVELS.indexOf(level) + 1;

export type Sentence = { id: string; level: ShadowLevel; fr: string; en: string };

// How often and when each sentence was last practised, by id.
export type SeenHistory = Record<string, { n: number; at: number }>;

// The sentences of a level practised least often first, then longest ago; ties are shuffled with
// `random` so two sessions don't start the same way.
export function pickSentences(bank: Sentence[], level: ShadowLevel, seen: SeenHistory, size = SESSION_SIZE, random = Math.random) {
  return bank
    .filter((s) => s.level === level)
    .map((s) => ({ s, n: seen[s.id]?.n ?? 0, at: seen[s.id]?.at ?? 0, r: random() }))
    .sort((a, b) => a.n - b.n || a.at - b.at || a.r - b.r)
    .slice(0, size)
    .map((x) => x.s);
}

export function markSeen(seen: SeenHistory, ids: string[], now: number): SeenHistory {
  const next = { ...seen };
  for (const id of ids) next[id] = { n: (next[id]?.n ?? 0) + 1, at: now };
  return next;
}

export const sessionCounts = (completed: number, total: number) => total > 0 && completed >= Math.ceil(total * COUNTS_AT);

// ——— The player ———
// Per sentence: slow → pause → normal → pause, then on to the next sentence by itself.

export type Phase = 'slow' | 'gapSlow' | 'normal' | 'gapNormal';
export const PHASES: Phase[] = ['slow', 'gapSlow', 'normal', 'gapNormal'];

export type PlayerState = {
  index: number; // current sentence
  phase: Phase;
  status: 'playing' | 'paused' | 'finished';
  gap: { ms: number; endsAt: number } | null; // while in a pause: its length and when it ends
  completed: number; // sentences played through to the end of their last pause
};

export type PlayerDeps = {
  // Says a text and calls onDone at the end. Must not call onDone after stop().
  speak: (text: string, rate: number, onDone: () => void) => void;
  stop: () => void;
  setTimer: (fn: () => void, ms: number) => unknown;
  clearTimer: (handle: unknown) => void;
  now: () => number;
  onChange: (state: PlayerState) => void;
  onGapStart?: (phase: Phase) => void; // e.g. a haptic tap: « your turn »
  onFinish?: (completed: number) => void;
};

export type PlayerOptions = { sentences: Sentence[]; level: ShadowLevel; pause: PauseLength };

// If the voice never reports the end (it happens on some web browsers), carry on after this long.
export const watchdogMs = (text: string, rate: number) => estimateSpeechMs(text, rate) * 2 + 4000;
// A play reported done faster than this was not really heard (no voice installed): use the estimate.
const MIN_HEARD_MS = 400;

export function createPlayer(options: PlayerOptions, deps: PlayerDeps) {
  const spec = LEVEL_SPECS[options.level];
  const { sentences } = options;
  let state: PlayerState = { index: 0, phase: 'slow', status: 'paused', gap: null, completed: 0 };
  let token = 0; // bumped on every phase change so late callbacks from an earlier phase are ignored
  let timer: unknown = null;
  let spokeAt = 0;
  let spoken: Partial<Record<'slow' | 'normal', number>> = {};
  let remainingGap: number | null = null; // a pause interrupted by « pause », resumed for what was left
  let doneCount = 0;
  const finished = new Set<number>();

  const emit = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch };
    deps.onChange(state);
  };

  function clear() {
    token++;
    if (timer !== null) deps.clearTimer(timer);
    timer = null;
    deps.stop();
  }

  function rateOf(phase: 'slow' | 'normal') {
    return phase === 'slow' ? spec.slowRate : spec.normalRate;
  }

  function enter(phase: Phase, gapLeft?: number) {
    clear();
    const my = token;
    const sentence = sentences[state.index];
    if (phase === 'slow' || phase === 'normal') {
      const rate = rateOf(phase);
      emit({ phase, status: 'playing', gap: null });
      spokeAt = deps.now();
      let ended = false;
      // timedOut: the voice never said it was done, so how long it took is unknown.
      const done = (timedOut = false) => {
        if (my !== token || ended) return;
        ended = true;
        const took = deps.now() - spokeAt;
        spoken[phase] = !timedOut && took >= MIN_HEARD_MS ? took : estimateSpeechMs(sentence.fr, rate);
        enter(phase === 'slow' ? 'gapSlow' : 'gapNormal');
      };
      timer = deps.setTimer(() => done(true), watchdogMs(sentence.fr, rate));
      deps.speak(sentence.fr, rate, () => done());
      return;
    }
    const from = phase === 'gapSlow' ? 'slow' : 'normal';
    const full = gapMs(spoken[from] ?? estimateSpeechMs(sentence.fr, rateOf(from)), options.pause);
    const ms = gapLeft ?? full;
    emit({ phase, status: 'playing', gap: { ms: full, endsAt: deps.now() + ms } });
    if (gapLeft === undefined) deps.onGapStart?.(phase);
    timer = deps.setTimer(() => {
      if (my !== token) return;
      timer = null;
      if (phase === 'gapSlow') enter('normal');
      else {
        if (!finished.has(state.index)) {
          finished.add(state.index);
          doneCount++;
        }
        emit({ completed: doneCount });
        advance();
      }
    }, ms);
  }

  function goTo(index: number) {
    spoken = {};
    remainingGap = null;
    emit({ index });
    enter('slow');
  }

  function advance() {
    if (state.index + 1 < sentences.length) goTo(state.index + 1);
    else {
      clear();
      emit({ status: 'finished', gap: null });
      deps.onFinish?.(doneCount);
    }
  }

  return {
    get state() {
      return state;
    },
    start() {
      if (sentences.length === 0) return;
      goTo(0);
    },
    pause() {
      if (state.status !== 'playing') return;
      remainingGap = state.gap ? Math.max(0, state.gap.endsAt - deps.now()) : null;
      clear();
      emit({ status: 'paused' });
    },
    // Picks up where it stopped: a pause goes on for the time it had left, a play starts over.
    resume() {
      if (state.status !== 'paused') return;
      const left = remainingGap;
      remainingGap = null;
      if ((state.phase === 'gapSlow' || state.phase === 'gapNormal') && left !== null) enter(state.phase, left);
      else enter(state.phase === 'gapSlow' ? 'slow' : state.phase === 'gapNormal' ? 'normal' : state.phase);
    },
    toggle() {
      if (state.status === 'playing') this.pause();
      else if (state.status === 'paused') this.resume();
    },
    // Hear the current sentence again from the slow play.
    replay() {
      if (state.status === 'finished') return;
      goTo(state.index);
    },
    next() {
      if (state.status === 'finished') return;
      advance();
    },
    previous() {
      if (state.status === 'finished' || state.index === 0) return;
      goTo(state.index - 1);
    },
    dispose() {
      clear();
    },
  };
}

export type Player = ReturnType<typeof createPlayer>;

// Whether the sentence text is on screen, given the setting and how far the sentence has got.
export function textVisible(mode: TextMode, phase: Phase, heardSlow: boolean) {
  if (mode === 'always') return true;
  if (mode === 'hidden') return false;
  return heardSlow || phase !== 'slow';
}
