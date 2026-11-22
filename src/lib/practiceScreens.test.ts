import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { WRITING_TASKS } from '../data/prompts.ts';
import * as answer from './answer.ts';
import * as queue from './cardQueue.ts';
import * as plan from './plan.ts';
import * as srs from './srs.ts';

type Element = { type: string | Function; props: Record<string, any> };

function screen(path: string, database: Record<string, Function> = {}) {
  const values: any[] = [];
  const dependencies: unknown[][] = [];
  let cursor = 0;
  let effects: (() => void)[] = [];
  let tree: Element;
  const exports: { default?: () => Element } = {};
  const db = {
    pickNextItem: async (_db: object, _skill: string, items: unknown[]) => items[0],
    saveWriting: async () => {}, saveReview: async () => {}, logAttempt: async () => {},
    getStudyQueue: async () => [], ...database,
  };
  const stateHook = (initial: any) => {
    const i = cursor++;
    if (!(i in values)) values[i] = typeof initial === 'function' ? initial() : initial;
    return [values[i], (next: any) => { values[i] = typeof next === 'function' ? next(values[i]) : next; }];
  };
  const effectHook = (effect: () => void, deps: unknown[]) => {
    const i = cursor++;
    if (!dependencies[i] || deps.some((value, j) => !Object.is(value, dependencies[i][j]))) {
      dependencies[i] = deps;
      effects.push(effect);
    }
  };
  const jsx = (type: Element['type'], props: Element['props']) => ({ type, props });
  runInNewContext(ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, {
    exports, setInterval: () => 0, clearInterval() {}, setTimeout: () => 0,
    require: (name: string) => {
      switch (name) {
        case 'react/jsx-runtime': return { jsx, jsxs: jsx, Fragment: 'Fragment' };
        case 'react': return { useState: stateHook, useEffect: effectHook, useRef: (initial: any) => stateHook(() => ({ current: initial }))[0], useCallback: (fn: Function) => fn, useMemo: (fn: Function) => fn() };
        case 'react-native': return { View: 'View', Text: 'Text', TextInput: 'TextInput', Pressable: 'Pressable' };
        case 'expo-router': return { useFocusEffect: (effect: () => void) => effectHook(effect, []) };
        case 'expo-sqlite': return { useSQLiteContext: () => db };
        case '@expo/vector-icons/Ionicons': return { default: 'Ionicons' };
        case '../../components/ui': return { Screen: 'Screen', Body: 'Body', Button: 'Button', Card: 'Card', H1: 'H1', H2: 'H2' };
        case '../../components/ResultBanner': return {};
        case '../../theme/ThemeProvider': return { makeStyles: () => () => ({}), useTheme: () => ({ colors: {} }) };
        case '../../data/prompts': return { WRITING_TASKS };
        case '../../data/recordings': return { REAL_EXAMPLES: {}, WORD_AUDIO: {} };
        case '../../data/vocab': return { STARTER_VOCAB: [], TOPICS: {} };
        case '../../lib/distractors': return { choiceOptions: () => [], makePool: () => ({}) };
        case '../../lib/db': return db;
        case '../../lib/useStudyTimer': return { useStudyTimer() {} };
        case '../../lib/activity': return { markActive() {} };
        case '../../lib/audio': return { play() {} };
        case '../../lib/answer': return answer;
        case '../../lib/cardQueue': return queue;
        case '../../lib/plan': return plan;
        case '../../lib/srs': return srs;
        default: throw new Error(`Unexpected import: ${name}`);
      }
    },
  });
  const render = () => {
    cursor = 0;
    effects = [];
    tree = exports.default!();
    effects.forEach((effect) => effect());
  };
  const elements = (value: any = tree): Element[] => {
    if (Array.isArray(value)) return value.flatMap(elements);
    if (!value || typeof value !== 'object') return [];
    return [value, ...elements(value.props?.children ?? null)];
  };
  const text = (value: any = tree): string => {
    if (Array.isArray(value)) return value.map(text).join('');
    if (value === null || value === undefined || typeof value === 'boolean') return '';
    return typeof value === 'object' ? text(value.props?.children ?? null) : String(value);
  };
  const button = (title: string) => {
    const element = elements().find((e) => e.type === 'Button' && e.props.title === title);
    assert.ok(element, `Missing button: ${title}`);
    return element.props;
  };
  const settle = async () => { await new Promise(setImmediate); render(); };
  render();
  return { render, settle, elements, text, button };
}

const cardsPath = '../app/(tabs)/cards.tsx';
const writingPath = '../app/practice/writing.tsx';
const card = { ...srs.newCardRow('test', new Date(0)), fr: 'un logement', en: 'housing', example: 'Un logement.' };
const grading = (s: ReturnType<typeof screen>) => {
  const exercise = s.elements().find((e) => e.props.onGrade);
  assert.ok(exercise);
  return exercise.props;
};

test('card grading ignores double taps while saving and then waits for FSRS due time', async () => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  let saves = 0;
  let logs = 0;
  const s = screen(cardsPath, {
    getStudyQueue: async () => [card],
    saveReview: async () => { saves++; await pending; },
    logAttempt: async () => { logs++; },
  });
  await s.settle();
  assert.match(s.text(), /1 carte restante/);
  const grade = grading(s).onGrade;
  const first = grade(srs.Rating.Good);
  const second = grade(srs.Rating.Good);
  s.render();
  assert.equal(grading(s).saving, true);
  assert.equal(saves, 1);
  assert.equal(logs, 0);
  release();
  await Promise.all([first, second]);
  await s.settle();
  assert.equal(logs, 1);
  assert.match(s.text(), /Prochaine carte dans/);
});

