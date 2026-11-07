import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fontFor, isThemeId, THEME_ORDER, THEMES } from './themes.ts';

test('every theme has a font for each role and a look for each skill', () => {
  for (const id of THEME_ORDER) {
    const t = THEMES[id];
    assert.ok(fontFor(t, 'head', '700'));
    assert.ok(fontFor(t, 'body', '400'));
    assert.deepEqual(Object.keys(t.skills).sort(), ['listening', 'reading', 'speaking', 'vocab', 'writing']);
  }
});

test('a weight the theme lacks falls back to the closest one, bold stays bold', () => {
  const bonbon = THEMES.bonbon; // body: 500, 700, 800
  assert.equal(fontFor(bonbon, 'body', '400'), 'Nunito_500Medium');
  assert.equal(fontFor(bonbon, 'body', '600'), 'Nunito_700Bold');
  assert.equal(fontFor(bonbon, 'body', 'bold'), 'Nunito_700Bold');
  assert.equal(fontFor(THEMES.cahier, 'head', '800'), 'ArchivoBlack_400Regular');
  assert.equal(fontFor(THEMES.cahier, 'body', '800'), 'SpaceGrotesk_700Bold');
});

test('only known theme ids are accepted from settings', () => {
  assert.equal(isThemeId('metro'), true);
  assert.equal(isThemeId('dark'), false);
  assert.equal(isThemeId(null), false);
});
