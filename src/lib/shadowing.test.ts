import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHADOW_SENTENCES } from '../data/shadowing/index.ts';
import {
  LEVEL_SPECS,
  MAX_GAP_MS,
  MIN_GAP_MS,
  SESSION_SIZE,
  SHADOW_LEVELS,
  countWords,
  createPlayer,
  estimateSpeechMs,
  gapMs,
  markSeen,
  pickSentences,
  rateLabel,
  sessionCounts,
  textVisible,
  watchdogMs,
  type PlayerState,
  type Sentence,
} from './shadowing.ts';

// ——— Content ———

test('every level has 150 unique sentences', () => {
  for (const level of SHADOW_LEVELS) {
    assert.equal(SHADOW_SENTENCES.filter((s) => s.level === level).length, 150, level);
    assert.ok(150 >= SESSION_SIZE * 3);
  }
  const ids = SHADOW_SENTENCES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate id');
  const texts = SHADOW_SENTENCES.map((s) => s.fr);
  assert.equal(new Set(texts).size, texts.length, 'duplicate sentence');
});

test('no two sentences start with the same six words', () => {
  const seen = new Map<string, string>();
  for (const s of SHADOW_SENTENCES) {
    const key = s.fr.toLowerCase().split(/\s+/).slice(0, 6).join(' ');
    assert.ok(!seen.has(key) || countWords(s.fr) < 8, `${s.id} starts like ${seen.get(key)}`);
    seen.set(key, s.id);
  }
});

test('sentence length matches its level', () => {
  for (const s of SHADOW_SENTENCES) {
    const [min, max] = LEVEL_SPECS[s.level].words;
    const n = countWords(s.fr);
    assert.ok(n >= min && n <= max, `${s.id} has ${n} words, expected ${min}-${max}: ${s.fr}`);
  }
});

test('higher levels have longer sentences on average', () => {
  const avg = (l: string) => {
    const rows = SHADOW_SENTENCES.filter((s) => s.level === l);
    return rows.reduce((n, s) => n + countWords(s.fr), 0) / rows.length;
  };
  for (let i = 1; i < SHADOW_LEVELS.length; i++) assert.ok(avg(SHADOW_LEVELS[i]) > avg(SHADOW_LEVELS[i - 1]) + 2);
});