test('failed card saves release the guard and keep the card available to retry', async () => {
  let saves = 0;
  const s = screen(cardsPath, {
    getStudyQueue: async () => [card],
    saveReview: async () => { if (++saves === 1) throw new Error('offline'); },
  });
  await s.settle();
  await grading(s).onGrade(srs.Rating.Good);
  await s.settle();
  assert.equal(grading(s).saving, false);
  assert.match(s.text(), /Impossible d’enregistrer/);
  await grading(s).onGrade(srs.Rating.Good);
  await s.settle();
  assert.equal(saves, 2);
  assert.match(s.text(), /Prochaine carte dans/);
});

test('empty card queues show a finished state and load failures are visible', async () => {
  const empty = screen(cardsPath);
  await empty.settle();
  assert.match(empty.text(), /C'est tout pour aujourd'hui/);
  const failure = screen(cardsPath, { getStudyQueue: async () => { throw new Error('offline'); } });
  await failure.settle();
  assert.match(failure.text(), /Impossible de charger les cartes/);
});

async function startWriting(database: Record<string, Function> = {}) {
  const s = screen(writingPath, database);
  await s.settle();
  s.button('Commencer (10 min)').onPress();
  s.render();
  return s;
}

function input(s: ReturnType<typeof screen>) {
  return s.elements().find((e) => e.type === 'TextInput')!.props;
}

test('writing keeps the current task and requires confirmation before discarding a draft', async () => {
  const s = await startWriting();
  assert.match(s.text(), /0 mot/);
  input(s).onChangeText('Mon brouillon');
  s.render();
  s.button('Tâche 1').onPress();
  await s.settle();
  assert.equal(input(s).value, 'Mon brouillon');
  assert.match(s.text(), /2 mots/);
  s.button('Tâche 2').onPress();
  s.render();
  assert.ok(s.button('Changer de tâche'));
  s.button('Garder mon texte').onPress();
  s.render();
  assert.equal(input(s).value, 'Mon brouillon');
  s.button('Tâche 2').onPress();
  s.render();
  await s.button('Changer de tâche').onPress();
  await s.settle();
  assert.ok(s.button('Commencer (20 min)'));
  s.button('Commencer (20 min)').onPress();
  s.render();
  assert.equal(input(s).value, '');
});

test('empty writing disables saving and can switch without confirmation', async () => {
  const s = await startWriting();
  assert.equal(s.button('Terminer et enregistrer').disabled, true);
  s.button('Tâche 2').onPress();
  await s.settle();
  assert.ok(s.button('Commencer (20 min)'));
  assert.equal(s.elements().some((e) => e.props.title === 'Changer de tâche'), false);
});

test('writing saves and logs once for concurrent taps, disabling editing and switching', async () => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  let saves = 0;
  let logs = 0;
  const s = await startWriting({
    saveWriting: async () => { saves++; await pending; },
    logAttempt: async () => { logs++; },
  });
  input(s).onChangeText('Bonjour');
  s.render();
  assert.match(s.text(), /1 mot /);
  const save = s.button('Terminer et enregistrer').onPress;
  const first = save();
  const second = save();
  s.render();
  assert.equal(saves, 1);
  assert.equal(s.button('Enregistrement…').disabled, true);
  assert.equal(s.button('Tâche 2').disabled, true);
  assert.equal(input(s).editable, false);
  release();
  await Promise.all([first, second]);
  await s.settle();
  assert.equal(logs, 1);
  assert.match(s.text(), /Texte enregistré/);
  s.button('Tâche 2').onPress();
  await s.settle();
  assert.ok(s.button('Commencer (20 min)'));
});

test('writing save failures keep the draft and allow retry', async () => {
  let saves = 0;
  let logs = 0;
  const s = await startWriting({
    saveWriting: async () => { if (++saves === 1) throw new Error('offline'); },
    logAttempt: async () => { logs++; },
  });
  input(s).onChangeText('Bonjour');
  s.render();
  await s.button('Terminer et enregistrer').onPress();
  await s.settle();
  assert.match(s.text(), /Impossible d’enregistrer le texte/);
  assert.equal(input(s).value, 'Bonjour');
  assert.equal(s.button('Terminer et enregistrer').disabled, false);
  await s.button('Terminer et enregistrer').onPress();
  await s.settle();
  assert.equal(saves, 2);
  assert.equal(logs, 1);
});

test('a failed task switch leaves the unsaved draft intact', async () => {
  const s = await startWriting({
    pickNextItem: async (_db: object, _skill: string, items: typeof WRITING_TASKS) => {
      if (items[0].task === 2) throw new Error('offline');
      return items[0];
    },
  });
  input(s).onChangeText('Mon brouillon');
  s.render();
  s.button('Tâche 2').onPress();
  s.render();
  await s.button('Changer de tâche').onPress();
  await s.settle();
  assert.match(s.text(), /Impossible de charger la tâche/);
  s.button('Garder mon texte').onPress();
  s.render();
  assert.equal(input(s).value, 'Mon brouillon');
  assert.equal(input(s).editable, true);
});
