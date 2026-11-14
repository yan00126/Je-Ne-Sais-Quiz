// Adaptive number dictation, all on the phone. Each category (60–79, prices, times…) keeps its own
// accuracy and tier, replayed from the saved answers, so nothing extra needs storing.
//
// - Score per answer: 1 right, 0.5 right but slow (or after a replay), 0 wrong.
// - Accuracy: the last WINDOW answers at the category's current tier, newer answers counting more.
// - How often a category comes up: weight = (1 − accuracy) + FLOOR, so weak ones come up most
//   and mastered ones still come back now and then.
// - Tier up: at least PROMOTE_MIN answers at the tier and accuracy ≥ PROMOTE_AT. Tier down: below
//   DEMOTE_BELOW over the last DEMOTE_MIN answers. Higher tiers read faster, use longer numbers and
//   then put the number in a sentence (see numbers.ts).
// - Phase 1 (the first week): pure numbers only, mostly 60–99, hundreds and thousands.
//   Phase 2: prices, times, dates and so on, with about PURE_SHARE pure numbers aimed at weak ranges.

import { CATEGORIES, MAX_TIER, type CategoryId, type NumberItem, type Rng } from './numbers.ts';

export const WINDOW = 20;
export const DECAY = 0.9; // each older answer counts 10 % less
export const FLOOR = 0.1;
export const PROMOTE_AT = 0.9;
export const PROMOTE_MIN = 12;
export const DEMOTE_BELOW = 0.5;
export const DEMOTE_MIN = 10;
export const PHASE1_DAYS = 7;
export const PURE_SHARE = 0.3;
export const SERIES = 10; // numbers per series
const DAY_MS = 86_400_000;

// In phase 1, 0–59 comes up less: it's the easy part.
const PHASE1_FACTOR: Partial<Record<CategoryId, number>> = { n0_59: 0.4 };
const CORE: CategoryId[] = ['n60_79', 'n80_99', 'hundreds', 'thousands'];

export type NumberAnswer = { category: CategoryId; score: number; at: number }; // oldest first

export type CategoryState = {
  tier: number;
  answers: number; // all answers ever in this category
  recent: number[]; // scores at the current tier, newest last, at most WINDOW
  accuracy: number | null; // recency-weighted, null when no answers at this tier yet
};

export function weightedAccuracy(scores: number[]): number | null {
  if (!scores.length) return null;
  let sum = 0;
  let weights = 0;
  scores.forEach((s, i) => {
    const w = DECAY ** (scores.length - 1 - i);
    sum += w * s;
    weights += w;
  });
  return sum / weights;
}

export function categoryState(scores: number[]): CategoryState {
  let tier = 0;
  let atTier: number[] = [];
  for (const s of scores) {
    atTier.push(s);
    const acc = weightedAccuracy(atTier.slice(-WINDOW))!;
    if (tier < MAX_TIER && atTier.length >= PROMOTE_MIN && acc >= PROMOTE_AT) {
      tier++;
      atTier = [];
    } else if (tier > 0 && atTier.length >= DEMOTE_MIN && weightedAccuracy(atTier.slice(-DEMOTE_MIN))! < DEMOTE_BELOW) {
      tier--;
      atTier = [];
    }
  }
  const recent = atTier.slice(-WINDOW);
  return { tier, answers: scores.length, recent, accuracy: weightedAccuracy(recent) };
}

export type DrillState = { phase: 1 | 2; day: number; categories: Record<CategoryId, CategoryState> };

export function drillState(history: NumberAnswer[], now = Date.now()): DrillState {
  const byCat = new Map<CategoryId, number[]>();
  for (const a of history) byCat.set(a.category, [...(byCat.get(a.category) ?? []), a.score]);
  const categories = Object.fromEntries(CATEGORIES.map((c) => [c.id, categoryState(byCat.get(c.id) ?? [])])) as Record<CategoryId, CategoryState>;
  const first = history[0]?.at;
  const day = first === undefined ? 1 : Math.floor((now - first) / DAY_MS) + 1;
  // Phase 2 after a week, or sooner once every core range has levelled up.
  const ready = day > PHASE1_DAYS || CORE.every((id) => categories[id].tier >= 1);
  return { phase: ready ? 2 : 1, day, categories };
}

// Never seen: weight 1.1. Just changed tier: treated as 50 %.
export function weightOf(state: CategoryState) {
  const acc = state.accuracy ?? (state.answers === 0 ? 0 : 0.5);
  return 1 - acc + FLOOR;
}

function weightedPick(rng: Rng, options: { id: CategoryId; w: number }[]): CategoryId {
  const total = options.reduce((n, o) => n + o.w, 0);
  let r = rng() * total;
  for (const o of options) {
    r -= o.w;
    if (r < 0) return o.id;
  }
  return options[options.length - 1].id;
}

// The next category. `last` = categories of the previous numbers, newest last: the same one never
// comes up more than three times in a row.
export function pickCategory(state: DrillState, rng: Rng = Math.random, last: CategoryId[] = []): CategoryId {
  const group = state.phase === 1 || rng() < PURE_SHARE ? 'pure' : 'context';
  let pool = CATEGORIES.filter((c) => c.group === group);
  const streak = last.length >= 3 && last.slice(-3).every((c) => c === last[last.length - 1]) ? last[last.length - 1] : null;
  if (streak) pool = pool.filter((c) => c.id !== streak);
  return weightedPick(
    rng,
    pool.map((c) => ({ id: c.id, w: weightOf(state.categories[c.id]) * (state.phase === 1 ? PHASE1_FACTOR[c.id] ?? 1 : 1) })),
  );
}

// How long typing may take, from the end of the audio, before a right answer counts as slow.
export function slowAfterMs(item: Pick<NumberItem, 'display'>) {
  return 4000 + 350 * item.display.split(' (')[0].replace(/\D/g, '').length;
}

export function scoreFor(correct: boolean, ms: number, replays: number, item: Pick<NumberItem, 'display'>) {
  if (!correct) return 0;
  return replays > 0 || ms > slowAfterMs(item) ? 0.5 : 1;
}
