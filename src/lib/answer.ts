// Typed vocabulary exercises: which exercise to show for a card, and how to grade what was typed.

// choice: pick the French word for the English among look-alikes. clozeChoice: pick the word that fills
// the blank in a sentence. match: pair four French words with their meanings. All three are recognition
// (easier); dictation, meaning and cloze are typed recall.
// build: put a phrase's words back in order from tiles, used instead of `meaning` for long phrases.
export type ExerciseKind = 'choice' | 'clozeChoice' | 'match' | 'dictation' | 'meaning' | 'cloze' | 'build';

// What the learner has done with a word so far: how many answers in a row were right (0 for a new word
// or just after a wrong answer) and whether it was ever answered wrong. See answerHistory.
export type History = { streak: number; missed: boolean };

// From a word's answers in order. score 0 is wrong (or "Je ne sais pas") and starts the streak over;
// a full score adds one; a part score (right, but only by elimination in a matching question) leaves
// the streak where it was.
export type Answer = { score: number; total: number };
export function answerHistory(answers: readonly Answer[]): History {
  let streak = 0;
  for (const a of answers) {
    if (a.score <= 0) streak = 0;
    else if (a.score >= a.total) streak++;
  }
  return { streak, missed: answers.some((a) => a.score <= 0) };
}

// A word is recognised before it has to be typed. A new word starts with a multiple-choice question,
// then matching, then picking it in a sentence. A word answered wrong (also "Je ne sais pas") starts
// over and takes one more matching round: it needs four right recognition answers in a row before it
// is typed again. After that each round mixes typing it from sound, from meaning and in a sentence,
// with a matching round now and then.
// A long phrase (`phrase`, see phraseKind) is built from word tiles instead of typed from its meaning:
// typing "d'une part… d'autre part" from the English tests punctuation more than the phrase.
// A phrase in two parts ('split') is also built from tiles when it is heard, instead of typed.
export function recognitionSteps(hasCloze: boolean, missed: boolean): ExerciseKind[] {
  const third: ExerciseKind = hasCloze ? 'clozeChoice' : 'choice';
  return missed ? ['choice', 'match', third, 'match'] : ['choice', 'match', third];
}

export function exerciseFor({ streak, missed }: History, hasCloze: boolean, phrase: PhraseKind = false): ExerciseKind {
  const first = recognitionSteps(hasCloze, missed);
  if (streak < first.length) return first[streak];
  const cycle: ExerciseKind[] = hasCloze ? ['dictation', 'meaning', 'cloze', 'match'] : ['dictation', 'meaning', 'match'];
  const kind = cycle[(streak - first.length) % cycle.length];
  if (phrase === 'split' && (kind === 'meaning' || kind === 'dictation')) return 'build';
  return phrase && kind === 'meaning' ? 'build' : kind;
}

const ARTICLE = /^(?:(?:une|un|les|le|la|des)\s+|l'\s*)/;

// Punctuation that never changes the answer: the "…" in "d'une part… d'autre part" (typed or as three dots),
// dashes between the parts, commas, a final full stop, quotes. Apostrophes, hyphens inside a word
// ("rendez-vous") and "/" are kept because they do matter.
const PUNCTUATION = /\.{2,}|[…,;:!?.«»"“”–—]|\s-+\s/g;

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[’`ʼ]/g, "'")
    .replace(/\(.*?\)/g, '')
    .replace(PUNCTUATION, ' ')
    .replace(/\s+/g, ' ')
    .replace(/'\s+/g, "'")
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
  const lower = example.toLowerCase().replace(/[’]/g, "'");
  let i = lower.indexOf(word);
  while (i >= 0 && (/\p{L}$/u.test(lower.slice(0, i)) || /^\p{L}/u.test(lower.slice(i + word.length)))) {
    i = lower.indexOf(word, i + 1);
  }
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
// Spaces, apostrophes, hyphens and punctuation such as "…" stay visible so the shape of the answer shows.
const HINT_GAP = /([\s'’…,;.-]+)/;
export function hint(answer: string, letters: number) {
  return answer
    .split(HINT_GAP)
    .map((part) => (HINT_GAP.test(part) || !part ? part : part.slice(0, letters) + '_'.repeat(Math.max(0, part.length - letters))))
    .join('');
}

// How many hints a word can take: one fewer than the letters in its longest word.
export function maxHints(answer: string) {
  return Math.max(0, ...answer.split(HINT_GAP).map((w) => (HINT_GAP.test(w) ? 0 : w.length))) - 1;
}

// The words of a phrase as tiles to put in order, from the first form of the entry without grammar notes:
// "d’une part… d’autre part" → ["d'une", "part", "d'autre", "part"].
export function phraseWords(fr: string) {
  return normalize(fr.split('/')[0]).split(' ').filter(Boolean);
}

// Which phrases are built from tiles: 'split' for two parts split by "…", 'long' for four words or more
// not counting the article. Shorter ones ("remplir un formulaire") are still typed, and so are pairs
// like "un citoyen / une citoyenne".
export type PhraseKind = 'split' | 'long' | false;
export function phraseKind(fr: string): PhraseKind {
  if (fr.includes('/')) return false;
  if (/…|\.{2,}/.test(fr)) return 'split';
  return headword(fr).split(' ').filter(Boolean).length >= 4 ? 'long' : false;
}
