// What kind of mistake a wrong vocabulary answer is, and which mistakes come back most often.
// Runs on the phone with no AI: the patterns it finds are what the « Mes points faibles » card shows,
// and later what the tutor gets as the learner's history.
import { gradeAnswer, headword } from './answer.ts';

export type ErrorType =
  | 'unknown' // "Je ne sais pas", or nothing typed
  | 'accents' // right word, accents missing or wrong
  | 'gender' // un ↔ une, le ↔ la: the word is accepted, but with the wrong gender
  | 'agreement' // an ending added or missing (-e, -s, -es, -x)
  | 'preposition' // the verb's preposition missing or wrong (dépendre de)
  | 'confusion' // another word of the deck
  | 'spelling' // close to the word, a few letters off
  | 'other';

export type WordRef = { id: string; fr: string };

export type Classified = { type: ErrorType; confusedWith: string | null; ruleId: string | null };

// The grammar rule card each kind of mistake points to (see src/data/grammar).
export const RULE_FOR_ERROR: Partial<Record<ErrorType, string>> = {
  accents: 'G-ACCENT-01',
  gender: 'G-GENRE-01',
  agreement: 'G-ACCORD-01',
  preposition: 'G-PREP-01',
};

export const ERROR_LABEL: Record<ErrorType, string> = {
  unknown: 'Mots oubliés',
  accents: 'Accents',
  gender: 'Genre des noms (un / une)',
  agreement: 'Accords (-e, -s)',
  preposition: 'Prépositions après le verbe',
  confusion: 'Mots confondus',
  spelling: 'Orthographe',
  other: 'Autres erreurs',
};

