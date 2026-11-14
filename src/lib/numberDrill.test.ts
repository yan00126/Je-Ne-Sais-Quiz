import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  categoryState,
  drillState,
  FLOOR,
  pickCategory,
  PROMOTE_MIN,
  scoreFor,
  slowAfterMs,
  weightedAccuracy,
  weightOf,
  WINDOW,
  type NumberAnswer,
} from './numberDrill.ts';
import type { CategoryId } from './numbers.ts';

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 10, 14);
const answers = (category: CategoryId, scores: number[], at = T0): NumberAnswer[] => scores.map((score) => ({ category, score, at }));
const times = (n: number, score: number) => Array<number>(n).fill(score);

test('recent answers count more', () => {
  assert.equal(weightedAccuracy([]), null);
  assert.equal(weightedAccuracy([1, 1, 1]), 1);
  const lateRight = weightedAccuracy([0, 0, 1, 1])!;
  const earlyRight = weightedAccuracy([1, 1, 0, 0])!;
  assert.ok(lateRight > 0.5 && earlyRight < 0.5);
});

test('right but slow counts as half', () => {
  const item = { display: '97' };
  assert.equal(scoreFor(true, 1000, 0, item), 1);
  assert.equal(scoreFor(true, slowAfterMs(item) + 1, 0, item), 0.5);
  assert.equal(scoreFor(true, 1000, 1, item), 0.5); // replayed
  assert.equal(scoreFor(false, 1000, 0, item), 0);
  assert.ok(slowAfterMs({ display: '06 12 34 56 78' }) > slowAfterMs(item)); // longer answers get more time
});

test('weight is (1 − accuracy) + floor', () => {
  assert.equal(weightOf(categoryState([])), 1 + FLOOR); // never seen
  assert.ok(Math.abs(weightOf(categoryState(times(5, 1))) - FLOOR) < 1e-9);
  assert.ok(weightOf(categoryState([1, 0, 0, 0])) > 0.8); // one old right answer, three recent wrong
});

test('tier goes up after PROMOTE_MIN answers at 90 % or more, and the count restarts', () => {
  assert.equal(categoryState(times(PROMOTE_MIN - 1, 1)).tier, 0);
  const up = categoryState(times(PROMOTE_MIN, 1));
  assert.equal(up.tier, 1);
  assert.deepEqual(up.recent, []);
  assert.equal(weightOf(up), 0.5 + FLOOR); // new tier: middle weight
  assert.equal(categoryState(times(PROMOTE_MIN * 2, 1)).tier, 2);
  assert.equal(categoryState(times(PROMOTE_MIN * 5, 1)).tier, 2); // top tier
  // Slow answers hold you back: all right, but half of them slow, stays at tier 0.
  assert.equal(categoryState(Array.from({ length: 40 }, (_, i) => (i % 2 ? 1 : 0.5))).tier, 0);
});

test('tier goes down when the last ten are below 50 %', () => {
  const s = categoryState([...times(PROMOTE_MIN, 1), ...times(10, 0)]);
  assert.equal(s.tier, 0);
});

test('old mistakes stop counting', () => {
  // 30 wrong, then all right: once the window is mostly right answers, the tier goes up.
  const s = categoryState([...times(30, 0), ...times(WINDOW, 1)]);
  assert.equal(s.tier, 1);
  assert.ok(s.recent.length < WINDOW);
});

test('phase 1 for the first week, then phase 2', () => {
  assert.equal(drillState([], T0).phase, 1);
  const h = answers('n60_79', [1, 0], T0);
  assert.equal(drillState(h, T0 + 6 * DAY).phase, 1);
  assert.equal(drillState(h, T0 + 6 * DAY).day, 7);
  assert.equal(drillState(h, T0 + 7 * DAY).phase, 2);
});

test('phase 2 comes early once every core range levels up', () => {
  const h = (['n60_79', 'n80_99', 'hundreds', 'thousands'] as const).flatMap((c) => answers(c, times(PROMOTE_MIN, 1)));
  assert.equal(drillState(h, T0).phase, 2);
});

test('phase 1 picks only pure numbers, mostly the weak ones', () => {
  const state = drillState([...answers('n60_79', times(5, 0)), ...answers('n80_99', times(5, 1))], T0);
  let i = 0;
  const rng = () => ((i = (i * 7919 + 13) % 10007) / 10007);
  const counts: Record<string, number> = {};
  for (let n = 0; n < 5000; n++) {
    const c = pickCategory(state, rng);
    counts[c] = (counts[c] ?? 0) + 1;
  }
  assert.deepEqual(Object.keys(counts).sort(), ['hundreds', 'n0_59', 'n60_79', 'n80_99', 'thousands']);
  assert.ok(counts.n60_79 > counts.n80_99 * 5, JSON.stringify(counts));
  assert.ok(counts.n0_59 < counts.hundreds, JSON.stringify(counts)); // 0–59 comes up less in phase 1
});

test('phase 2 is about 30 % pure numbers', () => {
  const state = drillState(answers('n60_79', [1], T0 - 10 * DAY), T0);
  assert.equal(state.phase, 2);
  let pure = 0;
  for (let n = 0; n < 4000; n++) if (['n0_59', 'n60_79', 'n80_99', 'hundreds', 'thousands'].includes(pickCategory(state))) pure++;
  assert.ok(pure > 4000 * 0.25 && pure < 4000 * 0.35, String(pure));
});

test('the same category never comes four times in a row', () => {
  const state = drillState([], T0);
  for (let n = 0; n < 200; n++) assert.notEqual(pickCategory(state, Math.random, ['n80_99', 'n80_99', 'n80_99']), 'n80_99');
});
