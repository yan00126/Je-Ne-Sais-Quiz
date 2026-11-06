// Finds human recordings for the starter deck and writes src/data/recordings.ts.
//   - Each word: a Lingua Libre recording on Wikimedia Commons (files named "LL-Q150 (fra)-<speaker>-<word>.wav").
//   - Each word: a Tatoeba sentence that uses it, has a human recording and, if possible, an English translation.
// Run with: node --experimental-strip-types scripts/fetch-recordings.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { headword } from '../src/lib/answer.ts';
import { STARTER_VOCAB } from '../src/data/vocab.ts';
import type { RealExample, Recording } from '../src/data/recordings.ts';

const UA = { 'User-Agent': 'JeNeSaisQuiz/1.0 (personal French study app; github.com/yan00126/Je-Ne-Sais-Quiz)' };

const stripTags = (html: string) => html.replace(/<[^>]+>/g, '').trim();

// The Artist field reads "Speaker: <name> Recorder: <name>".
const speakerOf = (info: any) => stripTags(info.extmetadata?.Artist?.value ?? '').match(/Speaker:\s*(.+)/)?.[1].trim();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Retries server errors and rate limits (Wikimedia answers 429 with a Retry-After in seconds).
async function json(url: string): Promise<any> {
  for (let tries = 0; ; tries++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) return res.json();
    if (tries >= 5 || (res.status < 500 && res.status !== 429)) throw new Error(`${res.status} ${url}`);
    await sleep(Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** tries);
  }
}

const norm = (s: string) => s.normalize('NFC').replace(/’/g, "'").toLowerCase();

// The forms to look a word up by: the whole phrase without its article, then its headword.
function lookupForms(fr: string) {
  // Phrases are looked up whole: a single word of "tenir compte de" finds sentences about something else.
  return [headword(fr.split('/')[0].replace(/\(.*?\)/g, '').trim())];
}

async function linguaLibre(fr: string): Promise<Recording | null> {
  for (const form of lookupForms(fr)) {
    const q = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrnamespace: '6',
      gsrlimit: '20',
      gsrsearch: `intitle:"LL-Q150 (fra)" intitle:"${form}"`,
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
    });
    await sleep(1000); // stay well under Wikimedia's rate limit
    const data = await json(`https://commons.wikimedia.org/w/api.php?${q}`);
    const pages: any[] = Object.values(data.query?.pages ?? {});
    const prefix = 'File:LL-Q150 (fra)-';
    const suffix = `-${form.replace(/’/g, "'")}.wav`;
    // Titles are "LL-Q150 (fra)-<speaker>-<word>.wav". A speaker name can contain hyphens and a word can end
    // like ours ("nu-propriétaire"), so the part before our word must be exactly the file's author.
    // Case matters too: "Réunion" is the island.
    const match = pages
      .map((p) => ({ p, info: p.imageinfo?.[0], speaker: p.title.startsWith(prefix) && p.title.normalize('NFC').endsWith(suffix) ? p.title.slice(prefix.length, -suffix.length) : null }))
      .find(({ info, speaker }) => speaker && info && speakerOf(info) === speaker.replace(/_/g, ' '));
    if (!match) continue;
    const license = match.info.extmetadata?.LicenseShortName?.value;
    if (!license) continue;
    return {
      url: match.info.url.split('?')[0],
      author: match.speaker!,
      license,
      source: 'Lingua Libre',
      page: match.info.descriptionurl,
    };
  }
  return null;
}

// Sentences checked by hand and rejected: the word is used in another sense ("quartier général"),
// or the sentence is too odd to learn from.
const REJECTED = new Set([5685933, 450587, 880932]);

// Shortish, everyday sentences read best on a card.
const wordCount = (s: string) => s.split(/\s+/).length;

// Each Tatoeba contributor picks one licence for all their recordings; it is shown on their audio page.
// Recordings without a licence can't be reused outside Tatoeba, so those are skipped.
const licences = new Map<string, Promise<string | null>>();
function audioLicence(user: string) {
  if (!licences.has(user)) {
    licences.set(
      user,
      fetch(`https://tatoeba.org/en/audio/of/${encodeURIComponent(user)}`, { headers: UA })
        .then((r) => r.text())
        .then((html) => html.match(/licensed under the\s*<a[^>]*>([^<]+)<\/a>/)?.[1].trim() ?? null)
        .catch(() => null),
    );
  }
  return licences.get(user)!;
}

async function tatoeba(fr: string): Promise<RealExample | null> {
  for (const form of lookupForms(fr)) {
    const q = new URLSearchParams({ from: 'fra', to: 'eng', query: `"${form}"`, has_audio: 'yes', sort: 'words' });
    const data = await json(`https://tatoeba.org/en/api_v0/search?${q}`);
    const re = new RegExp(`(^|[^\\p{L}])${norm(form).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u');
    const candidates = (data.results as any[])
      .filter((s) => !REJECTED.has(s.id) && re.test(norm(s.text)) && s.audios?.length && wordCount(s.text) >= 5 && wordCount(s.text) <= 14)
      .map((s) => ({ s, en: (s.translations ?? []).flat().find((t: any) => t.lang === 'eng')?.text ?? null }))
      .sort((a, b) => Number(!!b.en) - Number(!!a.en) || wordCount(a.s.text) - wordCount(b.s.text));
    for (const { s, en } of candidates) {
      const audio = s.audios[0];
      const license = audio.license ?? (await audioLicence(audio.author));
      if (!license) continue;
      return {
        fr: s.text,
        en,
        audio: {
          url: `https://tatoeba.org/en/audio/download/${audio.id}`,
          author: audio.author,
          license,
          source: 'Tatoeba',
          page: `https://tatoeba.org/fr/sentences/show/${s.id}`,
        },
      };
    }
  }
  return null;
}

const words: Record<string, Recording> = {};
const examples: Record<string, RealExample> = {};
for (const item of STARTER_VOCAB) {
  const [w, e] = await Promise.all([linguaLibre(item.fr).catch(() => null), tatoeba(item.fr).catch(() => null)]);
  if (w) words[item.id] = w;
  if (e) examples[item.id] = e;
  console.log(`${item.id} ${item.fr.padEnd(28)} word:${w ? '✓' : '·'} example:${e ? '✓' : '·'}`);
}
console.log(`\n${Object.keys(words).length}/${STARTER_VOCAB.length} words, ${Object.keys(examples).length}/${STARTER_VOCAB.length} examples`);

const path = new URL('../src/data/recordings.ts', import.meta.url);
const header = readFileSync(path, 'utf8').split('export const WORD_AUDIO')[0];
writeFileSync(
  path,
  `${header}export const WORD_AUDIO: Record<string, Recording> = ${JSON.stringify(words, null, 2)};\n\n` +
    `export const REAL_EXAMPLES: Record<string, RealExample> = ${JSON.stringify(examples, null, 2)};\n`,
);
