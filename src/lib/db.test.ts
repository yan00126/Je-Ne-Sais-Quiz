import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import * as stats from './stats.ts';

test('weekly new words use local midnight six calendar days ago across DST', async () => {
  const previous = process.env.TZ;
  process.env.TZ = 'America/Toronto';
  try {
    for (const [month, day] of [[2, 10], [10, 3], [0, 3]] as const) {
      const now = new Date(2026, month, day, 15).getTime();
      const expected = new Date(2026, month, day - 6).getTime();
      const exports: { newWordsThisWeek?: (db: object) => Promise<number> } = {};
      class Clock extends Date {
        constructor() { super(now); }
        static now() { return now; }
      }
      runInNewContext(ts.transpileModule(readFileSync(new URL('./db.ts', import.meta.url), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      }).outputText, {
        exports, Date: Clock,
        require: (name: string) => {
          if (name === '../data/vocab') return { STARTER_VOCAB: [] };
          if (name === './srs' || name === './level') return {};
          if (name === './stats') return stats;
          throw new Error(`Unexpected import: ${name}`);
        },
      });
      const query = async (n: number | null) => {
        let cutoff: number | undefined;
        const result = await exports.newWordsThisWeek!({
          getFirstAsync: async (_sql: string, value: number) => { cutoff = value; return n === null ? null : { n }; },
        });
        assert.equal(cutoff, expected, new Date(now).toString());
        return result;
      };
      assert.equal(await query(3), 3);
      assert.equal(await query(0), 0);
      assert.equal(await query(null), 0);
      await assert.rejects(exports.newWordsThisWeek!({ getFirstAsync: async () => { throw new Error('read failed'); } }), /read failed/);
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
