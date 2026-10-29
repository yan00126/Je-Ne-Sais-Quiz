import type { SQLiteDatabase } from 'expo-sqlite';
import { STARTER_VOCAB, type VocabItem } from '../data/vocab';
import { newCardRow, type CardRow } from './srs';

export const DB_NAME = 'jenesaisquiz.db';
export const NEW_CARDS_PER_DAY = 15;

export type Skill = 'vocab' | 'listening' | 'reading' | 'writing' | 'speaking';

export type ReviewCard = CardRow & Pick<VocabItem, 'fr' | 'en' | 'example'>;

// Runs on app start via SQLiteProvider's onInit. Bump user_version when adding a migration.
export async function migrate(db: SQLiteDatabase) {
  const { user_version } = (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? { user_version: 0 };
  if (user_version < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY NOT NULL,
        due INTEGER NOT NULL,
        stability REAL NOT NULL,
        difficulty REAL NOT NULL,
        elapsed_days INTEGER NOT NULL,
        scheduled_days INTEGER NOT NULL,
        learning_steps INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        lapses INTEGER NOT NULL,
        state INTEGER NOT NULL,
        last_review INTEGER,
        introduced_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill TEXT NOT NULL,
        item_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS writings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt_id TEXT NOT NULL,
        body TEXT NOT NULL,
        word_count INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
      PRAGMA user_version = 1;
    `);
  }
  await seedCards(db);
}

// Adds any starter words not yet in the deck, so new vocabulary ships with app updates.
async function seedCards(db: SQLiteDatabase) {
  const now = new Date();
  for (const item of STARTER_VOCAB) {
    const r = newCardRow(item.id, now);
    await db.runAsync(
      `INSERT OR IGNORE INTO cards (id, due, stability, difficulty, elapsed_days, scheduled_days, learning_steps, reps, lapses, state, last_review)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      r.id, r.due, r.stability, r.difficulty, r.elapsed_days, r.scheduled_days, r.learning_steps, r.reps, r.lapses, r.state, r.last_review,
    );
  }
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const VOCAB_BY_ID = new Map(STARTER_VOCAB.map((v) => [v.id, v]));

function withVocab(rows: CardRow[]): ReviewCard[] {
  return rows.flatMap((r) => {
    const v = VOCAB_BY_ID.get(r.id);
    return v ? [{ ...r, fr: v.fr, en: v.en, example: v.example }] : [];
  });
}

export async function newCardsLeftToday(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM cards WHERE introduced_at >= ?', startOfToday());
  return Math.max(0, NEW_CARDS_PER_DAY - (row?.n ?? 0));
}

// Cards to study now: everything due that has been seen before, plus today's allowance of new cards.
export async function getStudyQueue(db: SQLiteDatabase): Promise<ReviewCard[]> {
  const now = Date.now();
  const due = await db.getAllAsync<CardRow>('SELECT * FROM cards WHERE reps > 0 AND due <= ? ORDER BY due LIMIT 100', now);
  const fresh = await db.getAllAsync<CardRow>('SELECT * FROM cards WHERE reps = 0 ORDER BY id LIMIT ?', await newCardsLeftToday(db));
  return withVocab([...due, ...fresh]);
}

export async function saveReview(db: SQLiteDatabase, row: CardRow, wasNew: boolean) {
  await db.runAsync(
    `UPDATE cards SET due = ?, stability = ?, difficulty = ?, elapsed_days = ?, scheduled_days = ?, learning_steps = ?,
       reps = ?, lapses = ?, state = ?, last_review = ?, introduced_at = COALESCE(introduced_at, ?) WHERE id = ?`,
    row.due, row.stability, row.difficulty, row.elapsed_days, row.scheduled_days, row.learning_steps,
    row.reps, row.lapses, row.state, row.last_review, wasNew ? Date.now() : null, row.id,
  );
}

export async function logAttempt(db: SQLiteDatabase, skill: Skill, itemId: string, score: number, total: number) {
  await db.runAsync(
    'INSERT INTO attempts (skill, item_id, score, total, created_at) VALUES (?, ?, ?, ?, ?)',
    skill, itemId, score, total, Date.now(),
  );
}

export async function saveWriting(db: SQLiteDatabase, promptId: string, body: string, wordCount: number) {
  await db.runAsync(
    'INSERT INTO writings (prompt_id, body, word_count, created_at) VALUES (?, ?, ?, ?)',
    promptId, body, wordCount, Date.now(),
  );
}

export type SkillStats = { skill: Skill; attempts: number; score: number; total: number; today: number };

export async function getSkillStats(db: SQLiteDatabase): Promise<SkillStats[]> {
  return db.getAllAsync<SkillStats>(
    `SELECT skill, COUNT(*) AS attempts, SUM(score) AS score, SUM(total) AS total,
            SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS today
     FROM attempts GROUP BY skill`,
    startOfToday(),
  );
}

export async function getDeckStats(db: SQLiteDatabase) {
  return (
    (await db.getFirstAsync<{ learned: number; due: number; total: number }>(
      `SELECT SUM(CASE WHEN reps > 0 THEN 1 ELSE 0 END) AS learned,
              SUM(CASE WHEN reps > 0 AND due <= ? THEN 1 ELSE 0 END) AS due,
              COUNT(*) AS total
       FROM cards`,
      Date.now(),
    )) ?? { learned: 0, due: 0, total: 0 }
  );
}

// Picks the item practised least often (ties go to list order), so content rotates.
export async function pickNextItem<T extends { id: string }>(db: SQLiteDatabase, skill: Skill, items: T[]): Promise<T> {
  const rows = await db.getAllAsync<{ item_id: string; n: number }>(
    'SELECT item_id, COUNT(*) AS n FROM attempts WHERE skill = ? GROUP BY item_id',
    skill,
  );
  const counts = new Map(rows.map((r) => [r.item_id, r.n]));
  return items.reduce((best, item) => ((counts.get(item.id) ?? 0) < (counts.get(best.id) ?? 0) ? item : best));
}
