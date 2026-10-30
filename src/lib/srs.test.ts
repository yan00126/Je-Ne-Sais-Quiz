import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newCardRow, review, Rating, State } from './srs.ts';

const now = new Date('2026-11-01T12:00:00Z');

test('a new card is due immediately', () => {
  const row = newCardRow('v001', now);
  assert.equal(row.state, State.New);
  assert.equal(row.due, now.getTime());
  assert.equal(row.reps, 0);
});

test('Easy schedules a card further out than Again', () => {
  const row = newCardRow('v001', now);
  const again = review(row, Rating.Again, now);
  const easy = review(row, Rating.Easy, now);
  assert.ok(easy.due > again.due);
  assert.equal(easy.reps, 1);
  assert.equal(easy.last_review, now.getTime());
});

test('forgetting a review card counts a lapse', () => {
  let row = review(newCardRow('v001', now), Rating.Easy, now);
  assert.equal(row.state, State.Review);
  row = review(row, Rating.Again, new Date(row.due));
  assert.equal(row.lapses, 1);
  assert.equal(row.state, State.Relearning);
});
