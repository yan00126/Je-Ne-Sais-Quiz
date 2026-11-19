// Wrong answers for multiple-choice vocab questions. A good wrong answer is one you could actually
// confuse with the right word: it looks or sounds alike ("un loyer" / "un loisir"), it belongs to the
// same theme ("un loyer" / "les charges"), or its meaning is close ("une hausse" / "une augmentation").
// Distractors are always the same kind of word (a noun for a noun, a verb for a verb), so the
// grammar of the sentence never gives the answer away.

import type { VocabItem } from '../data/vocab.ts';
import { headword } from './answer.ts';

type Kind = 'm' | 'f' | 'pl' | 'noun' | 'verb' | 'adj' | 'link';

// English glosses that start like this belong to linking words and set phrases ("however", "in order
// to", "it is likely that"), not adjectives.
const LINK = /^(on|however|although|though|because|since|so|thus|therefore|consequently|when|while|whereas|despite|in|thanks|moreover|furthermore|besides|first|firstly|secondly|finally|then|after|before|until|unless|as|even|provided|nevertheless|yet|otherwise|indeed|according|that|rather|instead|apart|except|for|given|due|following|with|not|but|also|more|from|notably|actually|admittedly|i|it|to|without|maybe|probably|currently|personally|daily|fluently|by|all|straight|at)\b/;

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// What kind of word an entry is, read from its article or ending. Masculine and feminine nouns are
// kept apart so "un ___" is never answered by a feminine word.
export function wordKind(fr: string, en = ''): Kind {
  const s = fr.toLowerCase().replace(/[’]/g, "'").trim();
  if (/^(un|le) /.test(s)) return 'm';
  if (/^(une|la) /.test(s)) return 'f';
  if (/^(les|des) /.test(s)) return 'pl';
  if (/^l'/.test(s)) return 'noun';
  if (/^(se |s')/.test(s)) return 'verb';
  if (/^\p{L}+(er|ir|re|oir)\b/u.test(s) && !s.includes(' que')) return 'verb';
  return LINK.test(en.toLowerCase()) ? 'link' : 'adj';
}

const NOUNS: Kind[] = ['m', 'f', 'pl', 'noun'];
// How well a candidate's kind fits: 2 = same, 1 = both nouns (gender differs), 0 = doesn't fit.
function kindFit(a: Kind, b: Kind) {
  if (a === b) return 2;
  if (NOUNS.includes(a) && NOUNS.includes(b)) return a === 'noun' || b === 'noun' ? 2 : 1;
  return 0;
}

function levenshtein(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

// 0 to 1: how alike two words look, with a bonus for the same start (learners mix up "dé-" words).
export function spellingSimilarity(a: string, b: string) {
  const x = stripAccents(headword(a));
  const y = stripAccents(headword(b));
  const lev = 1 - levenshtein(x, y) / Math.max(x.length, y.length);
  let prefix = 0;
  while (prefix < Math.min(x.length, y.length, 4) && x[prefix] === y[prefix]) prefix++;
  return Math.min(1, lev + prefix * 0.08);
}

const STOP = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'be', 'up', 'out', 'with', 'one', 'sth', 'someone', 'something']);
const glosses = (en: string) =>
  en
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .split(/[,;/]/)
    .map((g) => g.trim().replace(/^(a|an|the|to) /, ''))
    .filter(Boolean);
const contentWords = (en: string) => new Set(en.toLowerCase().replace(/\(.*?\)/g, '').split(/[^a-z]+/).filter((w) => w.length > 2 && !STOP.has(w)));

// True when two words could both be right: they share a whole meaning ("a job" / "a job, work"),
// or one is the other plus more words. Those are never offered as wrong answers.
export function tooClose(a: VocabItem, b: VocabItem) {
  const x = stripAccents(headword(a.fr));
  const y = stripAccents(headword(b.fr));
  // "une facture" / "une facture d'électricité", "logement" / "crise du logement": one is part of the other.
  const words = (w: string) => ` ${w.replace(/'/g, ' ')} `;
  const within = (short: string, long: string) => words(long).includes(words(short));
  if (x === y || within(x, y) || within(y, x)) return true;
  const ga = glosses(a.en);
  return glosses(b.en).some((g) => ga.includes(g));
}

// 0 to 1: how close the meanings are, from the English words the glosses share.
function meaningSimilarity(a: VocabItem, b: VocabItem) {
  const wa = contentWords(a.en);
  const wb = contentWords(b.en);
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  return shared === 0 ? 0 : shared / Math.min(wa.size, wb.size);
}

// A small seeded random generator, so a question keeps the same options while it is on screen
// and gets different ones the next time the word comes back.
export function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// The words wrong answers are drawn from, with each word's theme and kind worked out once.
export type Pool = { items: VocabItem[]; topicOf: Map<string, number>; kindOf: Map<string, Kind> };

export function makePool(items: VocabItem[], topics: VocabItem[][]): Pool {
  const topicOf = new Map<string, number>();
  topics.forEach((list, i) => list.forEach((v) => topicOf.set(v.id, i)));
  return { items, topicOf, kindOf: new Map(items.map((v) => [v.id, wordKind(v.fr, v.en)])) };
}

export type Distractor = VocabItem & { reason: 'spelling' | 'theme' | 'meaning' };

// Three wrong answers for `word`: the closest look-alike, the closest word in meaning or theme, and
// one more of either. `seed` picks among the top few of each so the same word doesn't always get
// the same three.
export function pickDistractors(word: VocabItem, pool: Pool, seed: string, count = 3): Distractor[] {
  const rand = seeded(seed);
  const kind = wordKind(word.fr, word.en);
  const topic = pool.topicOf.get(word.id);
  const scored = pool.items
    .map((c) => ({ c, fit: c.id === word.id ? 0 : kindFit(kind, pool.kindOf.get(c.id) ?? wordKind(c.fr, c.en)) }))
    .filter(({ c, fit }) => fit > 0 && !tooClose(word, c))
    .map(({ c, fit }) => {
      const spelling = spellingSimilarity(word.fr, c.fr);
      const meaning = meaningSimilarity(word, c);
      const theme = topic !== undefined && pool.topicOf.get(c.id) === topic ? 1 : 0;
      return { c, fit, spelling, sense: meaning * 0.7 + theme * 0.5 + spelling * 0.1, meaning, theme };
    })
    // A matching gender beats a near spelling: "une baisse" is a better trap for "une hausse" than "le hasard".
    .map((s) => ({ ...s, spelling: s.spelling + (s.fit === 2 ? 0.15 : 0), sense: s.sense + (s.fit === 2 ? 0.3 : 0) }));

  const chosen: Distractor[] = [];
  const taken = (c: VocabItem) => chosen.some((d) => d.id === c.id || tooClose(d, c));
  const pickFrom = (key: 'spelling' | 'sense', reason: (s: (typeof scored)[number]) => Distractor['reason']) => {
    const top = scored
      .filter((s) => !taken(s.c))
      .sort((a, b) => b[key] - a[key])
      .slice(0, 4);
    if (!top.length) return;
    const s = top[Math.floor(rand() * top.length)];
    chosen.push({ ...s.c, reason: reason(s) });
  };
  const senseReason = (s: (typeof scored)[number]): Distractor['reason'] => (s.meaning > 0 ? 'meaning' : s.theme ? 'theme' : 'spelling');
  pickFrom('spelling', () => 'spelling');
  pickFrom('sense', senseReason);
  while (chosen.length < count) {
    const before = chosen.length;
    if (rand() < 0.5) pickFrom('spelling', () => 'spelling');
    else pickFrom('sense', senseReason);
    if (chosen.length === before) break;
  }
  return chosen.slice(0, count);
}

export type ChoiceOption = { id: string; text: string; en: string; correct: boolean };

// The four options for a question, in a seeded random order. For a cloze, `answer` is the word as it
// sits in the blank and each wrong answer is shown the same way (no article, same capital letter).
export function choiceOptions(word: VocabItem, pool: Pool, seed: string, answer?: string): ChoiceOption[] {
  const fit = (fr: string) => {
    if (answer === undefined) return fr;
    const w = headword(fr);
    return /^\p{Lu}/u.test(answer) ? w[0].toUpperCase() + w.slice(1) : w;
  };
  const options: ChoiceOption[] = [
    { id: word.id, text: answer ?? word.fr, en: word.en, correct: true },
    ...pickDistractors(word, pool, seed).map((d) => ({ id: d.id, text: fit(d.fr), en: d.en, correct: false })),
  ];
  const rand = seeded(`${seed}:order`);
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}