const ARTICLE = /^(?:(une|un|les|le|la|des)\s+|(l'))/;
const PREPOSITIONS = new Set(['de', 'à', 'a', 'sur', 'en', 'pour', 'par', 'avec', 'dans', "d'", 'contre', 'chez']);
const GENDER: Record<string, 'm' | 'f'> = { un: 'm', le: 'm', une: 'f', la: 'f' };

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’`ʼ]/g, "'")
    .replace(/\(.*?\)/g, '')
    .replace(/[…,;:!?.«»"“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/'\s+/g, "'")
    .trim();
const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const article = (s: string) => {
  const m = ARTICLE.exec(s);
  return m ? (m[1] ?? m[2]) : null;
};

// The forms an entry can be written in: "un citoyen / une citoyenne" has two.
const forms = (fr: string) => fr.split('/').map(clean).filter(Boolean);

export function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return row[b.length];
}

// Only the end of the word differs by agreement letters: "empêché" → "empêchés", "élevées" → "élevé".
function agreementOnly(a: string, b: string) {
  if (a === b) return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return long.startsWith(short) && /^(e|s|es|x)$/.test(long.slice(short.length));
}

// Why `given` is wrong for the entry `expected`. `deck` is every word, to spot a word mixed up with another.
// Returns null when the answer is right. A right word with wrong accents still counts as a mistake, and so
// does the right word with an article of the other gender ("un augmentation"), which grading accepts
// because the article is optional.
export function classifyAnswer(expected: string, given: string, deck: readonly WordRef[], selfId?: string): Classified | null {
  const typed = clean(given);
  if (!typed) return result('unknown');
  const typedArticle = article(typed);
  const typedHead = typed.replace(ARTICLE, '');
  const otherGender = forms(expected).some((form) => {
    const art = article(form);
    return plain(typedHead) === plain(form.replace(ARTICLE, '')) && art && typedArticle && GENDER[art] && GENDER[typedArticle] && GENDER[art] !== GENDER[typedArticle];
  });
  // Checked form by form, so "un citoyenne" for "un citoyen / une citoyenne" is a gender mistake too.
  if (otherGender) return result('gender');
  const verdict = gradeAnswer(given, expected);
  if (verdict === 'correct') return null;
  if (verdict === 'accents') return result('accents');

  for (const form of forms(expected)) {
    const head = form.replace(ARTICLE, '');
    // Same verb, the preposition at the end left out or changed: "dépendre" or "dépendre à" for "dépendre de".
    const words = head.split(' ');
    const last = words.at(-1)!;
    if (words.length > 1 && PREPOSITIONS.has(last)) {
      const stem = words.slice(0, -1).join(' ');
      const typedWords = typedHead.split(' ');
      const typedStem = PREPOSITIONS.has(typedWords.at(-1)!) ? typedWords.slice(0, -1).join(' ') : typedHead;
      if (plain(typedStem) === plain(stem)) return result('preposition');
    }
    if (agreementOnly(plain(typedHead), plain(head))) return result('agreement');
  }

  // Another word of the deck, with or without its article and accents.
  const other = deck.find((w) => w.id !== selfId && w.fr !== expected && forms(w.fr).some((f) => plain(f.replace(ARTICLE, '')) === plain(typedHead)));
  if (other) return { type: 'confusion', confusedWith: other.id, ruleId: null };

  const target = plain(headword(expected));
  const distance = editDistance(plain(typedHead), target);
  if (distance <= Math.max(1, Math.round(target.length * 0.25))) return result('spelling');
  return result('other');

  function result(type: ErrorType): Classified {
    return { type, confusedWith: null, ruleId: RULE_FOR_ERROR[type] ?? null };
  }
}

// One saved wrong answer (see the word_mistakes table).
export type WordMistake = {
  card_id: string;
  error_type: ErrorType;
  confused_with: string | null;
  rule_id: string | null;
  created_at: number;
};

export type WeakPoint =
  | { kind: 'type'; type: ErrorType; ruleId: string | null; count: number; last: number }
  | { kind: 'pair'; ids: [string, string]; count: number; last: number }
  | { kind: 'word'; id: string; count: number; last: number };

// The patterns that came back at least `min` times, most frequent first (the most recent breaks a tie).
// Types say how the learner goes wrong; pairs, which words get mixed up; words, which ones keep slipping.
// "unknown" and "other" are left out of the types: they say nothing about why.
// `known`: words the screen can show (others, e.g. a deleted word, are left out before the limit).
export function weakPoints(mistakes: readonly WordMistake[], limit = 3, min = 2, known: (id: string) => boolean = () => true): WeakPoint[] {
  const points = new Map<string, WeakPoint>();
  // The words behind each point, to drop a point that says the same as one already shown.
  const words = new Map<WeakPoint, Set<string>>();
  const bump = (key: string, make: () => WeakPoint, at: number, id: string) => {
    const p = points.get(key) ?? make();
    p.count++;
    p.last = Math.max(p.last, at);
    points.set(key, p);
    words.set(p, (words.get(p) ?? new Set()).add(id));
  };
  for (const m of mistakes) {
    if (!known(m.card_id) || (m.confused_with && !known(m.confused_with))) continue;
    if (m.error_type !== 'unknown' && m.error_type !== 'other' && m.error_type !== 'confusion') {
      bump(`type:${m.error_type}`, () => ({ kind: 'type', type: m.error_type, ruleId: RULE_FOR_ERROR[m.error_type] ?? null, count: 0, last: 0 }), m.created_at, m.card_id);
    }
    if (m.confused_with) {
      const ids = [m.card_id, m.confused_with].sort() as [string, string];
      bump(`pair:${ids.join('|')}`, () => ({ kind: 'pair', ids, count: 0, last: 0 }), m.created_at, m.card_id);
    }
    bump(`word:${m.card_id}`, () => ({ kind: 'word', id: m.card_id, count: 0, last: 0 }), m.created_at, m.card_id);
  }
  const all = [...points.values()].filter((p) => p.count >= min).sort((a, b) => b.count - a.count || b.last - a.last);
  // One word misspelled three times would show as « Orthographe » and as the word: keep the first.
  // A word missed only through one confusion would show as the pair and as the word: keep the pair.
  const same = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));
  const picked: WeakPoint[] = [];
  for (const p of all) {
    if (picked.some((q) => same(words.get(q)!, words.get(p)!) && q.count >= p.count)) continue;
    if (p.kind === 'word' && picked.some((q) => q.kind === 'pair' && q.ids.includes(p.id) && q.count >= p.count)) continue;
    picked.push(p);
    if (picked.length === limit) break;
  }
  return picked;
}

// A wrong answer as the exercise saw it: the text typed or the option picked ('' for "Je ne sais pas"),
// the answer it was graded against when not the entry itself (a cloze blank), and the other word when a
// multiple-choice or matching question shows which one was taken for it.
export type Miss = { given: string; expected?: string; confusedWith?: string };

export function classifyMiss(entry: string, miss: Miss, exercise: string, deck: readonly WordRef[], selfId: string): Classified | null {
  if (!miss.given.trim()) return { type: 'unknown', confusedWith: null, ruleId: null };
  if (miss.confusedWith) return { type: 'confusion', confusedWith: miss.confusedWith, ruleId: null };
  // Words put back in the wrong order: no spelling to analyse.
  if (exercise === 'build') return { type: 'other', confusedWith: null, ruleId: null };
  return classifyAnswer(miss.expected ?? entry, miss.given, deck, selfId);
}
