import type { Skill } from './db';

// Time with no touch or typing after which the study timer stops counting.
// Long enough to read a text or listen to a clip, short enough that a forgotten open screen doesn't count.
export const IDLE_MS = 3 * 60_000;

// Daily study goal in minutes, matching the ~60-minute plan on the Today tab.
export const DAILY_GOAL_MIN = 60;

// A word is "mastered" once FSRS expects you to remember it for three weeks or more.
export const MASTERED_DAYS = 21;

// ts-fsrs card states.
const STATE_REVIEW = 2;

// How much of the time between two timer ticks counts as study: all of it up to IDLE_MS after the last activity.
export function activeMs(prevTick: number, now: number, lastActive: number, idleMs = IDLE_MS) {
  const idleFrom = lastActive + idleMs;
  return Math.max(0, Math.min(now, idleFrom) - prevTick);
}

export function dayKey(ms: number) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(ms: number, n: number) {
  const d = new Date(ms);
  d.setDate(d.getDate() + n);
  return d.getTime();
}

export type Session = { skill: Skill; started_at: number; seconds: number };
export type Day = { key: string; date: number; minutes: number };

// The last n days, oldest first, with today last. Days with no study have 0 minutes.
export function lastDays(sessions: Session[], now: number, n = 7): Day[] {
  const byDay = new Map<string, number>();
  for (const s of sessions) byDay.set(dayKey(s.started_at), (byDay.get(dayKey(s.started_at)) ?? 0) + s.seconds);
  return Array.from({ length: n }, (_, i) => {
    const date = addDays(now, i - n + 1);
    return { key: dayKey(date), date, minutes: Math.round((byDay.get(dayKey(date)) ?? 0) / 60) };
  });
}

// Consecutive days with some study, counting back from today. If today has nothing yet, the streak
// is still alive and counts from yesterday, so it doesn't read 0 every morning.
export function streak(activeDays: Set<string>, now: number) {
  let day = activeDays.has(dayKey(now)) ? now : addDays(now, -1);
  let n = 0;
  while (activeDays.has(dayKey(day))) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export type WordTiers = { unseen: number; learning: number; known: number; mastered: number };

export function wordTiers(cards: { reps: number; state: number; stability: number }[]): WordTiers {
  const t: WordTiers = { unseen: 0, learning: 0, known: 0, mastered: 0 };
  for (const c of cards) {
    if (c.reps === 0) t.unseen++;
    else if (c.state !== STATE_REVIEW) t.learning++;
    else if (c.stability >= MASTERED_DAYS) t.mastered++;
    else t.known++;
  }
  return t;
}

// Total minutes per skill, in a fixed order so the chart rows never move.
export const SKILL_ORDER: Skill[] = ['listening', 'reading', 'writing', 'speaking', 'vocab'];

export function minutesBySkill(sessions: Session[]): { skill: Skill; minutes: number }[] {
  const secs = new Map<Skill, number>();
  for (const s of sessions) secs.set(s.skill, (secs.get(s.skill) ?? 0) + s.seconds);
  return SKILL_ORDER.map((skill) => ({ skill, minutes: Math.round((secs.get(skill) ?? 0) / 60) }));
}

export function formatMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}
