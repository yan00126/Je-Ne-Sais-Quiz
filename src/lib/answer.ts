// Typed vocabulary exercises: which exercise to show for a card, and how to grade what was typed.

export type ExerciseKind = 'flashcard' | 'dictation' | 'meaning' | 'cloze';

// Harder exercises as a word gets better known. New words start as flashcards.
export function exerciseFor(reps: number, hasCloze: boolean): ExerciseKind {
  if (reps === 0) return 'flashcard';
  const cycle: ExerciseKind[] = hasCloze ? ['dictation', 'meaning', 'cloze'] : ['dictation', 'meaning'];
  return cycle[(reps - 1) % cycle.length];
}

const ARTICLE = /^(?:(?:une|un|les|le|la|des|se)\s+|[ls]'\s*)/;

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// The word without its article or grammar note, e.g. "un logement" → "logement", "bien que (+ subjonctif)" → "bien que".
export function headword(fr: string) {
  return normalize(fr.split('/')[0]).replace(ARTICLE, '');
}

// Accepted spellings: the full entry, each side of "un citoyen / une citoyenne", with or without the article.
function accepted(fr: string) {
  const whole = normalize(fr).replace(/\s*\/\s*/g, ' / ');
  return [whole, ...fr.split('/')].flatMap((part) => {
    const n = normalize(part);
    return [n, n.replace(ARTICLE, '')];
  });
}

export type Verdict = 'correct' | 'accents' | 'wrong';

export function gradeAnswer(typed: string, expected: string): Verdict {
  const t = normalize(typed).replace(/\s*\/\s*/g, ' / ');
  if (!t) return 'wrong';
  const options = accepted(expected);
  if (options.includes(t) || options.includes(t.replace(ARTICLE, ''))) return 'correct';
  const plain = options.map(stripAccents);
  if (plain.includes(stripAccents(t)) || plain.includes(stripAccents(t.replace(ARTICLE, '')))) return 'accents';
  return 'wrong';
}

// The example sentence with the word blanked out, or null when the word doesn't appear as written.
export function makeCloze(fr: string, example: string): { sentence: string; answer: string } | null {
  const word = headword(fr);
  if (word.length < 3) return null;
  // Only match at the start of a word, so "art" never blanks the middle of "partir".
  const lower = example.toLowerCase().replace(/[’]/g, "'");
  let i = lower.indexOf(word);
  while (i > 0 && /\p{L}/u.test(lower[i - 1])) i = lower.indexOf(word, i + 1);
  if (i < 0) return null;
  const answer = example.slice(i, i + word.length);
  return { sentence: example.slice(0, i) + '_'.repeat(Math.max(4, word.length)) + example.slice(i + word.length), answer };
}

// What to show as the answer once a cloze is checked. The blank only holds the word, because the
// sentence already shows its article ("Je prends les ___"), so revealing the dictionary form
// ("les transports en commun") would suggest the article belonged in the blank too. The dictionary
// form comes back separately when it differs, e.g. "loyer" in "Le ___ augmente" is listed as "un loyer".
export function clozeReveal(fr: string, cloze: { answer: string }): { word: string; entry: string | null } {
  const same = normalize(cloze.answer) === normalize(fr.split('/')[0]) && !fr.includes('/');
  return { word: cloze.answer, entry: same ? null : fr };
}

// A hint that reveals the first `letters` letters of each word, e.g. hint("un logement", 1) → "u_ l_______".
// Spaces, apostrophes and hyphens stay visible so the shape of the answer shows.
export function hint(answer: string, letters: number) {
  return answer
    .split(/([\s'’-]+)/)
    .map((part) => (/^[\s'’-]+$/.test(part) ? part : part.slice(0, letters) + '_'.repeat(Math.max(0, part.length - letters))))
    .join('');
}
