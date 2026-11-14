import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, frenchNumber, groupDigits, makeItem, MAX_TIER, type CategoryId, type Rng } from './numbers.ts';

// A seeded random generator, so failures can be reproduced.
function seeded(seed: number): Rng {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
// Always returns the values given, in turn.
const fixed = (...values: number[]): Rng => {
  let i = 0;
  return () => values[i++ % values.length];
};

test('French number words', () => {
  const cases: [number, string][] = [
    [0, 'zéro'], [1, 'un'], [16, 'seize'], [17, 'dix-sept'], [21, 'vingt et un'], [22, 'vingt-deux'],
    [60, 'soixante'], [61, 'soixante et un'], [70, 'soixante-dix'], [71, 'soixante et onze'], [77, 'soixante-dix-sept'],
    [80, 'quatre-vingts'], [81, 'quatre-vingt-un'], [90, 'quatre-vingt-dix'], [91, 'quatre-vingt-onze'], [99, 'quatre-vingt-dix-neuf'],
    [100, 'cent'], [101, 'cent un'], [200, 'deux cents'], [201, 'deux cent un'], [280, 'deux cent quatre-vingts'],
    [1000, 'mille'], [1001, 'mille un'], [1997, 'mille neuf cent quatre-vingt-dix-sept'], [2000, 'deux mille'],
    [21_000, 'vingt et un mille'], [80_000, 'quatre-vingt mille'], [200_000, 'deux cent mille'], [380_000, 'trois cent quatre-vingt mille'],
    [1_000_000, 'un million'], [2_500_000, 'deux millions cinq cent mille'], [80_000_000, 'quatre-vingts millions'],
  ];
  for (const [n, words] of cases) assert.equal(frenchNumber(n), words, String(n));
});

test('digits are grouped by three', () => {
  assert.equal(groupDigits(999), '999');
  assert.equal(groupDigits(1250), '1 250');
  assert.equal(groupDigits(2_500_000), '2 500 000');
});

test('every category makes items at every tier that accept their own answer', () => {
  const rng = seeded(42);
  for (const c of CATEGORIES)
    for (let tier = 0; tier <= MAX_TIER; tier++)
      for (let i = 0; i < 300; i++) {
        const item = makeItem(c.id, tier, rng);
        const answer = item.display.split(' (')[0];
        assert.ok(item.check(answer), `${c.id} t${tier}: "${answer}" for "${item.spoken}"`);
        assert.ok(!item.check(''), `${c.id}: empty answer accepted`);
        assert.ok(!/undefined|NaN/.test(item.spoken), item.spoken);
      }
});

test('the ranges of each category', () => {
  const rng = seeded(7);
  const values = (id: CategoryId, tier: number) => Array.from({ length: 500 }, () => Number(makeItem(id, tier, rng).display.replace(/\s/g, '')));
  assert.ok(values('n60_79', 0).every((n) => n >= 60 && n <= 79));
  assert.ok(values('n80_99', 0).every((n) => n >= 80 && n <= 99));
  assert.ok(values('n80_99', 1).every((n) => n > 100 && n < 1000 && n % 100 >= 80));
  assert.ok(values('hundreds', 0).every((n) => n >= 100 && n <= 999));
  assert.ok(values('thousands', 1).every((n) => n >= 10_000));
});

test('pure numbers: spaces and separators are fine, other numbers are not', () => {
  const item = makeItem('thousands', 0, fixed(0.25)); // 1000 + 0.25 * 9000 = 3250
  assert.equal(item.display, '3 250');
  assert.equal(item.spoken, 'trois mille deux cent cinquante');
  for (const ok of ['3250', '3 250', '3.250', '3,250', ' 3 250 ']) assert.ok(item.check(ok), ok);
  for (const no of ['325', '3205', '3250 0']) assert.ok(!item.check(no), no);
});

test('tier 2 puts the number in a sentence', () => {
  const item = makeItem('n80_99', 2, seeded(3));
  assert.match(item.spoken, /^[A-Z].*\.$/);
  assert.ok(item.spoken.includes(frenchNumber(Number(item.display.replace(/\s/g, '')))));
});

test('prices', () => {
  // 12 euros 50: euros = 2 + floor(0.1 * 98) = 11 → use explicit check on the made item instead.
  const rng = seeded(11);
  for (let i = 0; i < 200; i++) {
    const item = makeItem('price', 0, rng);
    const [euros, cents] = item.display.replace(' €', '').split(',');
    assert.ok(item.check(`${euros}${cents ? `€${cents}` : '€'}`), item.display);
    assert.ok(item.check(`${euros}${cents ? `.${cents}` : ''}`), item.display);
    assert.ok(item.check(`${euros}${cents ? ` euros ${cents}` : ' euros'}`), item.display);
    if (cents?.endsWith('0')) assert.ok(item.check(`${euros},${cents[0]}`), `${item.display} short cents`);
    if (!cents) assert.ok(item.check(`${euros},00`), item.display);
    assert.ok(!item.check(`${Number(euros) + 1}${cents ? `,${cents}` : ''}`));
  }
});

test('times: 24-hour and everyday', () => {
  const rng = seeded(5);
  let everyday = 0;
  for (let i = 0; i < 400; i++) {
    const item = makeItem('time', 1, rng);
    const [h, m] = item.display.split(' (')[0].split(' h ').map(Number);
    for (const typed of [`${h}h${String(m).padStart(2, '0')}`, `${h}:${String(m).padStart(2, '0')}`, `${h} h ${m}`]) assert.ok(item.check(typed), `${typed} for ${item.spoken}`);
    if (m === 0) assert.ok(item.check(`${h}h`));
    assert.ok(!item.check(`${h}:${(m + 1) % 60}`), item.spoken);
    if (/quart|demi|moins|midi|minuit/.test(item.spoken)) everyday++;
  }
  assert.ok(everyday > 50);
});

test('everyday time: moins le quart is the hour before, morning or evening', () => {
  // < 0.5 picks the everyday style; then offset index 3 of 4 (moins le quart), no midi/minuit, hour 7.
  const item = makeItem('time', 0, fixed(0.6, 0.8, 0.9, 6 / 11));
  assert.equal(item.spoken, 'sept heures moins le quart');
  assert.ok(item.check('6h45'));
  assert.ok(item.check('18:45'));
  assert.ok(!item.check('7h45'));
});

test('dates accept a month name or number', () => {
  const rng = seeded(9);
  for (let i = 0; i < 200; i++) {
    const item = makeItem('date', 0, rng);
    const [day, month] = item.display.split(' ');
    const d = day.replace('er', '');
    const mi = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'].indexOf(month) + 1;
    for (const typed of [`${d} ${month}`, `le ${d} ${month}`, `${d}/${String(mi).padStart(2, '0')}`, `${d}.${mi}`, `${d} ${month.normalize('NFD').replace(/[̀-ͯ]/g, '')}`])
      assert.ok(item.check(typed), `${typed} for ${item.spoken}`);
  }
  const withYear = makeItem('date', 1, rng);
  const [d, m, y] = withYear.display.split(' ');
  assert.ok(withYear.check(`${d} ${m} ${y}`));
  assert.ok(!withYear.check(`${d} ${m}`), 'year required from tier 1');
  assert.equal(makeItem('date', 0, fixed(0, 0)).spoken, 'Le premier janvier');
});

test('phone numbers are read in pairs', () => {
  const item = makeItem('phone', 0, fixed(5 / 8, 0.12, 0.345, 0.56, 0.789));
  assert.equal(item.display, '06 12 34 56 78');
  assert.equal(item.spoken, 'zéro six, douze, trente-quatre, cinquante-six, soixante-dix-huit');
  assert.ok(item.check('0612345678'));
  assert.ok(item.check('06 12 34 56 78'));
  assert.ok(item.check('06-12-34-56-78'));
  assert.ok(!item.check('061234567'));
});

test('percentages and temperatures', () => {
  const pct = makeItem('percent', 1, fixed(0.5, 0.1, 0.5)); // 2 + floor(0.5 * 98) = 51, tenth 1 + floor(0.5 * 9) = 5
  assert.equal(pct.spoken, 'cinquante et un virgule cinq pour cent');
  for (const ok of ['51,5', '51.5', '51,5 %', '51,5%']) assert.ok(pct.check(ok), ok);
  assert.ok(!pct.check('51'));

  const cold = makeItem('temperature', 0, fixed(0.1)); // -15 + floor(0.1 * 51) = -10
  assert.equal(cold.spoken, 'moins dix degrés');
  for (const ok of ['-10', '-10°', '-10 °C', '−10', 'moins 10']) assert.ok(cold.check(ok), ok);
  assert.ok(!cold.check('10'));
  assert.equal(makeItem('temperature', 0, fixed(15.5 / 51)).spoken, 'zéro degré');
});

test('times use feminine "une"', () => {
  const rng = seeded(1);
  for (let i = 0; i < 400; i++) {
    const s = makeItem('time', 1, rng).spoken;
    assert.ok(!/\bun heure|et un heures|heures? (?:vingt|trente|quarante|cinquante) et un\b/.test(s), s);
  }
});
