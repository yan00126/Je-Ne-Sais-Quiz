import { State } from 'ts-fsrs';

type QueuedCard = { id: string; due: number; state: number };

export function mergeStudyQueue<T extends QueuedCard>(previous: readonly T[], fresh: readonly T[], now: number): T[] {
  const merged = new Map(fresh.map((card) => [card.id, card]));
  for (const card of previous) {
    if (card.due > now && (card.state === State.Learning || card.state === State.Relearning) && !merged.has(card.id)) {
      merged.set(card.id, card);
    }
  }
  return [...merged.values()];
}

export function studyQueue<T extends QueuedCard>(queue: readonly T[], now: number) {
  const card = queue.find((item) => item.due <= now);
  const nextDue = queue.length ? Math.min(...queue.map((item) => item.due)) : null;
  return { card, nextDue };
}

export function afterReview<T extends QueuedCard>(queue: readonly T[], next: T): T[] {
  const rest = queue.filter((item) => item.id !== next.id);
  return next.state === State.Learning || next.state === State.Relearning ? [...rest, next] : rest;
}
