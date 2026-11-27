import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STARTER_VOCAB, TOPICS } from '../data/vocab.ts';
import { makePool, tooClose } from './distractors.ts';
import { matchItems } from './matching.ts';

const pool = makePool(STARTER_VOCAB, TOPICS);

test('a matching question has the word and three others, never two with the same meaning', () => {
  for (const word of STARTER_VOCAB.filter((_, i) => i % 37 === 0)) {
    const { left, right } = matchItems(word, pool, `${word.id}:1:0`);
    assert.equal(left.length, 4, word.fr);
    assert.ok(left.some((i) => i.id === word.id));
    assert.deepEqual([...left].map((i) => i.id).sort(), [...right].map((i) => i.id).sort());
    assert.equal(new Set(left.map((i) => i.id)).size, 4);
    for (const a of left) for (const b of left) if (a !== b) assert.ok(!tooClose(a as never, b as never), `${a.fr} / ${b.fr}`);
    assert.ok(!right.every((r, i) => r.id === left[i].id));
  }
});

test('the other words are ones already met when there are enough', () => {
  const word = STARTER_VOCAB[0];
  const seen = new Set(STARTER_VOCAB.slice(1, 60).map((v) => v.id));
  const { left } = matchItems(word, pool, 'x', seen);
  for (const i of left) if (i.id !== word.id) assert.ok(seen.has(i.id), i.fr);
  // None met yet: still four words.
  assert.equal(matchItems(word, pool, 'x', new Set()).left.length, 4);
});

test('with only one word met, the other pairs come from the deck, still never two with the same meaning', () => {
  const word = STARTER_VOCAB[0];
  const seen = new Set([STARTER_VOCAB[1].id]);
  const { left } = matchItems(word, pool, 'y', seen);
  assert.equal(left.length, 4);
  assert.equal(new Set(left.map((i) => i.id)).size, 4);
  for (const a of left) for (const b of left) if (a !== b) assert.ok(!tooClose(a as never, b as never), `${a.fr} / ${b.fr}`);
});
