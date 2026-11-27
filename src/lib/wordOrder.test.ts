import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STARTER_VOCAB, TOPICS } from '../data/vocab.ts';
import { phraseWords } from './answer.ts';
import { makePool } from './distractors.ts';
import { buildTiles, checkOrder } from './wordOrder.ts';

const pool = makePool(STARTER_VOCAB, TOPICS);
const card = STARTER_VOCAB.find((v) => v.id === 'v087')!;

test('tiles hold every word of the phrase plus two spare words, shuffled', () => {
  const tiles = buildTiles(card, pool, 'a');
  const words = tiles.map((t) => t.text);
  assert.equal(tiles.length, 6);
  for (const w of phraseWords(card.fr)) assert.ok(words.includes(w));
  assert.equal(words.filter((w) => w === 'part').length, 2);
  assert.notDeepEqual(words.slice(0, 4), phraseWords(card.fr));
  assert.deepEqual(buildTiles(card, pool, 'a'), tiles);
  assert.equal(new Set(tiles.map((t) => t.id)).size, tiles.length);
});

test('no phrase in the deck starts in order', () => {
  for (const v of STARTER_VOCAB.filter((x) => phraseWords(x.fr).length >= 2 && !x.fr.includes('/'))) {
    const tiles = buildTiles(v, pool, `${v.id}:1:0`);
    assert.ok(!checkOrder(tiles.slice(0, phraseWords(v.fr).length), v.fr), v.fr);
  }
});

test('the order is checked word for word, repeated words are interchangeable', () => {
  const tiles = buildTiles(card, pool, 'b');
  const pick = (...ws: string[]) => {
    const left = [...tiles];
    return ws.map((w) => left.splice(left.findIndex((t) => t.text === w), 1)[0]);
  };
  assert.ok(checkOrder(pick("d'une", 'part', "d'autre", 'part'), card.fr));
  assert.ok(!checkOrder(pick("d'autre", 'part', "d'une", 'part'), card.fr));
  assert.ok(!checkOrder(pick("d'une", 'part', "d'autre"), card.fr));
});
