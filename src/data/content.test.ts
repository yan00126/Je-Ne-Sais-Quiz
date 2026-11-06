// Checks that the built-in content is complete and consistent, so a typo in a new
// question or word shows up here instead of as a broken screen on the phone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { READING, LISTENING, type ComprehensionItem } from './comprehension.ts';
import { WRITING_TASKS, SPEAKING_TASKS } from './prompts.ts';
import { STARTER_VOCAB } from './vocab.ts';
import { DIALOGUES } from './dialogues.ts';
import { clozeReveal, gradeAnswer, makeCloze } from '../lib/answer.ts';

function assertUniqueIds(name: string, items: { id: string }[]) {
  const seen = new Set<string>();
  for (const { id } of items) {
    assert.ok(id.trim(), `${name}: empty id`);
    assert.ok(!seen.has(id), `${name}: duplicate id ${id}`);
    seen.add(id);
  }
}

test('ids are unique across all content', () => {
  // Progress and the mistake log are keyed by id, so a clash would mix two items' history.
  assertUniqueIds('all content', [
    ...READING, ...LISTENING, ...WRITING_TASKS, ...SPEAKING_TASKS, ...STARTER_VOCAB, ...DIALOGUES,
  ]);
});

function checkComprehension(name: string, items: ComprehensionItem[]) {
  assert.ok(items.length > 0, `${name} is empty`);
  for (const item of items) {
    const where = `${name} ${item.id}`;
    assert.ok(['A2', 'B1', 'B2'].includes(item.level), `${where}: bad level ${item.level}`);
    assert.ok(item.title.trim() && item.text.trim(), `${where}: missing title or text`);
    assert.ok(item.questions.length > 0, `${where}: no questions`);
    for (const q of item.questions) {
      const qWhere = `${where} "${q.prompt}"`;
      assert.ok(q.prompt.trim(), `${where}: empty question`);
      assert.ok(q.choices.length >= 2, `${qWhere}: needs at least 2 choices`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, `${qWhere}: answer index out of range`);
      assert.ok(q.choices.every((c) => c.trim()), `${qWhere}: empty choice`);
      assert.equal(new Set(q.choices).size, q.choices.length, `${qWhere}: duplicate choices`);
    }
  }
}

test('reading items have valid questions', () => checkComprehension('READING', READING));
test('listening items have valid questions', () => checkComprehension('LISTENING', LISTENING));

test('the correct answer is not always in the same position', () => {
  // If every answer were choice B, you could pass without reading.
  const positions = new Set([...READING, ...LISTENING].flatMap((i) => i.questions.map((q) => q.answer)));
  assert.ok(positions.size >= 3, `answers only ever at positions ${[...positions]}`);
});

test('writing tasks cover tâches 1 to 3 with sensible word limits', () => {
  for (const n of [1, 2, 3]) assert.ok(WRITING_TASKS.some((t) => t.task === n), `no writing tâche ${n}`);
  for (const t of WRITING_TASKS) {
    assert.ok(t.prompt.trim(), `${t.id}: empty prompt`);
    assert.ok(t.minWords > 0 && t.minWords < t.maxWords, `${t.id}: bad word limits ${t.minWords}-${t.maxWords}`);
  }
});

test('speaking tasks cover tâches 1 to 3 with a time limit', () => {
  for (const n of [1, 2, 3]) assert.ok(SPEAKING_TASKS.some((t) => t.task === n), `no speaking tâche ${n}`);
  for (const t of SPEAKING_TASKS) {
    assert.ok(t.title.trim() && t.prompt.trim(), `${t.id}: missing title or prompt`);
    assert.ok(t.seconds > 0, `${t.id}: no time limit`);
  }
});

test('every vocab card has a French word, a meaning and an example', () => {
  for (const v of STARTER_VOCAB) {
    assert.ok(v.fr.trim() && v.en.trim() && v.example.trim(), `${v.id}: missing field`);
    assert.match(v.id, /^v\d{3,}$/, `${v.id}: ids look like v001`);
  }
  const words = STARTER_VOCAB.map((v) => v.fr.toLowerCase());
  const dupes = words.filter((w, i) => words.indexOf(w) !== i);
  assert.deepEqual(dupes, [], 'the same word appears twice in the deck');
});

test('typing a vocab word exactly as shown is always marked correct', () => {
  for (const v of STARTER_VOCAB) assert.equal(gradeAnswer(v.fr, v.fr), 'correct', `${v.id} ${v.fr}`);
});

test('no vocab cloze shows an article twice', () => {
  // The article stays in the sentence, so neither the blank's answer nor what is revealed may start with one.
  const article = /^(?:(?:une|un|les|le|la|des)\s|l['’])/i;
  for (const v of STARTER_VOCAB) {
    const c = makeCloze(v.fr, v.example);
    if (!c) continue;
    const where = `${v.id} "${v.fr}"`;
    assert.ok(!article.test(c.answer), `${where}: blank answer "${c.answer}" starts with an article`);
    assert.ok(!article.test(clozeReveal(v.fr, c).word), `${where}: revealed answer starts with an article`);
    assert.equal(gradeAnswer(c.answer, c.answer), 'correct', `${where}: its own answer isn't accepted`);
  }
});
