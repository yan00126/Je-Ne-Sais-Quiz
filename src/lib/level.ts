// Adaptive level for comprehension practice. You start at A2 and only get documents of your
// current level. After WINDOW documents at a level, 80 % right or better moves you up; below
// 50 % moves you down. The level is replayed from the attempts history, so it needs no table.

export type Level = 'A2' | 'B1' | 'B2';
export const LEVELS: Level[] = ['A2', 'B1', 'B2'];

export const WINDOW = 5; // documents looked at before deciding
export const PROMOTE_AT = 0.8;
export const DEMOTE_BELOW = 0.5;

export type Attempt = { level: Level; score: number; total: number }; // oldest first

export type LevelState = {
  level: Level;
  recent: Attempt[]; // documents at the current level since the last change, newest last, at most WINDOW
  accuracy: number | null; // share right in `recent`, null when empty
};

export function accuracyOf(attempts: Attempt[]): number | null {
  const total = attempts.reduce((n, a) => n + a.total, 0);
  return total === 0 ? null : attempts.reduce((n, a) => n + a.score, 0) / total;
}

export function currentLevel(history: Attempt[]): LevelState {
  let i = 0;
  let recent: Attempt[] = [];
  for (const a of history) {
    // Documents of another level (from before this logic existed) don't count toward this one.
    if (a.level !== LEVELS[i]) continue;
    recent = [...recent, a].slice(-WINDOW);
    if (recent.length < WINDOW) continue;
    const acc = accuracyOf(recent)!;
    if (acc >= PROMOTE_AT && i < LEVELS.length - 1) {
      i++;
      recent = [];
    } else if (acc < DEMOTE_BELOW && i > 0) {
      i--;
      recent = [];
    }
  }
  return { level: LEVELS[i], recent, accuracy: accuracyOf(recent) };
}

export function nextLevel(level: Level): Level | null {
  return LEVELS[LEVELS.indexOf(level) + 1] ?? null;
}

// Practice help that fades as the level goes up. B2 is played once at normal speed, like the TCF.
export type Playback = { maxPlays: number; defaultRate: number; slowOption: boolean };

export function playbackFor(level: Level): Playback {
  if (level === 'A2') return { maxPlays: Infinity, defaultRate: 0.75, slowOption: true };
  if (level === 'B1') return { maxPlays: 2, defaultRate: 1, slowOption: true };
  return { maxPlays: 1, defaultRate: 1, slowOption: false };
}
