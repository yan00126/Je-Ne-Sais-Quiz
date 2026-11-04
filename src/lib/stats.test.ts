import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeMs, dayKey, formatMinutes, lastDays, minutesBySkill, streak, wordTiers, type Session } from './stats.ts';

const MIN = 60_000;
const at = (d: number, h = 10) => new Date(2026, 10, d, h).getTime();

test('time counts only until the learner has been idle for 3 minutes', () => {
  const t0 = at(4);
  assert.equal(activeMs(t0, t0 + 10_000, t0), 10_000);
  // Last touch 2.5 min before the tick: only the 30 s before the idle limit count.
  assert.equal(activeMs(t0, t0 + MIN, t0 - 2.5 * MIN), 30_000);
  // Idle for longer than the limit: nothing counts.
  assert.equal(activeMs(t0, t0 + MIN, t0 - 10 * MIN), 0);
});

test('the week chart has seven days ending today, with empty days at 0', () => {
  const sessions: Session[] = [
    { skill: 'vocab', started_at: at(4, 8), seconds: 600 },
    { skill: 'reading', started_at: at(4, 20), seconds: 1200 },
    { skill: 'writing', started_at: at(1), seconds: 1800 },
    { skill: 'writing', started_at: at(20, 1), seconds: 1800 }, // a later day is ignored
  ];
  const days = lastDays(sessions, at(4, 23));
  assert.equal(days.length, 7);
  assert.equal(days.at(-1)?.key, dayKey(at(4)));
  assert.equal(days.at(-1)?.minutes, 30);
  assert.equal(days.find((d) => d.key === dayKey(at(1)))?.minutes, 30);
  assert.equal(days.find((d) => d.key === dayKey(at(2)))?.minutes, 0);
});

test('the streak survives a morning with nothing done yet, and breaks on a missed day', () => {
  const days = new Set([at(1), at(2), at(3)].map(dayKey));
  assert.equal(streak(days, at(3)), 3);
  assert.equal(streak(days, at(4)), 3);
  assert.equal(streak(days, at(5)), 0);
  assert.equal(streak(new Set(), at(5)), 0);
});

test('words are sorted into new, learning, known and mastered', () => {
  const t = wordTiers([
    { reps: 0, state: 0, stability: 0 },
    { reps: 1, state: 1, stability: 0.5 },
    { reps: 4, state: 3, stability: 2 },
    { reps: 3, state: 2, stability: 8 },
    { reps: 6, state: 2, stability: 30 },
  ]);
  assert.deepEqual(t, { unseen: 1, learning: 2, known: 1, mastered: 1 });
});

test('minutes per skill always list every skill in the same order', () => {
  const rows = minutesBySkill([{ skill: 'speaking', started_at: at(4), seconds: 90 }]);
  assert.deepEqual(rows.map((r) => r.skill), ['listening', 'reading', 'writing', 'speaking', 'vocab']);
  assert.equal(rows[3].minutes, 2);
  assert.equal(rows[0].minutes, 0);
});

test('durations read as minutes, then hours', () => {
  assert.equal(formatMinutes(45), '45 min');
  assert.equal(formatMinutes(60), '1 h');
  assert.equal(formatMinutes(95), '1 h 35');
});
