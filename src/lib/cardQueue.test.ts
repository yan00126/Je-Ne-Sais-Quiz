import { test } from 'node:test';
import assert from 'node:assert/strict';
import { afterReview, mergeStudyQueue, studyQueue } from './cardQueue.ts';
import { State } from 'ts-fsrs';

test('learning cards wait until their exact due time while ready cards stay available', () => {
  let now = 1_000;
  const learning = { id: 'learning', due: now + 600_000, state: State.Learning };
  const ready = { id: 'ready', due: now, state: State.New };
  let queue = [learning, ready];
  assert.equal(studyQueue(queue, now).card, ready);
  queue = afterReview(queue, { ...ready, state: State.Review });
  assert.equal(studyQueue(queue, now).card, undefined);
  assert.equal(studyQueue(queue, now).nextDue, learning.due);
  now = learning.due - 1;
  assert.equal(studyQueue(queue, now).card, undefined);
  now++;
  assert.equal(studyQueue(queue, now).card, learning);
});

test('relearning cards are retained, review cards leave, and the input is not mutated', () => {
  const old = { id: 'one', due: 0, state: State.Review };
  const next = { ...old, due: 60_000, state: State.Relearning };
  const queue = [old];
  const waiting = afterReview(queue, next);
  assert.deepEqual(queue, [old]);
  assert.deepEqual(waiting, [next]);
  assert.deepEqual(afterReview(waiting, { ...next, state: State.Review }), []);
});

test('empty queues are finished and waiting uses the earliest due time', () => {
  assert.deepEqual(studyQueue([], 0), { card: undefined, nextDue: null });
  assert.equal(studyQueue([
    { id: 'later', due: 90_000, state: State.Learning },
    { id: 'first', due: 60_000, state: State.Learning },
  ], 0).nextDue, 60_000);
});

test('refocusing preserves pending learning and relearning cards until due', () => {
  const now = 1_000;
  const learning = { id: 'learning', due: now + 60_000, state: State.Learning };
  const relearning = { id: 'relearning', due: now + 120_000, state: State.Relearning };
  const previous = [learning, relearning];
  const merged = mergeStudyQueue(previous, [], now);
  assert.deepEqual(merged, previous);
  assert.equal(studyQueue(merged, now).card, undefined);
  assert.equal(studyQueue(merged, now).nextDue, learning.due);
  assert.equal(studyQueue(merged, learning.due).card, learning);
  assert.deepEqual(previous, [learning, relearning]);
});

test('fresh rows win by id and stale due, review, and new cards are not retained', () => {
  const now = 1_000;
  const pending = { id: 'pending', due: now + 60_000, state: State.Learning };
  const fresh = { ...pending, due: now, state: State.Review };
  const previous = [
    pending,
    { id: 'due', due: now, state: State.Learning },
    { id: 'review', due: now + 60_000, state: State.Review },
    { id: 'new', due: now + 60_000, state: State.New },
  ];
  assert.deepEqual(mergeStudyQueue(previous, [fresh], now), [fresh]);
  assert.deepEqual(mergeStudyQueue([], [], now), []);
  assert.deepEqual(mergeStudyQueue([], [fresh], now), [fresh]);
});
