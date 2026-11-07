import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balanced } from './balance.ts';
import { READING_A2 } from './a2.ts';
import { READING_B1 } from './b1.ts';
import { READING_B2 } from './b2.ts';

const raw = [...READING_A2, ...READING_B1, ...READING_B2];

test('balancing keeps the same right answer and the same choices', () => {
  const out = balanced(raw);
  raw.forEach((item, i) =>
    item.questions.forEach((q, qi) => {
      const b = out[i].questions[qi];
      assert.equal(b.choices[b.answer], q.choices[q.answer], `${item.id} q${qi}`);
      assert.deepEqual([...b.choices].sort(), [...q.choices].sort(), `${item.id} q${qi}`);
    }),
  );
});

test('balanced answers are spread over every position', () => {
  const counts = [0, 0, 0, 0];
  for (const item of balanced(raw)) for (const q of item.questions) counts[q.answer]++;
  const total = counts.reduce((a, b) => a + b, 0);
  for (const n of counts) assert.ok(n / total > 0.15, `answer positions ${counts}`);
});
