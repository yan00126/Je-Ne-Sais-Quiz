import { createEmptyCard, fsrs, Rating, State, type Card, type Grade } from 'ts-fsrs';

export { Rating, State };
export type { Card, Grade };

// Card as stored in SQLite: dates as epoch milliseconds.
export type CardRow = {
  id: string;
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review: number | null;
};

const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: true });

export function newCardRow(id: string, now: Date): CardRow {
  return toRow(id, createEmptyCard(now));
}

export function toCard(row: CardRow): Card {
  return {
    due: new Date(row.due),
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsed_days,
    scheduled_days: row.scheduled_days,
    learning_steps: row.learning_steps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state as State,
    last_review: row.last_review == null ? undefined : new Date(row.last_review),
  };
}

export function toRow(id: string, card: Card): CardRow {
  return {
    id,
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? card.last_review.getTime() : null,
  };
}

export function review(row: CardRow, grade: Grade, now: Date): CardRow {
  return toRow(row.id, scheduler.next(toCard(row), now, grade).card);
}

// Human-readable time until the card comes back, shown on the grade buttons.
export function intervalLabel(row: CardRow, grade: Grade, now: Date): string {
  const next = scheduler.next(toCard(row), now, grade).card.due.getTime();
  const minutes = Math.max(1, Math.round((next - now.getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 31) return `${days} j`;
  return `${Math.round(days / 30)} mois`;
}
