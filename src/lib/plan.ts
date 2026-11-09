import type { Href } from 'expo-router';
import type { Skill, StepId } from './db';

export type Step = {
  id: StepId;
  skill: Skill;
  title: string;
  detail: string;
  short: string; // a few words for the Today tiles
  minutes: number;
  target: number; // how many counted attempts finish the step (vocab: the review queue must be empty)
  href: Href;
};

// Rules for when an attempt is real work and counts toward the daily plan.
export const SPEAKING_MIN_SHARE = 0.6; // recorded at least 60 % of the task's time limit
export const writingCounts = (words: number, minWords: number) => words >= minWords;
export const speakingCounts = (seconds: number, limit: number) => seconds >= limit * SPEAKING_MIN_SHARE;

// About an hour a day. Vocabulary, listening, reading and a short shadowing session every day;
// writing and speaking alternate, so over a week all four TCF skills get roughly equal time.
export function todaysPlan(date: Date): Step[] {
  const writingDay = date.getDate() % 2 === 0;
  return [
    { id: 'vocab', skill: 'vocab', title: 'Vocabulaire', detail: 'Toutes les cartes du jour', short: 'Cartes du jour', minutes: 10, target: 1, href: '/cards' },
    { id: 'listening', skill: 'listening', title: 'Compréhension orale', detail: '3 documents audio', short: '3 audios', minutes: 12, target: 3, href: '/practice/listening' },
    { id: 'reading', skill: 'reading', title: 'Compréhension écrite', detail: '3 textes', short: '3 textes', minutes: 18, target: 3, href: '/practice/reading' },
    { id: 'shadowing', skill: 'speaking', title: 'Répéter après le modèle', detail: '1 dialogue : écoutez chaque phrase et répétez-la', short: '1 dialogue', minutes: 5, target: 1, href: '/practice/shadowing' },
    writingDay
      ? { id: 'writing', skill: 'writing', title: 'Expression écrite', detail: '1 tâche, nombre de mots minimum atteint', short: '1 tâche', minutes: 25, target: 1, href: '/practice/writing' }
      : { id: 'speaking', skill: 'speaking', title: 'Expression orale', detail: '3 séances : tâche enregistrée (60 % du temps au moins) ou dialogue guidé', short: '3 séances', minutes: 20, target: 3, href: '/practice/speaking' },
  ];
}

// vocabLeft = cards still in today's review queue.
export function stepProgress(step: Step, todayCounts: Partial<Record<StepId, number>>, vocabLeft: number) {
  if (step.id === 'vocab') return { done: vocabLeft === 0, label: vocabLeft === 0 ? 'terminé' : `${vocabLeft} carte(s) restante(s)` };
  const n = Math.min(todayCounts[step.id] ?? 0, step.target);
  return { done: n >= step.target, label: `${n}/${step.target}` };
}
