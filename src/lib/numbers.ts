// Number dictation: French number words, the items read out in each category, and grading of what was typed.
// The app writes the words itself and gives them to the voice, so every number is read the same,
// standard way (e.g. phone numbers in pairs), whatever the voice would do with digits.

export type Rng = () => number; // like Math.random: a number in [0, 1)

const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
];
const TENS: Record<number, string> = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };

function below100(n: number): string {
  if (n < 20) return UNITS[n];
  if (n < 70) {
    const t = TENS[Math.floor(n / 10)];
    const u = n % 10;
    return u === 0 ? t : u === 1 ? `${t} et un` : `${t}-${UNITS[u]}`;
  }
  if (n < 80) return n === 71 ? 'soixante et onze' : `soixante-${UNITS[n - 60]}`;
  return n === 80 ? 'quatre-vingts' : `quatre-vingt-${UNITS[n - 80]}`;
}

// `last`: whether nothing follows. "Quatre-vingts" and "deux cents" lose their s before "mille".
function below1000(n: number, last = true): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let words = r === 0 && h > 0 ? '' : below100(r);
  if (!last && words.endsWith('quatre-vingts')) words = words.slice(0, -1);
  if (h === 0) return words;
  const head = h === 1 ? 'cent' : `${UNITS[h]} cent${r === 0 && last ? 's' : ''}`;
  return words ? `${head} ${words}` : head;
}

// 0 to 999 999 999 in words, e.g. 1997 → "mille neuf cent quatre-vingt-dix-sept", 80 000 → "quatre-vingt mille".
export function frenchNumber(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n >= 1e9) throw new Error(`frenchNumber: ${n}`);
  if (n === 0) return 'zéro';
  const millions = Math.floor(n / 1e6);
  const thousands = Math.floor((n % 1e6) / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (millions) parts.push(millions === 1 ? 'un million' : `${below1000(millions)} millions`);
  if (thousands) parts.push(thousands === 1 ? 'mille' : `${below1000(thousands, false)} mille`);
  if (rest) parts.push(below1000(rest));
  return parts.join(' ');
}

// Before a feminine noun: "vingt et une heures", "une heure".
const feminine = (words: string) => words.replace(/\bun$/, 'une');

// "1 250 000": digits grouped by three with a space, as written in French.
export function groupDigits(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// ---------- Categories ----------

export type CategoryId =
  | 'n0_59' | 'n60_79' | 'n80_99' | 'hundreds' | 'thousands'
  | 'price' | 'time' | 'date' | 'year' | 'phone' | 'percent' | 'temperature';

export type Category = { id: CategoryId; label: string; group: 'pure' | 'context' };

export const CATEGORIES: Category[] = [
  { id: 'n0_59', label: '0 à 59', group: 'pure' },
  { id: 'n60_79', label: '60 à 79', group: 'pure' },
  { id: 'n80_99', label: '80 à 99', group: 'pure' },
  { id: 'hundreds', label: 'Centaines', group: 'pure' },
  { id: 'thousands', label: 'Milliers', group: 'pure' },
  { id: 'price', label: 'Prix', group: 'context' },
  { id: 'time', label: 'Heures', group: 'context' },
  { id: 'date', label: 'Dates', group: 'context' },
  { id: 'year', label: 'Années', group: 'context' },
  { id: 'phone', label: 'Téléphone', group: 'context' },
  { id: 'percent', label: 'Pourcentages', group: 'context' },
  { id: 'temperature', label: 'Températures', group: 'context' },
];
export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

// Tier 0, 1, 2: the level within a category. Higher tiers read faster, use longer numbers,
// and at tier 2 the number comes inside a sentence.
export const MAX_TIER = 2;
export const TIER_RATE = [0.85, 1, 1.1];

export type NumberItem = {
  category: CategoryId;
  tier: number;
  spoken: string; // what the voice reads
  display: string; // the written answer shown afterwards, e.g. "18 h 45"
  prompt: string; // what to type, e.g. "Tapez l'heure"
  keyboard: 'numbers-and-punctuation' | 'default';
  check: (typed: string) => boolean;
};

const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const pick = <T,>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- Normalising typed answers ----------

const SPACES = /[\s  ]+/g;
const plain = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[−–—]/g, '-');

