import type { Href } from 'expo-router';
import type { Skill } from './db';

export type Step = {
  skill: Skill;
  title: string;
  detail: string;
  minutes: number;
  target: number; // how many counted attempts finish the step (vocab: the review queue must be empty)
  href: Href;
};

// Rules for when an attempt is real work and counts toward the daily plan.
export const SPEAKING_MIN_SHARE = 0.6; // recorded at least 60 % of the task's time limit
export const writingCounts = (words: number, minWords: number) => words >= minWords;
export const speakingCounts = (seconds: number, limit: number) => seconds >= limit * SPEAKING_MIN_SHARE;

// About an hour a day. Vocabulary, listening and reading every day; writing and speaking
// alternate, so over a week all four TCF skills get roughly equal time.
export function todaysPlan(date: Date): Step[] {
  const writingDay = date.getDate() % 2 === 0;
  return [
    { skill: 'vocab', title: 'Vocabulaire', detail: 'Toutes les cartes du jour', minutes: 10, target: 1, href: '/cards' },
    { skill: 'listening', title: 'Compréhension orale', detail: '3 documents audio', minutes: 12, target: 3, href: '/practice/listening' },
    { skill: 'reading', title: 'Compréhension écrite', detail: '3 textes', minutes: 18, target: 3, href: '/practice/reading' },
    writingDay
      ? { skill: 'writing', title: 'Expression écrite', detail: '1 tâche, nombre de mots minimum atteint', minutes: 25, target: 1, href: '/practice/writing' }
      : { skill: 'speaking', title: 'Expression orale', detail: '3 réponses, au moins 60 % du temps chacune', minutes: 20, target: 3, href: '/practice/speaking' },
  ];
}

// vocabLeft = cards still in today's review queue.
export function stepProgress(step: Step, todayCounts: Partial<Record<Skill, number>>, vocabLeft: number) {
  if (step.skill === 'vocab') return { done: vocabLeft === 0, label: vocabLeft === 0 ? 'terminé' : `${vocabLeft} carte(s) restante(s)` };
  const n = Math.min(todayCounts[step.skill] ?? 0, step.target);
  return { done: n >= step.target, label: `${n}/${step.target}` };
}
