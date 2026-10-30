import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speakingCounts, stepProgress, todaysPlan, writingCounts } from './plan.ts';

test('the daily plan is about an hour and alternates writing and speaking', () => {
  const even = todaysPlan(new Date(2026, 9, 30));
  const odd = todaysPlan(new Date(2026, 9, 31));
  const minutes = (plan: ReturnType<typeof todaysPlan>) => plan.reduce((sum, s) => sum + s.minutes, 0);
  assert.ok(minutes(even) >= 55 && minutes(even) <= 70);
  assert.ok(minutes(odd) >= 55 && minutes(odd) <= 70);
  assert.equal(even.at(-1)?.skill, 'writing');
  assert.equal(odd.at(-1)?.skill, 'speaking');
});

test('a step is done only when its target is reached', () => {
  const listening = todaysPlan(new Date(2026, 9, 30))[1];
  assert.deepEqual(stepProgress(listening, { listening: 1 }, 0), { done: false, label: '1/3' });
  assert.deepEqual(stepProgress(listening, { listening: 3 }, 0), { done: true, label: '3/3' });
});

test('vocabulary is done only when the review queue is empty', () => {
  const vocab = todaysPlan(new Date(2026, 9, 30))[0];
  assert.equal(stepProgress(vocab, { vocab: 40 }, 2).done, false);
  assert.equal(stepProgress(vocab, {}, 0).done, true);
});

test('short writing and short recordings do not count', () => {
  assert.equal(writingCounts(12, 60), false);
  assert.equal(writingCounts(60, 60), true);
  assert.equal(speakingCounts(10, 120), false);
  assert.equal(speakingCounts(72, 120), true);
});
