// Finds human recordings for the starter deck and writes src/data/recordings.ts.
//   - Each word: a Lingua Libre recording on Wikimedia Commons (files named "LL-Q150 (fra)-<speaker>-<word>.wav").
//   - Each word: a Tatoeba sentence that uses it, has a human recording and, if possible, an English translation.
// Run with: node --experimental-strip-types scripts/fetch-recordings.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { headword } from '../src/lib/answer.ts';
import { STARTER_VOCAB } from '../src/data/vocab.ts';
import type { RealExample, Recording } from '../src/data/recordings.ts';

const UA = { 'User-Agent': 'JeNeSaisQuiz/1.0 (personal French study app; github.com/yan00126/Je-Ne-Sais-Quiz)' };

async function json(url: string): Promise<any> {
  for (let tries = 0; ; tries++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) return res.json();
    if (tries >= 3 || res.status < 500) throw new Error(`${res.status} ${url}`);
    await new Promise((r) => setTimeout(r, 2000 * 2 ** tries));
  }
}

const norm = (s: string) => s.normalize('NFC').replace(/’/g, "'").toLowerCase();

// The forms to look a word up by: the whole phrase without its article, then its headword.
function lookupForms(fr: string) {
  const first = fr.split('/')[0].replace(/\(.*?\)/g, '').trim();
  return [...new Set([headword(first), headword(first).split(' ')[0]])].filter((f) => f.length > 1);
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
    const data = await json(`https://commons.wikimedia.org/w/api.php?${q}`);
    const pages: any[] = Object.values(data.query?.pages ?? {});
    const suffix = `-${norm(form)}.wav`;
    const page = pages.find((p) => norm(p.title).endsWith(suffix));
    if (!page) continue;
    const info = page.imageinfo[0];
    const speaker = page.title.replace(/^File:LL-Q150 \(fra\)-/, '').split('-')[0];
    return {
      url: info.url,
      author: speaker,
      license: info.extmetadata?.LicenseShortName?.value ?? 'CC BY-SA 4.0',
      source: 'Lingua Libre',
      page: info.descriptionurl,
    };
  }
  return null;
}

// Shortish, everyday sentences read best on a card.
const wordCount = (s: string) => s.split(/\s+/).length;

async function tatoeba(fr: string): Promise<RealExample | null> {
  for (const form of lookupForms(fr)) {
    const q = new URLSearchParams({ lang: 'fra', q: `="${form}"`, has_audio: 'yes', sort: 'random', limit: '50', showtrans: 'eng' });
    const data = await json(`https://api.tatoeba.org/unstable/sentences?${q}`);
    const re = new RegExp(`(^|[^\\p{L}])${norm(form).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'u');
    const candidates = (data.data as any[])
      .filter((s) => re.test(norm(s.text)) && s.audios?.length && wordCount(s.text) >= 5 && wordCount(s.text) <= 16)
      .map((s) => ({ s, en: (s.translations ?? []).flat().find((t: any) => t.lang === 'eng')?.text ?? null }))
      .sort((a, b) => Number(!!b.en) - Number(!!a.en) || wordCount(a.s.text) - wordCount(b.s.text));
    const pick = candidates[0];
    if (!pick) continue;
    const audio = pick.s.audios[0];
    return {
      fr: pick.s.text,
      en: pick.en,
      audio: {
        url: `https://tatoeba.org/audio/download/${audio.id}`,
        author: audio.author ?? 'Tatoeba',
        license: audio.license || 'Tatoeba',
        source: 'Tatoeba',
        page: `https://tatoeba.org/fr/sentences/show/${pick.s.id}`,
      },
    };
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