test('sentences are clean French with a translation', () => {
  for (const s of SHADOW_SENTENCES) {
    assert.match(s.fr, /^[A-ZÀÂÉÈÊÎÔÛÇ]/, `${s.id} starts with a capital`);
    assert.match(s.fr, /[.?!]$/, `${s.id} ends with punctuation`);
    assert.doesNotMatch(s.fr, /'/, `${s.id} uses a straight apostrophe`);
    assert.doesNotMatch(s.fr, /\S[?!:;]/, `${s.id} needs a space before ? ! : ;`);
    assert.doesNotMatch(s.fr, / {2}/, `${s.id} has a double space`);
    assert.ok(s.en.length > 5, `${s.id} has a translation`);
    assert.match(s.id, new RegExp(`^${s.level.toLowerCase()}-\\d{3}$`));
  }
});

// ——— Levels and timing ———

test('each level is faster than the one below, and slow is always slower than normal', () => {
  for (let i = 0; i < SHADOW_LEVELS.length; i++) {
    const spec = LEVEL_SPECS[SHADOW_LEVELS[i]];
    assert.ok(spec.slowRate < spec.normalRate);
    if (i > 0) {
      const below = LEVEL_SPECS[SHADOW_LEVELS[i - 1]];
      assert.ok(spec.slowRate > below.slowRate);
      assert.ok(spec.normalRate > below.normalRate);
    }
  }
  assert.equal(rateLabel(0.75), '×0,75');
  assert.equal(rateLabel(1), '×1');
});

test('speech estimate grows with the text and shrinks with the rate', () => {
  const s = 'Il faut que je finisse ce rapport avant la fin de la journée.';
  assert.ok(estimateSpeechMs(s, 1) > estimateSpeechMs('Bonjour.', 1));
  assert.ok(estimateSpeechMs(s, 0.6) > estimateSpeechMs(s, 1));
  assert.ok(watchdogMs(s, 1) > estimateSpeechMs(s, 1) * 2);
});

test('pauses follow the pause setting and stay within bounds', () => {
  assert.ok(gapMs(3000, 'short') < gapMs(3000, 'medium'));
  assert.ok(gapMs(3000, 'medium') < gapMs(3000, 'long'));
  assert.equal(gapMs(3000, 'medium'), 3000 * 1.4 + 800);
  assert.equal(gapMs(100, 'short'), MIN_GAP_MS);
  assert.equal(gapMs(60_000, 'long'), MAX_GAP_MS);
});

test('a session counts once three quarters of it is played through', () => {
  assert.equal(sessionCounts(5, 8), false);
  assert.equal(sessionCounts(6, 8), true);
  assert.equal(sessionCounts(0, 0), false);
});

// ——— Choosing sentences ———

test('a session takes sentences of the chosen level only, least practised first', () => {
  const b1 = SHADOW_SENTENCES.filter((s) => s.level === 'B1');
  const seen = markSeen({}, b1.slice(0, 20).map((s) => s.id), 1000);
  const picked = pickSentences(SHADOW_SENTENCES, 'B1', seen, 8, () => 0.5);
  assert.equal(picked.length, 8);
  assert.ok(picked.every((s) => s.level === 'B1'));
  assert.ok(picked.every((s) => !seen[s.id]), 'unseen sentences come first');
});

test('when all were practised equally, the ones seen longest ago come back first', () => {
  const a1 = SHADOW_SENTENCES.filter((s) => s.level === 'A1');
  let seen = markSeen({}, a1.map((s) => s.id), 1000);
  seen = markSeen(seen, a1.slice(4).map((s) => s.id), 2000);
  seen = markSeen(seen, a1.slice(0, 4).map((s) => s.id), 500); // older second view
  seen = { ...seen, ...Object.fromEntries(a1.slice(0, 4).map((s) => [s.id, { n: 2, at: 500 }])) };
  const picked = pickSentences(SHADOW_SENTENCES, 'A1', seen, 4, () => 0.5);
  assert.deepEqual(picked.map((s) => s.id), a1.slice(0, 4).map((s) => s.id));
});

test('two fresh sessions are shuffled differently', () => {
  let i = 0;
  const seq = [0.9, 0.1, 0.5, 0.3, 0.7, 0.2, 0.8, 0.4];
  const first = pickSentences(SHADOW_SENTENCES, 'A2', {}, 8, () => seq[i++ % seq.length]);
  const second = pickSentences(SHADOW_SENTENCES, 'A2', {}, 8, () => 0.5);
  assert.notDeepEqual(first.map((s) => s.id), second.map((s) => s.id));
});

test('marking sentences seen counts views and keeps the rest', () => {
  const seen = markSeen(markSeen({ x: { n: 3, at: 1 } }, ['a'], 10), ['a', 'b'], 20);
  assert.deepEqual(seen, { x: { n: 3, at: 1 }, a: { n: 2, at: 20 }, b: { n: 1, at: 20 } });
});

test('text visibility follows the setting', () => {
  assert.equal(textVisible('always', 'slow', false), true);
  assert.equal(textVisible('hidden', 'gapNormal', true), false);
  assert.equal(textVisible('after', 'slow', false), false);
  assert.equal(textVisible('after', 'gapSlow', false), true);
  assert.equal(textVisible('after', 'slow', true), true); // replaying keeps it shown
});

// ——— The player, on a fake clock ———

function harness(sentences: Sentence[], opts: { level?: 'A1' | 'A2' | 'B1' | 'B2'; pause?: 'short' | 'medium' | 'long'; voiceMs?: number | null } = {}) {
  let clock = 0;
  let nextId = 1;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const spoken: { text: string; rate: number; at: number }[] = [];
  const log: string[] = [];
  let pendingDone: { fn: () => void; at: number } | null = null;
  let stops = 0;
  const states: PlayerState[] = [];
  const voiceMs = opts.voiceMs === undefined ? 2000 : opts.voiceMs;
  const player = createPlayer(
    { sentences, level: opts.level ?? 'B1', pause: opts.pause ?? 'medium' },
    {
      speak(text, rate, onDone) {
        spoken.push({ text, rate, at: clock });
        log.push(`speak ${rate}`);
        pendingDone = voiceMs === null ? null : { fn: onDone, at: clock + voiceMs };
      },
      stop() {
        stops++;
        pendingDone = null;
      },
      setTimer(fn, ms) {
        const id = nextId++;
        timers.set(id, { at: clock + ms, fn });
        return id;
      },
      clearTimer(id) {
        timers.delete(id as number);
      },
      now: () => clock,
      onChange: (s) => states.push(s),
      onGapStart: (phase) => log.push(`gap ${phase}`),
      onFinish: (n) => log.push(`finish ${n}`),
    },
  );
  // Moves the clock forward, firing the voice's end and timers in time order.
  function advance(ms: number) {
    const end = clock + ms;
    for (;;) {
      const due = [...timers.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      const voice = pendingDone && pendingDone.at <= end ? pendingDone : null;
      if (!due && !voice) break;
      if (voice && (!due || voice.at <= due[1].at)) {
        clock = voice.at;
        pendingDone = null;
        voice.fn();
      } else {
        clock = due![1].at;
        timers.delete(due![0]);
        due![1].fn();
      }
    }
    clock = end;
  }
  return { player, advance, spoken, log, states, get stops() { return stops; }, timers, get clock() { return clock; } };
}

const three = SHADOW_SENTENCES.filter((s) => s.level === 'B1').slice(0, 3);

test('each sentence plays slow, pauses, plays at normal speed, pauses, then moves on', () => {
  const h = harness(three);
  h.player.start();
  assert.equal(h.player.state.phase, 'slow');
  assert.equal(h.player.state.status, 'playing');
  assert.deepEqual(h.spoken[0], { text: three[0].fr, rate: LEVEL_SPECS.B1.slowRate, at: 0 });

  h.advance(2000); // slow play ends after 2 s
  assert.equal(h.player.state.phase, 'gapSlow');
  const gap1 = gapMs(2000, 'medium');
  assert.deepEqual(h.player.state.gap, { ms: gap1, endsAt: 2000 + gap1 });

  h.advance(gap1 - 1);
  assert.equal(h.player.state.phase, 'gapSlow', 'still waiting for you to repeat');
  h.advance(1);
  assert.equal(h.player.state.phase, 'normal');
  assert.equal(h.spoken[1].rate, LEVEL_SPECS.B1.normalRate);
  assert.equal(h.spoken[1].text, three[0].fr);

  h.advance(2000);
  assert.equal(h.player.state.phase, 'gapNormal');
  h.advance(gapMs(2000, 'medium'));
  assert.equal(h.player.state.index, 1);
  assert.equal(h.player.state.phase, 'slow');
  assert.equal(h.player.state.completed, 1);
  assert.equal(h.spoken[2].text, three[1].fr);
  assert.deepEqual(h.log.slice(0, 5), [`speak ${LEVEL_SPECS.B1.slowRate}`, 'gap gapSlow', `speak ${LEVEL_SPECS.B1.normalRate}`, 'gap gapNormal', `speak ${LEVEL_SPECS.B1.slowRate}`]);
});

test('the pause is sized on how long the voice really took', () => {
  const quick = harness(three, { voiceMs: 1500 });
  quick.player.start();
  quick.advance(1500);
  const slow = harness(three, { voiceMs: 6000 });
  slow.player.start();
  slow.advance(6000);
  assert.ok(slow.player.state.gap!.ms > quick.player.state.gap!.ms);
  assert.equal(slow.player.state.gap!.ms, gapMs(6000, 'medium'));
});

test('a longer pause setting gives more time to repeat', () => {
  const short = harness(three, { pause: 'short' });
  short.player.start();
  short.advance(3000);
  const long = harness(three, { pause: 'long' });
  long.player.start();
  long.advance(3000);
  assert.ok(long.player.state.gap!.ms > short.player.state.gap!.ms);
});

test('the whole series plays by itself to the end', () => {
  const h = harness(three);
  h.player.start();
  h.advance(5 * 60_000);
  assert.equal(h.player.state.status, 'finished');
  assert.equal(h.player.state.completed, 3);
  assert.equal(h.spoken.length, 6);
  assert.equal(h.log.at(-1), 'finish 3');
  assert.equal(h.timers.size, 0, 'no timer left running');
});

test('levels play at their own speeds', () => {
  for (const level of SHADOW_LEVELS) {
    const sentences = SHADOW_SENTENCES.filter((s) => s.level === level).slice(0, 1);
    const h = harness(sentences, { level });
    h.player.start();
    h.advance(60_000);
    assert.deepEqual(h.spoken.map((s) => s.rate), [LEVEL_SPECS[level].slowRate, LEVEL_SPECS[level].normalRate]);
  }
});

test('pausing during a pause resumes with the time that was left', () => {
  const h = harness(three);
  h.player.start();
  h.advance(2000);
  const gap = h.player.state.gap!.ms;
  h.advance(1000);
  h.player.pause();
  assert.equal(h.player.state.status, 'paused');
  h.advance(60_000); // nothing happens while paused
  assert.equal(h.player.state.phase, 'gapSlow');
  assert.equal(h.spoken.length, 1);
  h.player.resume();
  assert.equal(h.player.state.status, 'playing');
  assert.equal(h.player.state.gap!.endsAt - h.clock, gap - 1000);
  assert.equal(h.log.filter((l) => l === 'gap gapSlow').length, 1, 'no second « your turn » tap on resume');
  h.advance(gap - 1000);
  assert.equal(h.player.state.phase, 'normal');
});

test('pausing during a play stops the voice and replays that speed on resume', () => {
  const h = harness(three);
  h.player.start();
  h.advance(1000);
  h.player.toggle();
  assert.ok(h.stops > 0);
  assert.equal(h.player.state.status, 'paused');
  h.advance(10_000);
  assert.equal(h.player.state.phase, 'slow', 'the stopped play does not end the phase');
  h.player.toggle();
  assert.equal(h.spoken.length, 2);
  assert.equal(h.spoken[1].rate, LEVEL_SPECS.B1.slowRate);
});

test('replay starts the sentence over from the slow play; next and previous move between sentences', () => {
  const h = harness(three);
  h.player.start();
  h.advance(2000 + gapMs(2000, 'medium') + 500); // in the normal play
  h.player.replay();
  assert.equal(h.player.state.phase, 'slow');
  assert.equal(h.player.state.index, 0);
  assert.equal(h.spoken.at(-1)!.rate, LEVEL_SPECS.B1.slowRate);

  h.player.next();
  assert.equal(h.player.state.index, 1);
  assert.equal(h.player.state.completed, 0, 'skipping does not count as practised');
  h.player.previous();
  assert.equal(h.player.state.index, 0);
  h.player.previous();
  assert.equal(h.player.state.index, 0, 'no sentence before the first');

  h.player.next();
  h.player.next();
  h.player.next();
  assert.equal(h.player.state.status, 'finished');
  assert.equal(h.log.at(-1), 'finish 0');
});

test('a late end from a stopped play is ignored', () => {
  let done!: () => void;
  const timers: (() => void)[] = [];
  const player = createPlayer(
    { sentences: three, level: 'B1', pause: 'medium' },
    {
      speak: (_t, _r, onDone) => { done = onDone; },
      stop() {},
      setTimer: (fn) => timers.push(fn),
      clearTimer() {},
      now: () => 0,
      onChange() {},
    },
  );
  player.start();
  const stale = done;
  player.next();
  stale();
  assert.equal(player.state.index, 1);
  assert.equal(player.state.phase, 'slow');
});

test('if the voice never reports its end, the player carries on after a while', () => {
  const h = harness(three, { voiceMs: null });
  h.player.start();
  h.advance(watchdogMs(three[0].fr, LEVEL_SPECS.B1.slowRate) - 1);
  assert.equal(h.player.state.phase, 'slow');
  h.advance(1);
  assert.equal(h.player.state.phase, 'gapSlow');
  assert.equal(h.player.state.gap!.ms, gapMs(estimateSpeechMs(three[0].fr, LEVEL_SPECS.B1.slowRate), 'medium'), 'the wait is not taken as the sentence length');
});

test('a play that ends at once (no voice) uses the estimated length for the pause', () => {
  const h = harness(three, { voiceMs: 0 });
  h.player.start();
  h.advance(0);
  assert.equal(h.player.state.phase, 'gapSlow');
  assert.equal(h.player.state.gap!.ms, gapMs(estimateSpeechMs(three[0].fr, LEVEL_SPECS.B1.slowRate), 'medium'));
});

test('dispose stops everything', () => {
  const h = harness(three);
  h.player.start();
  h.advance(2500);
  h.player.dispose();
  assert.equal(h.timers.size, 0);
  const before = h.spoken.length;
  h.advance(60_000);
  assert.equal(h.spoken.length, before);
});
