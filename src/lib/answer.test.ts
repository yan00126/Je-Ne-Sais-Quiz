import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clozeReveal, exerciseFor, gradeAnswer, headword, hint, makeCloze, phraseKind, maxHints, phraseWords } from './answer.ts';

test('new words are flashcards, then exercises go from picking to typing', () => {
  assert.equal(exerciseFor(0, true), 'flashcard');
  assert.deepEqual([1, 2, 3, 4, 5, 6].map((r) => exerciseFor(r, true)), ['choice', 'clozeChoice', 'dictation', 'meaning', 'cloze', 'choice']);
  assert.deepEqual([1, 2, 3, 4].map((r) => exerciseFor(r, false)), ['choice', 'dictation', 'meaning', 'choice']);
});

test('a forgotten word comes back as a multiple-choice question', () => {
  assert.equal(exerciseFor(4, true, true), 'clozeChoice');
  assert.equal(exerciseFor(5, true, true), 'choice');
  assert.equal(exerciseFor(4, false, true), 'choice');
  assert.equal(exerciseFor(0, true, true), 'flashcard');
});

test('answers are accepted with or without the article', () => {
  assert.equal(gradeAnswer('logement', 'un logement'), 'correct');
  assert.equal(gradeAnswer('Un logement ', 'un logement'), 'correct');
  assert.equal(gradeAnswer('citoyenne', 'un citoyen / une citoyenne'), 'correct');
  assert.equal(gradeAnswer('bien que', 'bien que (+ subjonctif)'), 'correct');
  assert.equal(gradeAnswer("s'habituer à", 's’habituer à'), 'correct');
});

test('missing accents are flagged, wrong words are wrong', () => {
  assert.equal(gradeAnswer('diplome', 'un diplôme'), 'accents');
  assert.equal(gradeAnswer('emploi', 'un logement'), 'wrong');
  assert.equal(gradeAnswer('', 'un logement'), 'wrong');
});

test('reflexive pronouns are required in typed answers', () => {
  assert.equal(gradeAnswer('rendre compte', 'se rendre compte (de)'), 'wrong');
  assert.equal(gradeAnswer('habituer à', 's’habituer à'), 'wrong');
  assert.equal(gradeAnswer('se rendre compte', 'se rendre compte (de)'), 'correct');
  assert.equal(gradeAnswer("s'habituer à", 's’habituer à'), 'correct');
  assert.equal(gradeAnswer("s'habituer a", 's’habituer à'), 'accents');
  assert.equal(headword('se rendre compte (de)'), 'se rendre compte');
  assert.equal(headword('s’habituer à'), "s'habituer à");
});

test('clozes skip partial words and keep searching for a whole match', () => {
  assert.equal(makeCloze('un art', 'Les artistes arrivent.'), null);
  assert.equal(makeCloze('une démarche', 'Les démarches prennent du temps.'), null);
  assert.equal(makeCloze('la plupart de', 'La plupart des Canadiens.'), null);
  assert.equal(makeCloze('un art', 'Un artiste aime l’art.')?.sentence, 'Un artiste aime l’____.');
  assert.equal(makeCloze('un art', 'Artiste ou art ?')?.sentence, 'Artiste ou ____ ?');
  assert.equal(makeCloze('', ''), null);
});

test('cloze blanks the word inside its example', () => {
  assert.equal(headword('un logement'), 'logement');
  const c = makeCloze('un logement', 'Trouver un logement à Montréal coûte cher.');
  assert.equal(c?.answer, 'logement');
  assert.match(c!.sentence, /Trouver un _{8} à Montréal/);
  assert.equal(makeCloze('remplir un formulaire', 'Vous devez remplir ce formulaire.'), null);
});

test('hints reveal more letters each time', () => {
  assert.equal(hint('un logement', 1), 'u_ l_______');
  assert.equal(hint('s’habituer à', 2), 's’ha______ à');
  assert.equal(hint('logement', 20), 'logement');
});

test('typing both forms of a word, as shown on the card, is correct', () => {
  assert.equal(gradeAnswer('un citoyen / une citoyenne', 'un citoyen / une citoyenne'), 'correct');
  assert.equal(gradeAnswer('un citoyen/une citoyenne', 'un citoyen / une citoyenne'), 'correct');
});

