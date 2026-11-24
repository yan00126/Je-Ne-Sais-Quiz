// Sentences for shadowing by level, on everyday and TCF Canada topics (work, housing, health,
// transport, immigration, environment, society), 150 per level, each with an English translation.
// The length and grammar of each level are described at the top of its file.
// Ids come from the position in the file (a1-001…), so never reorder or remove a sentence:
// the app remembers which sentences you practised by id. Add new ones at the end.

import type { Sentence, ShadowLevel } from '../../lib/shadowing.ts';
import { A1 } from './a1.ts';
import { A2 } from './a2.ts';
import { B1 } from './b1.ts';
import { B2 } from './b2.ts';

const level = (lvl: ShadowLevel, rows: [string, string][]): Sentence[] =>
  rows.map(([fr, en], i) => ({ id: `${lvl.toLowerCase()}-${String(i + 1).padStart(3, '0')}`, level: lvl, fr, en }));

export const SHADOW_SENTENCES: Sentence[] = [...level('A1', A1), ...level('A2', A2), ...level('B1', B1), ...level('B2', B2)];
