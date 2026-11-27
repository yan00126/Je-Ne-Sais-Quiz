// Word-order questions for long phrases: the phrase's words as tiles, shuffled, plus a couple of
// spare words from other entries of the same theme so the last tile isn't a free answer.
import type { VocabItem } from '../data/vocab.ts';
import { phraseWords } from './answer.ts';
import { seeded, type Pool } from './distractors.ts';

const ARTICLES = new Set(['une', 'les', 'des', 'aux', 'du']);

export type Tile = { id: string; text: string };

export function buildTiles(word: VocabItem, pool: Pool, seed: string, extra = 2): Tile[] {
  const rand = seeded(seed);
  const answer = phraseWords(word.fr);
  const topic = pool.topicOf.get(word.id);
  // Spare words: from other entries, the same theme first, never a word of the answer and never an
  // article (a wrong "une" next to "un" would make the question about gender instead of the phrase).
  const spares = (sameTopic: boolean) =>
    [...new Set(
      pool.items
        .filter((c) => c.id !== word.id && !c.fr.includes('/') && (pool.topicOf.get(c.id) === topic) === sameTopic)
        .flatMap((c) => phraseWords(c.fr))
        .filter((w) => w.length > 2 && !ARTICLES.has(w) && !answer.includes(w)),
    )];
  const extras: string[] = [];
  for (const list of [spares(true), spares(false)]) {
    while (extras.length < extra && list.length) extras.push(list.splice(Math.floor(rand() * list.length), 1)[0]);
  }
  const tiles: Tile[] = [...answer, ...extras].map((text, i) => ({ id: `${i}`, text }));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  // Never start already in order.
  if (tiles.slice(0, answer.length).every((t, i) => t.text === answer[i]) && tiles.length > 1) tiles.push(tiles.shift()!);
  return tiles;
}

// Right when the chosen tiles spell the phrase word for word. Repeated words ("part" … "part") are interchangeable.
export function checkOrder(picked: Tile[], fr: string) {
  const answer = phraseWords(fr);
  return picked.length === answer.length && picked.every((t, i) => t.text === answer[i]);
}
