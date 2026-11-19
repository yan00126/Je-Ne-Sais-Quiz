import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STARTER_VOCAB, TOPICS, type VocabItem } from '../data/vocab.ts';
import { choiceOptions, makePool, pickDistractors, spellingSimilarity, tooClose, wordKind } from './distractors.ts';
import { headword, makeCloze } from './answer.ts';

const pool = makePool(STARTER_VOCAB, TOPICS);
const byId = new Map(STARTER_VOCAB.map((v) => [v.id, v]));
const word = (id: string) => byId.get(id)!;

test('word kinds come from the article or the ending', () => {
  assert.equal(wordKind('un loyer'), 'm');
  assert.equal(wordKind('une baisse'), 'f');
  assert.equal(wordKind('les charges'), 'pl');
  assert.equal(wordKind("l'électricité"), 'noun');
  assert.equal(wordKind('se plaindre (de)'), 'verb');
  assert.equal(wordKind('remplir un formulaire'), 'verb');
  assert.equal(wordKind('cependant', 'however'), 'link');
  assert.equal(wordKind('bruyant', 'noisy'), 'adj');
  assert.equal(wordKind('bien que (+ subjonctif)', 'although'), 'link');
});

test('look-alike words score higher than unrelated ones', () => {
  assert.ok(spellingSimilarity('un loyer', 'un logement') > spellingSimilarity('un loyer', 'une entreprise'));
  assert.ok(spellingSimilarity('une baisse', 'une hausse') > 0.6);
});

test('synonyms and longer forms of the same word are never wrong answers', () => {
  const v = (fr: string, en: string): VocabItem => ({ id: fr, fr, en, example: '' });
  assert.ok(tooClose(v('un emploi', 'a job'), v('un travail', 'work, a job')));
  assert.ok(tooClose(v('une facture', 'a bill'), v("une facture d'électricité", 'an electricity bill')));
  assert.ok(tooClose(v('louer', 'to rent'), v('louer une voiture', 'to rent a car')));
  assert.ok(tooClose(v('un logement', 'housing'), v('la crise du logement', 'the housing crisis')));
  assert.ok(!tooClose(v('un art', 'an art'), v('partir', 'to leave')));
  assert.ok(!tooClose(v('une hausse', 'a rise, increase'), v('une baisse', 'a drop, decrease')));
});

test('every word in the deck gets three distinct wrong answers of the same kind', () => {
  for (const v of STARTER_VOCAB) {
    const ds = pickDistractors(v, pool, `${v.id}:1`);
    assert.equal(ds.length, 3, v.fr);
    const kind = wordKind(v.fr, v.en);
    const heads = new Set([headword(v.fr), ...ds.map((d) => headword(d.fr))]);
    assert.equal(heads.size, 4, `${v.fr}: ${ds.map((d) => d.fr).join(', ')}`);
    for (const d of ds) {
      assert.ok(!tooClose(v, d), `${v.fr} / ${d.fr}`);
      const dk = wordKind(d.fr, d.en);
      const nouns = ['m', 'f', 'pl', 'noun'];
      assert.ok(dk === kind || (nouns.includes(dk) && nouns.includes(kind)), `${v.fr} (${kind}) / ${d.fr} (${dk})`);
    }
  }
});

test('confusable words show up: a look-alike and one from the same theme', () => {
  // Over a few reviews, "un loyer" meets "un logement" and some other housing word.
  const seen = new Set<string>();
  for (let r = 0; r < 6; r++) for (const d of pickDistractors(word('v002'), pool, `v002:${r}`)) seen.add(d.fr);
  assert.ok(seen.has('un logement'), [...seen].join(', '));
  const ds = pickDistractors(word('v1111'), pool, 'v1111:1');
  assert.ok(ds.some((d) => d.reason === 'spelling'));
  assert.ok(ds.some((d) => d.reason === 'theme' || d.reason === 'meaning'));
});

test('feminine nouns get feminine wrong answers first', () => {
  const ds = pickDistractors(word('v014'), pool, 'v014:1'); // une baisse
  assert.ok(ds.filter((d) => wordKind(d.fr) === 'f').length >= 2, ds.map((d) => d.fr).join(', '));
});

test('options are stable for a seed, shuffled, and have exactly one right answer', () => {
  const a = choiceOptions(word('v002'), pool, 'v002:3');
  const b = choiceOptions(word('v002'), pool, 'v002:3');
  assert.deepEqual(a, b);
  assert.equal(a.length, 4);
  assert.equal(a.filter((o) => o.correct).length, 1);
  assert.equal(a.find((o) => o.correct)!.text, 'un loyer');
  // The right answer isn't always in the same place.
  const spots = new Set(STARTER_VOCAB.slice(0, 40).map((v) => choiceOptions(v, pool, `${v.id}:1`).findIndex((o) => o.correct)));
  assert.ok(spots.size >= 3);
});

test('cloze options look like the word in the blank', () => {
  const v = word('v002'); // Le loyer augmente chaque année en juillet.
  const cloze = makeCloze(v.fr, v.example)!;
  assert.equal(cloze.answer, 'loyer');
  const opts = choiceOptions(v, pool, 'v002:2', cloze.answer);
  for (const o of opts) assert.doesNotMatch(o.text, /^(un|une|le|la|les) /, o.text);
  const start = STARTER_VOCAB.find((x) => makeCloze(x.fr, x.example)?.answer.match(/^\p{Lu}/u))!;
  const c = makeCloze(start.fr, start.example)!;
  for (const o of choiceOptions(start, pool, 's', c.answer)) assert.match(o.text, /^\p{Lu}/u, o.text);
});
