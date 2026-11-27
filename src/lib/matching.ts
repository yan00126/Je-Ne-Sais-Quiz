// Matching questions: the word being studied and three other words, French on one side and their
// meanings on the other, each side in its own order. The other words are ones already met when there
// are enough of them, so the question reviews them too; otherwise any words from the deck.
// They are the same kind of word and easy to confuse with it (see pickDistractors), and never two
// with the same meaning, so each pair has only one right answer.
import type { VocabItem } from '../data/vocab.ts';
import { pickDistractors, seeded, tooClose, type Pool } from './distractors.ts';

export type MatchItem = { id: string; fr: string; en: string };

export function matchItems(word: VocabItem, pool: Pool, seed: string, seen: ReadonlySet<string> = new Set(), size = 4) {
  const met = { ...pool, items: pool.items.filter((v) => seen.has(v.id) && v.id !== word.id) };
  const others: VocabItem[] = pickDistractors(word, met, seed, size - 1);
  if (others.length < size - 1) {
    const more = pickDistractors(word, { ...pool, items: pool.items.filter((v) => !others.some((o) => o.id === v.id || tooClose(o, v))) }, seed, size - 1);
    others.push(...more.slice(0, size - 1 - others.length));
  }
  const items: MatchItem[] = [word, ...others].map(({ id, fr, en }) => ({ id, fr, en }));
  const shuffle = (list: MatchItem[], salt: string) => {
    const rand = seeded(`${seed}:${salt}`);
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const left = shuffle(items, 'fr');
  let right = shuffle(items, 'en');
  // Never every pair on the same row.
  if (right.every((r, i) => r.id === left[i].id)) right = [...right.slice(1), right[0]];
  return { left, right };
}
