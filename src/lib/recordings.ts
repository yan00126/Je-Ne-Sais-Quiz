import { Directory, File, Paths } from 'expo-file-system';
import type { SQLiteDatabase } from 'expo-sqlite';

// Recordings that aren't starred are deleted after this many days.
export const KEEP_DAYS = 30;

export type RecordingKind = 'shadowing' | 'dialogue' | 'exam';

export type SavedRecording = {
  id: number;
  file: string;
  kind: RecordingKind;
  item_id: string;
  title: string;
  text: string;
  seconds: number;
  created_at: number;
  starred: number;
};

// What a recording was an answer to, so the list can say so and replay the model.
export type RecordingMeta = { kind: RecordingKind; itemId: string; title: string; text: string };

const folder = () => new Directory(Paths.document, 'recordings');

export const recordingUri = (file: string) => new File(folder(), file).uri;

// Moves a fresh recording out of the cache, where iOS may delete it, into the app's documents.
export async function saveRecording(db: SQLiteDatabase, tempUri: string, seconds: number, meta: RecordingMeta) {
  const dir = folder();
  if (!dir.exists) dir.create({ intermediates: true });
  const ext = tempUri.split('.').pop() || 'm4a';
  const name = `${Date.now()}-${meta.kind}.${ext}`;
  await new File(tempUri).move(new File(dir, name));
  await db.runAsync(
    'INSERT INTO recordings (file, kind, item_id, title, text, seconds, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    name, meta.kind, meta.itemId, meta.title, meta.text, seconds, Date.now(),
  );
  return recordingUri(name);
}

export async function getRecordings(db: SQLiteDatabase, starredOnly = false): Promise<SavedRecording[]> {
  return db.getAllAsync<SavedRecording>(
    `SELECT * FROM recordings ${starredOnly ? 'WHERE starred = 1' : ''} ORDER BY created_at DESC`,
  );
}

export async function setStarred(db: SQLiteDatabase, id: number, starred: boolean) {
  await db.runAsync('UPDATE recordings SET starred = ? WHERE id = ?', starred ? 1 : 0, id);
}

export async function deleteRecording(db: SQLiteDatabase, rec: SavedRecording) {
  removeFile(rec.file);
  await db.runAsync('DELETE FROM recordings WHERE id = ?', rec.id);
}

// Runs on app start: drops unstarred recordings older than KEEP_DAYS.
export async function pruneRecordings(db: SQLiteDatabase) {
  const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
  const old = await db.getAllAsync<{ file: string }>('SELECT file FROM recordings WHERE starred = 0 AND created_at < ?', cutoff);
  old.forEach((r) => removeFile(r.file));
  await db.runAsync('DELETE FROM recordings WHERE starred = 0 AND created_at < ?', cutoff);
}

function removeFile(name: string) {
  const f = new File(folder(), name);
  if (f.exists) f.delete();
}