test('a cloze never asks for an article the sentence already shows', () => {
  const c = makeCloze('les transports en commun', 'Je prends les transports en commun pour aller au travail.')!;
  assert.equal(c.answer, 'transports en commun');
  assert.match(c.sentence, /^Je prends les _+ pour/);
  // Shown after checking: the words from the blank, not "les transports en commun".
  assert.deepEqual(clozeReveal('les transports en commun', c), { word: 'transports en commun', entry: 'les transports en commun' });
  // Typing it with or without the article is fine.
  assert.equal(gradeAnswer('transports en commun', c.answer), 'correct');
  assert.equal(gradeAnswer('les transports en commun', c.answer), 'correct');
  assert.equal(gradeAnswer('Transports en commun', c.answer), 'correct');
});

test('a cloze reveal lists the dictionary form only when it differs', () => {
  const loyer = makeCloze('un loyer', 'Le loyer augmente chaque année en juillet.')!;
  assert.deepEqual(clozeReveal('un loyer', loyer), { word: 'loyer', entry: 'un loyer' });
  const cependant = makeCloze('cependant', 'Le projet est intéressant ; cependant, il manque de financement.')!;
  assert.deepEqual(clozeReveal('cependant', cependant), { word: 'cependant', entry: null });
});

test('a cloze only blanks a whole word, never the middle of one', () => {
  assert.equal(makeCloze('un art', 'Il doit partir, car il aime l’art.')?.sentence, 'Il doit partir, car il aime l’____.');
  assert.equal(makeCloze('un art', 'Il doit partir.'), null);
});

test('the "…" and other punctuation in a phrase do not have to be typed', () => {
  const fr = 'd’une part… d’autre part';
  assert.equal(gradeAnswer("d'une part d'autre part", fr), 'correct');
  assert.equal(gradeAnswer('d’une part d’autre part', fr), 'correct');
  assert.equal(gradeAnswer("d'une part... d'autre part", fr), 'correct');
  assert.equal(gradeAnswer("D'une part, d'autre part.", fr), 'correct');
  assert.equal(gradeAnswer("d'une part…d'autre part", fr), 'correct');
  assert.equal(gradeAnswer("d' une part d' autre part", fr), 'correct');
  assert.equal(gradeAnswer('non seulement mais aussi', 'non seulement… mais aussi'), 'correct');
  assert.equal(gradeAnswer("d'un cote de l'autre", 'd’un côté… de l’autre'), 'accents');
  assert.equal(gradeAnswer("d'une part", fr), 'wrong');
  assert.equal(gradeAnswer('…', fr), 'wrong');
  assert.equal(gradeAnswer("d'une part – d'autre part", fr), 'correct');
  assert.equal(gradeAnswer('d’une part — d’autre part', fr), 'correct');
  assert.equal(gradeAnswer("d'une part - d'autre part", fr), 'correct');
  // Hyphens inside a word and apostrophes still count.
  assert.equal(gradeAnswer('rendez vous', 'un rendez-vous'), 'wrong');
});

test('hints keep the "…" visible and are limited by the longest word', () => {
  assert.equal(hint('d’une part… d’autre part', 1), 'd’u__ p___… d’a____ p___');
  assert.equal(maxHints('d’une part… d’autre part'), 4);
  assert.equal(maxHints('un logement'), 7);
});

test('long phrases are built from tiles instead of typed from their meaning', () => {
  assert.equal(phraseKind('d’une part… d’autre part'), 'split');
  assert.equal(phraseKind('il est indispensable que (+ subj.)'), 'long');
  assert.equal(phraseKind('à cause de'), false);
  assert.equal(phraseKind('le réchauffement climatique'), false);
  assert.equal(phraseKind('un citoyen / une citoyenne'), false);
  assert.deepEqual(phraseWords('d’une part… d’autre part'), ["d'une", 'part', "d'autre", 'part']);
  assert.deepEqual([1, 2, 3, 4].map((r) => exerciseFor(r, false, false, 'long')), ['choice', 'dictation', 'build', 'choice']);
  // A phrase in two parts is never typed, not even when heard.
  assert.deepEqual([1, 2, 3, 4].map((r) => exerciseFor(r, false, false, 'split')), ['choice', 'build', 'build', 'choice']);
  assert.equal(exerciseFor(4, true, false, 'long'), 'build');
  assert.equal(exerciseFor(3, false, false, false), 'meaning');
});
