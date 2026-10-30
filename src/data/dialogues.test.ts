import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIALOGUES, shadowingLines } from './dialogues.ts';

test('every dialogue is complete', () => {
  assert.equal(new Set(DIALOGUES.map((d) => d.id)).size, DIALOGUES.length);
  for (const n of [1, 2, 3]) assert.ok(DIALOGUES.some((d) => d.task === n), `no dialogue for tâche ${n}`);
  for (const d of DIALOGUES) {
    assert.ok(d.turns[0].examiner, `${d.id} must open with the examiner`);
    for (const t of d.turns) {
      assert.ok(t.hints.length >= 2 && t.model, `${d.id}: ${t.goal}`);
      // In tâche 2 you ask the questions, so the examiner must answer each one.
      if (d.task === 2) assert.ok(t.reply, `${d.id}: no reply to "${t.goal}"`);
    }
  }
});

test('shadowing splits model answers into sentences', () => {
  const lines = shadowingLines(DIALOGUES[0]);
  assert.equal(lines[0], 'Je m’appelle Alex.');
  assert.ok(lines.every((l) => /[.!?]$/.test(l)));
});
