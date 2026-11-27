import { BASICS } from './basics.ts';
import { SENTENCE_RULES } from './sentences.ts';
import { TOPICS, type GrammarRule } from './types.ts';
import { VERB_RULES } from './verbs.ts';

export { TOPICS, type GrammarRule, type GrammarTopic } from './types.ts';

// Every rule card, in topic order.
export const GRAMMAR: GrammarRule[] = [...BASICS, ...VERB_RULES, ...SENTENCE_RULES].sort(
  (a, b) => TOPICS.indexOf(a.topic) - TOPICS.indexOf(b.topic),
);

export const RULE_BY_ID = new Map(GRAMMAR.map((r) => [r.id, r]));

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`]/g, "'");

// Rules matching a search, best first: a title or keyword hit counts more than a hit in the text.
// Every word of the search has to appear somewhere in the card. An empty search returns nothing.
export function searchRules(query: string, rules: readonly GrammarRule[] = GRAMMAR): GrammarRule[] {
  const words = fold(query).split(/[\s,;:!?.«»"()]+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  const scored = rules.flatMap((r) => {
    const title = fold(r.title);
    const keys = r.keywords.map(fold);
    const text = fold([r.topic, r.rule, r.pitfall ?? '', ...r.examples.flatMap((e) => [e.fr, e.en])].join(' '));
    let score = 0;
    for (const w of words) {
      const inHead = title.includes(w) || keys.some((k) => k.includes(w));
      if (inHead) score += 3;
      else if (text.includes(w)) score += 1;
      else return [];
    }
    return [{ r, score }];
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.r);
}
