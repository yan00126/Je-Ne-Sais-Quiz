import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LISTENING } from '../data/comprehension.ts';
import { speakers, splitTurns } from './script.ts';

test('a dialogue is split into turns without the speaker labels', () => {
  const turns = splitTurns('Client : Pour emporter. Serveuse : Ça fait six dollars. Client : Merci !');
  assert.deepEqual(turns, [
    { speaker: 'Client', line: 'Pour emporter.' },
    { speaker: 'Serveuse', line: 'Ça fait six dollars.' },
    { speaker: 'Client', line: 'Merci !' },
  ]);
  assert.deepEqual(speakers(turns), ['Client', 'Serveuse']);
});

test('a colon inside a sentence is not a speaker label', () => {
  const text = 'Attention, chers clients : les pommes sont en solde. Prudence sur les routes ce soir : la chaussée sera glissante.';
  assert.deepEqual(splitTurns(text), [{ speaker: null, line: text }]);
});

test('no listening script reads a speaker label aloud', () => {
  for (const item of LISTENING) {
    for (const turn of splitTurns(item.text)) {
      assert.doesNotMatch(turn.line, /\p{Lu}[\p{L}’'-]* : /u, `${item.id}: "${turn.line}"`);
    }
  }
});