// Digits only, ignoring spaces, dots and commas used as thousands separators: "1 250", "1.250" → "1250".
const digits = (s: string) => plain(s).replace(SPACES, '').replace(/[.,']/g, '');

// A decimal as typed, with a comma: "12.5", "12,5" → "12,5".
const decimal = (s: string) => plain(s).replace(SPACES, '').replace('.', ',');

// ---------- Item makers ----------

function sentence(rng: Rng, templates: string[], words: string) {
  return cap(pick(rng, templates).replace('{x}', words));
}

const COUNT_SENTENCES = [
  'Le village compte {x} habitants.',
  'Nous avons reçu {x} dossiers cette année.',
  'Il y a {x} étudiants inscrits au cours.',
  'La salle peut accueillir {x} spectateurs.',
  'Ce modèle coûte {x} dollars.',
];

// Pure numbers at tiers 0 and 1 are read on their own; tier 2 puts them in a sentence.
function pureItem(rng: Rng, category: CategoryId, tier: number, n: number): NumberItem {
  const words = frenchNumber(n);
  return {
    category,
    tier,
    spoken: tier >= 2 && n >= 2 ? sentence(rng, COUNT_SENTENCES, words) : words,
    display: groupDigits(n),
    prompt: tier >= 2 ? 'Tapez le nombre entendu dans la phrase' : 'Tapez le nombre entendu',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => digits(typed) === String(n),
  };
}

// 60–79 or 80–99, alone at first, then as the end of a longer number (371, 4 285).
function tensItem(rng: Rng, category: 'n60_79' | 'n80_99', tier: number): NumberItem {
  const end = category === 'n60_79' ? int(rng, 60, 79) : int(rng, 80, 99);
  const n = tier === 0 ? end : tier === 1 ? int(rng, 1, 9) * 100 + end : int(rng, 1, 9) * 1000 + int(rng, 0, 9) * 100 + end;
  return pureItem(rng, category, tier, n);
}

function hundredsItem(rng: Rng, tier: number): NumberItem {
  // Round hundreds ("trois cents") a quarter of the time, since their spelling and sound trip people up.
  const n = rng() < 0.25 ? int(rng, 1, 9) * 100 : int(rng, 100, 999);
  return pureItem(rng, 'hundreds', tier, n);
}

function thousandsItem(rng: Rng, tier: number): NumberItem {
  let n = tier === 0 ? int(rng, 1000, 9999) : tier === 1 ? int(rng, 10_000, 999_999) : int(rng, 1000, 2_500_000);
  if (n % 1e6 === 0) n += 1; // "deux millions habitants" would need "d'"
  return pureItem(rng, 'thousands', tier, n);
}

const PRICE_SENTENCES = [
  'Le billet coûte {x}.',
  'Ça vous fait {x}, s’il vous plaît.',
  'Le loyer est de {x} par mois.',
  'Au total, vous me devez {x}.',
];

function priceItem(rng: Rng, tier: number): NumberItem {
  const euros = tier === 0 ? int(rng, 2, 99) : int(rng, 2, 2500);
  const cents = rng() < 0.2 ? 0 : tier === 0 ? int(rng, 1, 19) * 5 : int(rng, 1, 99);
  const words = `${frenchNumber(euros)} euros${cents ? ` ${frenchNumber(cents)}` : ''}`;
  const display = `${groupDigits(euros)}${cents ? `,${String(cents).padStart(2, '0')}` : ''} €`;
  const want = cents ? `${euros},${String(cents).padStart(2, '0')}` : String(euros);
  return {
    category: 'price',
    tier,
    spoken: tier >= 2 ? sentence(rng, PRICE_SENTENCES, words) : words,
    display,
    prompt: 'Tapez le prix (ex. 12,50)',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => {
      // "12€50" → "12,50"; then drop the currency, spaces and thousands separators.
      let s = plain(typed).replace(/\s*(?:€|euros?)\s*(?=\d)/, ',').replace(/euros?|€/g, '').replace(SPACES, '').replace('.', ',');
      s = s.replace(/^(\d+),(\d{3})(?=,|$)/, '$1$2'); // "1.250,50" typed with a thousands dot
      if (s.endsWith(',00')) s = s.slice(0, -3);
      if (/^\d+,\d$/.test(s)) s += '0'; // "12,5" means 12,50
      return s === want;
    },
  };
}

const TIME_SENTENCES = ['Le train part à {x}.', 'Le magasin ouvre à {x}.', 'Votre rendez-vous est à {x}.', 'Le film commence à {x}.'];

const hoursWords = (h: number) => (h === 1 ? 'une heure' : `${feminine(frenchNumber(h))} heures`);

// 24-hour ("dix-huit heures quarante-cinq") or everyday ("sept heures moins le quart") time.
function timeItem(rng: Rng, tier: number): NumberItem {
  let words: string;
  let accepted: [number, number][];
  let display: string;
  const fmt = (h: number, m: number) => `${h} h ${String(m).padStart(2, '0')}`;
  if (rng() < 0.5) {
    const h = int(rng, 1, 23);
    const m = tier === 0 ? int(rng, 0, 11) * 5 : int(rng, 0, 59);
    words = `${hoursWords(h)}${m ? ` ${feminine(frenchNumber(m))}` : ''}`;
    accepted = [[h, m]];
    display = fmt(h, m);
  } else {
    // Everyday time: hours 1 to 12 (or midi / minuit), with et quart, et demie, moins le quart, moins dix…
    const offsets = tier === 0 ? [0, 15, 30, -15] : [0, 5, 10, 15, 20, 25, 30, -25, -20, -15, -10, -5];
    const off = pick(rng, offsets);
    const special = rng() < 0.15 ? pick(rng, ['midi', 'minuit'] as const) : null;
    const h = special ? 12 : int(rng, 1, 11);
    const base = special ?? hoursWords(h);
    const demi = special ? 'demi' : 'demie';
    const tail =
      off === 0 ? '' : off === 15 ? ' et quart' : off === 30 ? ` et ${demi}` : off === -15 ? ' moins le quart' : off > 0 ? ` ${frenchNumber(off)}` : ` moins ${frenchNumber(-off)}`;
    words = base + tail;
    // "Sept heures moins le quart" is 6 h 45; morning or evening are both accepted.
    let hh = off < 0 ? h - 1 : h;
    const mm = off < 0 ? 60 + off : off;
    if (special === 'minuit') {
      accepted = off < 0 ? [[23, mm]] : [[0, mm], [24, mm]];
      display = fmt(off < 0 ? 23 : 0, mm);
    } else if (special === 'midi') {
      accepted = [[hh, mm]];
      display = fmt(hh, mm);
    } else {
      if (hh === 0) hh = 12; // "une heure moins le quart": 12 h 45 or 0 h 45
      const other = hh === 12 ? 0 : hh + 12;
      accepted = [[hh, mm], [other, mm]];
      display = `${fmt(hh, mm)} (ou ${fmt(other, mm)})`;
    }
  }
  return {
    category: 'time',
    tier,
    spoken: tier >= 2 ? sentence(rng, TIME_SENTENCES, words) : words,
    display,
    prompt: 'Tapez l’heure (ex. 18 h 45 ou 18:45)',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => {
      const m = plain(typed).replace(SPACES, '').match(/^(\d{1,2})(?:[h:.](\d{0,2}))?$/);
      if (!m) return false;
      const h = Number(m[1]);
      const min = m[2] ? Number(m[2]) : 0;
      return accepted.some(([ah, am]) => ah === h && am === min);
    },
  };
}

export const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DATE_SENTENCES = ['Votre rendez-vous est {x}.', 'L’examen aura lieu {x}.', 'Les inscriptions ferment {x}.', 'Nous partons en vacances {x}.'];

// The year as said in France ("mille neuf cent quatre-vingt-dix-sept") or, from tier 1, sometimes
// as many Quebecers say it ("dix-neuf cent quatre-vingt-dix-sept").
function yearWords(rng: Rng, y: number, tier: number) {
  if (tier >= 1 && y >= 1100 && y < 2000 && rng() < 0.3) {
    const r = y % 100;
    return `${frenchNumber(Math.floor(y / 100))} cent${r ? ` ${frenchNumber(r)}` : ''}`;
  }
  return frenchNumber(y);
}

function dateItem(rng: Rng, tier: number): NumberItem {
  const month = int(rng, 0, 11);
  const day = int(rng, 1, DAYS_IN_MONTH[month]);
  const year = tier >= 1 ? int(rng, 1990, 2030) : null;
  const words = `le ${day === 1 ? 'premier' : frenchNumber(day)} ${MONTHS[month]}${year ? ` ${yearWords(rng, year, tier)}` : ''}`;
  return {
    category: 'date',
    tier,
    spoken: tier >= 2 ? sentence(rng, DATE_SENTENCES, words) : cap(words),
    display: `${day === 1 ? '1er' : day} ${MONTHS[month]}${year ? ` ${year}` : ''}`,
    prompt: year ? 'Tapez la date avec l’année (ex. 23 mars 2027 ou 23/03/2027)' : 'Tapez la date (ex. 23 mars ou 23/03)',
    keyboard: 'default',
    check: (typed) => {
      const s = plain(typed).replace(/^le\s+/, '').replace(/(\d)\s*er\b/, '$1').trim();
      const m = s.match(/^(\d{1,2})\s*(?:[/.-]\s*)?([a-z]+|\d{1,2})(?:\s*[/.\s-]\s*(\d{4}))?$/);
      if (!m) return false;
      const monthIdx = /^\d+$/.test(m[2]) ? Number(m[2]) - 1 : MONTHS.map(plain).indexOf(m[2]);
      if (Number(m[1]) !== day || monthIdx !== month) return false;
      return year === null || Number(m[3]) === year;
    },
  };
}

const YEAR_SENTENCES = ['Il est arrivé au Canada en {x}.', 'Cette maison a été construite en {x}.', 'L’entreprise a été fondée en {x}.', 'Elle a obtenu son diplôme en {x}.'];

function yearItem(rng: Rng, tier: number): NumberItem {
  const y = tier === 0 ? int(rng, 1950, 2030) : int(rng, 1500, 2099);
  const words = yearWords(rng, y, tier);
  return {
    category: 'year',
    tier,
    spoken: tier >= 2 ? sentence(rng, YEAR_SENTENCES, words) : words,
    display: String(y),
    prompt: 'Tapez l’année',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => digits(typed) === String(y),
  };
}

const PHONE_SENTENCES = ['Vous pouvez me joindre au {x}.', 'Mon numéro, c’est le {x}.', 'Rappelez-nous au {x}.'];

// A French phone number, read in pairs: "zéro six, douze, trente-quatre…".
function phoneItem(rng: Rng, tier: number): NumberItem {
  const pairs = [`0${pick(rng, [1, 2, 3, 4, 5, 6, 7, 9])}`, ...Array.from({ length: 4 }, () => String(int(rng, 0, 99)).padStart(2, '0'))];
  const pairWords = (p: string) => (p[0] === '0' ? `zéro ${UNITS[Number(p[1])]}` : frenchNumber(Number(p)));
  const words = pairs.map(pairWords).join(', ');
  return {
    category: 'phone',
    tier,
    spoken: tier >= 2 ? sentence(rng, PHONE_SENTENCES, words) : words,
    display: pairs.join(' '),
    prompt: 'Tapez le numéro (10 chiffres)',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => plain(typed).replace(/\D/g, '') === pairs.join(''),
  };
}

const PERCENT_SENTENCES = ['Les prix ont augmenté de {x} cette année.', 'Le taux de chômage est de {x}.', 'Le magasin fait une remise de {x}.'];

function percentItem(rng: Rng, tier: number): NumberItem {
  const whole = tier === 0 ? int(rng, 2, 100) : int(rng, 2, 99);
  const tenth = tier === 0 ? 0 : rng() < 0.6 ? int(rng, 1, 9) : 0;
  const words = `${frenchNumber(whole)}${tenth ? ` virgule ${UNITS[tenth]}` : ''} pour cent`;
  const want = tenth ? `${whole},${tenth}` : String(whole);
  return {
    category: 'percent',
    tier,
    spoken: tier >= 2 ? sentence(rng, PERCENT_SENTENCES, words) : words,
    display: `${want} %`,
    prompt: 'Tapez le pourcentage (ex. 12,5)',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => decimal(typed).replace(/%|pourcent/g, '') === want,
  };
}

const TEMP_SENTENCES = ['Demain, il fera {x}.', 'Ce matin, il faisait {x} à Montréal.', 'Cette nuit, la température descendra jusqu’à {x}.'];

function temperatureItem(rng: Rng, tier: number): NumberItem {
  const t = tier === 0 ? int(rng, -15, 35) : int(rng, -35, 40);
  const abs = Math.abs(t);
  const words = `${t < 0 ? 'moins ' : ''}${frenchNumber(abs)} ${abs < 2 ? 'degré' : 'degrés'}`;
  return {
    category: 'temperature',
    tier,
    spoken: tier >= 2 ? sentence(rng, TEMP_SENTENCES, words) : words,
    display: `${t} °C`,
    prompt: 'Tapez la température (ex. -5)',
    keyboard: 'numbers-and-punctuation',
    check: (typed) => {
      const s = plain(typed).replace(SPACES, '').replace(/^moins/, '-').replace(/°|degres?|c$/g, '');
      return s === String(t) || (t > 0 && s === `+${t}`);
    },
  };
}

export function makeItem(category: CategoryId, tier: number, rng: Rng = Math.random): NumberItem {
  switch (category) {
    case 'n0_59': {
      const n = tier >= 2 ? int(rng, 2, 59) : int(rng, 0, 59);
      return pureItem(rng, 'n0_59', tier, n);
    }
    case 'n60_79':
    case 'n80_99':
      return tensItem(rng, category, tier);
    case 'hundreds':
      return hundredsItem(rng, tier);
    case 'thousands':
      return thousandsItem(rng, tier);
    case 'price':
      return priceItem(rng, tier);
    case 'time':
      return timeItem(rng, tier);
    case 'date':
      return dateItem(rng, tier);
    case 'year':
      return yearItem(rng, tier);
    case 'phone':
      return phoneItem(rng, tier);
    case 'percent':
      return percentItem(rng, tier);
    case 'temperature':
      return temperatureItem(rng, tier);
  }
}
