import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentLevel, playbackFor, WINDOW, type Attempt, type Level } from './level.ts';

const docs = (level: Level, n: number, score: number, total = 2): Attempt[] => Array.from({ length: n }, () => ({ level, score, total }));

test('a new learner starts at A2', () => {
  assert.equal(currentLevel([]).level, 'A2');
});

test('80 % over the last five documents moves up one level', () => {
  assert.equal(currentLevel(docs('A2', WINDOW - 1, 2)).level, 'A2'); // not enough documents yet
  const up = currentLevel(docs('A2', WINDOW, 2));
  assert.equal(up.level, 'B1');
  assert.deepEqual(up.recent, []); // B1 starts with a fresh count
  // 8 of 10 is exactly 80 %
  assert.equal(currentLevel([...docs('A2', 3, 2), ...docs('A2', 2, 1)]).level, 'B1');
  assert.equal(currentLevel([...docs('A2', 2, 2), ...docs('A2', 3, 1)]).level, 'A2');
});

test('only the five most recent documents count', () => {
  const state = currentLevel([...docs('A2', 4, 0), ...docs('A2', 5, 2)]);
  assert.equal(state.level, 'B1');
});

test('below 50 % moves down, but never below A2', () => {
  assert.equal(currentLevel(docs('A2', 20, 0)).level, 'A2');
  assert.equal(currentLevel([...docs('A2', 5, 2), ...docs('B1', 5, 0)]).level, 'A2');
  assert.equal(currentLevel([...docs('A2', 5, 2), ...docs('B1', 5, 2), ...docs('B2', 5, 2)]).level, 'B2');
});

test('documents of another level are ignored', () => {
  // Old history from when levels were mixed: the B2 failures don't hold back A2.
  const state = currentLevel([...docs('B2', 3, 0), ...docs('A2', 2, 2)]);
  assert.equal(state.level, 'A2');
  assert.equal(state.recent.length, 2);
  assert.equal(state.accuracy, 1);
});

test('help fades as the level goes up', () => {
  assert.equal(playbackFor('A2').maxPlays, Infinity);
  assert.equal(playbackFor('A2').defaultRate, 0.75);
  assert.equal(playbackFor('B1').maxPlays, 2);
  assert.equal(playbackFor('B2').maxPlays, 1);
  assert.equal(playbackFor('B2').slowOption, false);
});
