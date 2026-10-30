import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exerciseFor, gradeAnswer, headword, hint, makeCloze } from './answer.ts';

test('new words are flashcards, then exercises rotate', () => {
  assert.equal(exerciseFor(0, true), 'flashcard');
  assert.equal(exerciseFor(1, true), 'dictation');
  assert.equal(exerciseFor(2, true), 'meaning');
  assert.equal(exerciseFor(3, true), 'cloze');
  assert.equal(exerciseFor(3, false), 'dictation');
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
