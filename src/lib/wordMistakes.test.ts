import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyAnswer, classifyMiss, editDistance, RULE_FOR_ERROR, weakPoints, type WordMistake } from './wordMistakes.ts';
import { GRAMMAR, RULE_BY_ID, searchRules, TOPICS } from '../data/grammar/index.ts';

const deck = [
  { id: 'v001', fr: 'un logement' },
  { id: 'v002', fr: 'un loyer' },
  { id: 'v020', fr: 'une augmentation' },
  { id: 'v400', fr: 'dépendre de' },
  { id: 'v500', fr: 'élevé' },
  { id: 'v600', fr: 'un citoyen / une citoyenne' },
];
const type = (expected: string, given: string) => classifyAnswer(expected, given, deck)?.type ?? null;

test('a right answer is not a mistake', () => {
  assert.equal(classifyAnswer('un logement', 'logement', deck), null);
  assert.equal(classifyAnswer('un citoyen / une citoyenne', 'une citoyenne', deck), null);
});

test('classifies the usual kinds of wrong answers', () => {
  assert.equal(type('un logement', ''), 'unknown');
  assert.equal(type('une augmentation', 'une augmentation'), null);
  assert.equal(type('élevé', 'eleve'), 'accents');
  assert.equal(type('une augmentation', 'un augmentation'), 'gender');
  assert.equal(type('un logement', 'le logement'), null);
  assert.equal(type('un logement', 'la logement'), 'gender');
  assert.equal(type('un citoyen / une citoyenne', 'un citoyenne'), 'gender');
  assert.equal(type('un citoyen / une citoyenne', 'une citoyenne'), null);
  // Words that start like an article keep their letters.
  assert.equal(type('la lecture', 'lecturre'), 'spelling');
  assert.equal(type('lentement', 'lentemant'), 'spelling');
  assert.equal(type('l’hôpital', 'l’hopital'), 'accents');
  assert.equal(type('élevé', 'élevées'), 'agreement');
  assert.equal(type('dépendre de', 'dépendre'), 'preposition');
  assert.equal(type('dépendre de', 'dépendre à'), 'preposition');
  assert.equal(type('un logement', 'logemant'), 'spelling');
  assert.equal(type('un logement', 'voiture'), 'other');
});

test('a typed word of the deck is a confusion with that word, not a spelling mistake', () => {
  const c = classifyAnswer('un logement', 'un loyer', deck, 'v001');
  assert.deepEqual(c, { type: 'confusion', confusedWith: 'v002', ruleId: null });
});

test('mistakes point to their grammar card, and every card they name exists', () => {
  assert.equal(classifyAnswer('une augmentation', 'un augmentation', deck)?.ruleId, 'G-GENRE-01');
  assert.equal(classifyAnswer('bien que (+ subjonctif)', 'bien qe', deck)?.ruleId, null);
  for (const id of Object.values(RULE_FOR_ERROR)) assert.ok(RULE_BY_ID.has(id!), id);
});

test('picked options and matching pairs say which word was taken for the right one', () => {
  assert.deepEqual(classifyMiss('un logement', { given: 'un loyer', confusedWith: 'v002' }, 'choice', deck, 'v001'), { type: 'confusion', confusedWith: 'v002', ruleId: null });
  assert.equal(classifyMiss('un logement', { given: '' }, 'match', deck, 'v001')?.type, 'unknown');
  assert.equal(classifyMiss('le loyer augmente', { given: 'augmente le loyer' }, 'build', deck, 'v1')?.type, 'other');
  // A cloze is graded against the word in the blank.
  assert.equal(classifyMiss('élevé', { given: 'élevé', expected: 'élevées' }, 'cloze', deck, 'v500')?.type, 'agreement');
});

test('edit distance', () => {
  assert.equal(editDistance('logement', 'logemant'), 1);
  assert.equal(editDistance('', 'abc'), 3);
  assert.equal(editDistance('chat', 'chat'), 0);
});

const m = (card_id: string, error_type: WordMistake['error_type'], at: number, confused_with: string | null = null): WordMistake => ({
  card_id, error_type, confused_with, rule_id: null, created_at: at,
});

test('weak points: the patterns that come back, most frequent first, single slips left out', () => {
  const rows = [
    m('v020', 'gender', 1), m('v021', 'gender', 2), m('v022', 'gender', 3),
    m('v001', 'confusion', 4, 'v002'), m('v002', 'confusion', 5, 'v001'),
    m('v400', 'unknown', 6), m('v400', 'unknown', 7),
    m('v500', 'agreement', 8),
  ];
  const points = weakPoints(rows);
  assert.deepEqual(points.map((p) => p.kind), ['type', 'word', 'pair']);
  assert.deepEqual(points[0], { kind: 'type', type: 'gender', ruleId: 'G-GENRE-01', count: 3, last: 3 });
  assert.deepEqual(points[2], { kind: 'pair', ids: ['v001', 'v002'], count: 2, last: 5 });
  assert.deepEqual(weakPoints([m('v1', 'gender', 1)]), []);
});

test('a word missed only through one confusion shows as the pair, not twice', () => {
  const rows = [m('v001', 'confusion', 1, 'v002'), m('v001', 'confusion', 2, 'v002'), m('v009', 'spelling', 3), m('v008', 'spelling', 4)];
  const points = weakPoints(rows);
  assert.deepEqual(points.map((p) => p.kind), ['type', 'pair']);
});

test('one word missed the same way shows once, and unknown words are left out before the limit', () => {
  const same = [m('v009', 'spelling', 1), m('v009', 'spelling', 2), m('v009', 'spelling', 3)];
  assert.deepEqual(weakPoints(same).map((p) => p.kind), ['type']);
  const custom = [m('u1', 'unknown', 1), m('u1', 'unknown', 2), m('u1', 'unknown', 3), m('v400', 'unknown', 4), m('v400', 'unknown', 5)];
  assert.deepEqual(weakPoints(custom, 3, 2, (id) => id.startsWith('v')), [{ kind: 'word', id: 'v400', count: 2, last: 5 }]);
});

test('grammar cards are complete, unique and searchable', () => {
  assert.ok(GRAMMAR.length >= 60, `${GRAMMAR.length} cards`);
  assert.equal(RULE_BY_ID.size, GRAMMAR.length, 'duplicate id');
  for (const r of GRAMMAR) {
    assert.match(r.id, /^G-[A-Z]+-\d{2}$/, r.id);
    assert.ok(TOPICS.includes(r.topic), r.id);
    assert.ok(r.rule.length > 20 && r.examples.length > 0 && r.keywords.length > 0, r.id);
    for (const e of r.examples) assert.ok(e.fr.trim() && e.en.trim(), r.id);
  }
  assert.equal(searchRules('subjonctif bien que')[0].id, 'G-SUBJ-05');
  assert.equal(searchRules('dont')[0].id, 'G-REL-02');
  assert.equal(searchRules('Depuis')[0].id, 'G-PASSE-07');
  assert.deepEqual(searchRules(''), []);
  assert.deepEqual(searchRules('zzzz'), []);
});
