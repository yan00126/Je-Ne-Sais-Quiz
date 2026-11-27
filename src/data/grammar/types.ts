// A grammar rule card. Written for this app (not copied from a published grammar), so it can be shipped and
// quoted freely. Ids are stable: mistakes and, later, AI answers cite a rule by its id ("G-SUBJ-01").
export type GrammarRule = {
  id: string;
  topic: GrammarTopic;
  level: 'A2' | 'B1' | 'B2';
  title: string;
  // The rule in one to three short sentences.
  rule: string;
  examples: { fr: string; en: string }[];
  // The usual mistake, when there is one worth naming.
  pitfall?: string;
  // Words a question about this rule is likely to contain: used to find the rule for a question.
  keywords: string[];
};

export const TOPICS = [
  'Noms et articles',
  'Accords',
  'Pronoms',
  'Le passé',
  'Futur et conditionnel',
  'Subjonctif',
  'Prépositions',
  'Négation et questions',
  'Relatifs',
  'Connecteurs',
  'Phrases complexes',
  'Orthographe',
] as const;
export type GrammarTopic = (typeof TOPICS)[number];
