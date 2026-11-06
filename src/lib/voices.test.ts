import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickVoice, rankFrenchVoices, voiceTier } from './voices.ts';

const v = (identifier: string, name: string, language: string, quality = 'Default') => ({ identifier, name, language, quality });

const IPHONE = [
  v('com.apple.voice.compact.fr-FR.Thomas', 'Thomas', 'fr-FR'),
  v('com.apple.eloquence.fr-FR.Jacques', 'Jacques', 'fr-FR'),
  v('com.apple.voice.compact.fr-CA.Amelie', 'Amélie', 'fr-CA'),
  v('com.apple.voice.premium.fr-CA.Amelie', 'Amélie', 'fr-CA'),
  v('com.apple.voice.enhanced.fr-FR.Thomas', 'Thomas', 'fr-FR', 'Enhanced'),
  v('com.apple.voice.compact.en-US.Samantha', 'Samantha', 'en-US'),
];

test('Premium is detected from the identifier, since expo-speech reports it as Default', () => {
  assert.equal(voiceTier(IPHONE[3]), 'premium');
  assert.equal(voiceTier(IPHONE[4]), 'enhanced');
  assert.equal(voiceTier(IPHONE[0]), 'standard');
  assert.equal(voiceTier(IPHONE[1]), 'novelty');
});

test('the Premium voice wins, then Enhanced, then compact; only French voices', () => {
  assert.deepEqual(
    rankFrenchVoices(IPHONE).map((x) => x.identifier),
    [
      'com.apple.voice.premium.fr-CA.Amelie',
      'com.apple.voice.enhanced.fr-FR.Thomas',
      'com.apple.voice.compact.fr-FR.Thomas',
      'com.apple.voice.compact.fr-CA.Amelie',
      'com.apple.eloquence.fr-FR.Jacques',
    ],
  );
});

test('a chosen voice is kept while installed, otherwise the best one is used', () => {
  assert.equal(pickVoice(IPHONE, 'com.apple.voice.compact.fr-FR.Thomas')?.name, 'Thomas');
  assert.equal(pickVoice(IPHONE, 'gone')?.identifier, 'com.apple.voice.premium.fr-CA.Amelie');
  assert.equal(pickVoice(IPHONE, null)?.identifier, 'com.apple.voice.premium.fr-CA.Amelie');
  assert.equal(pickVoice([IPHONE[5]], null), undefined);
});
