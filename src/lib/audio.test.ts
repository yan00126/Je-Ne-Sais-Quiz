import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function setup() {
  const spoken: string[] = [];
  const timers = new Set<() => void>();
  const listeners = new Set<(status: object) => void>();
  const seeks: (() => void)[] = [];
  let plays = 0;
  const player = {
    isLoaded: false,
    pause() {},
    replace() {},
    play() { plays++; },
    seekTo() { return new Promise<void>((resolve) => seeks.push(resolve)); },
    addListener(_event: string, listener: (status: object) => void) {
      listeners.add(listener);
      return { remove: () => listeners.delete(listener) };
    },
  };
  const exports: { play?: (text: string, url?: string) => void } = {};
  const source = readFileSync(new URL('./audio.ts', import.meta.url), 'utf8');
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports,
    require: (name: string) => {
      if (name === 'expo-audio') return { createAudioPlayer: () => player };
      if (name === 'expo-speech') return { stop() {} };
      if (name === './speech') return { speak: (text: string) => spoken.push(text) };
      throw new Error(`Unexpected import: ${name}`);
    },
    setTimeout: (fn: () => void) => { timers.add(fn); return fn; },
    clearTimeout: (fn: () => void) => timers.delete(fn),
  });
  return {
    play: exports.play!, spoken, timers, listeners, player, seeks,
    plays: () => plays,
    emit: (status: object) => [...listeners].forEach((fn) => fn(status)),
    timeout: () => [...timers].forEach((fn) => { timers.delete(fn); fn(); }),
  };
}

test('TTS invalidates pending recording callbacks and timers', () => {
  const a = setup();
  a.play('ancien', 'old.mp3');
  const stale = [...a.listeners][0];
  a.play('nouveau');
  assert.equal(a.listeners.size, 0);
  assert.equal(a.timers.size, 0);
  stale({ isLoaded: true });
  a.timeout();
  assert.deepEqual(a.spoken, ['nouveau']);
  assert.equal(a.plays(), 0);
});

test('a new recording cancels the previous load and only plays the current one', () => {
  const a = setup();
  a.play('ancien', 'old.mp3');
  const stale = [...a.listeners][0];
  a.play('nouveau', 'new.mp3');
  assert.equal(a.listeners.size, 1);
  assert.equal(a.timers.size, 1);
  stale({ error: 'offline' });
  a.emit({ isLoaded: true });
  assert.equal(a.plays(), 1);
  assert.equal(a.timers.size, 0);
  a.emit({ didJustFinish: true });
  assert.equal(a.listeners.size, 0);
  assert.deepEqual(a.spoken, []);
});

test('failed and timed out loads fall back once and remove their listeners', () => {
  for (const failure of ['error', 'timeout']) {
    const a = setup();
    a.play('bonjour', 'missing.mp3');
    const stale = [...a.listeners][0];
    if (failure === 'error') a.emit({ error: 'offline' });
    else a.timeout();
    stale({ isLoaded: true });
    a.timeout();
    assert.deepEqual(a.spoken, ['bonjour']);
    assert.equal(a.plays(), 0);
    assert.equal(a.listeners.size, 0);
    assert.equal(a.timers.size, 0);
  }
});

test('a cached recording cannot start after a newer play call', async () => {
  const a = setup();
  a.play('ancien', 'old.mp3');
  a.emit({ isLoaded: true });
  a.player.isLoaded = true;
  a.play('ancien', 'old.mp3');
  a.play('nouveau');
  a.seeks[0]();
  await Promise.resolve();
  assert.equal(a.plays(), 1);
  assert.deepEqual(a.spoken, ['nouveau']);
});

test('TTS without a recording creates no listeners or timers', () => {
  const a = setup();
  a.play('bonjour');
  assert.deepEqual(a.spoken, ['bonjour']);
  assert.equal(a.listeners.size, 0);
  assert.equal(a.timers.size, 0);
});
