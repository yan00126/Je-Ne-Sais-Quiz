import type { VocabItem } from '../vocab.ts';

// Topic lists are written one word per line: "id | French | English | example".
// The id is the number after "v". Only ever add lines with new ids: an id's review history follows it,
// so reusing or renumbering one would give a word someone else's progress.
export function words(table: string): VocabItem[] {
  return table
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, fr, en, example, ...rest] = line.split(' | ').map((s) => s.trim());
      if (!/^\d+$/.test(id) || !fr || !en || !example || rest.length) throw new Error(`Bad vocab line: ${line}`);
      return { id: `v${id}`, fr, en, example };
    });
}
