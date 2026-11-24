import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Body, Button, Card, Footer, H2, Screen, Sheet } from '../../components/ui';
import { WRITING_TASKS, type WritingTask } from '../../data/prompts';
import { logAttempt, pickNextItem, saveWriting } from '../../lib/db';
import { markActive } from '../../lib/activity';
import { writingCounts } from '../../lib/plan';
import { useStudyTimer } from '../../lib/useStudyTimer';
import { makeStyles, useTheme } from '../../theme/ThemeProvider';

// Suggested split of the 60-minute TCF Canada writing test across its three tasks.
const SUGGESTED_MINUTES: Record<WritingTask['task'], number> = { 1: 10, 2: 20, 3: 30 };

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function useCountdown(seconds: number, running: boolean, resetKey: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => setLeft(seconds), [seconds, resetKey]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  return left;
}

function mmss(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function Writing() {
  const styles = useStyles();
  const theme = useTheme();
  const db = useSQLiteContext();
  useStudyTimer('writing');
  const [task, setTask] = useState<WritingTask>(WRITING_TASKS[0]);
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingTask, setPendingTask] = useState<WritingTask['task'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const busy = saving || loading;
  const left = useCountdown(SUGGESTED_MINUTES[task.task] * 60, started && !saved && !busy, attempt);

  const words = countWords(text);
  const inRange = words >= task.minWords && words <= task.maxWords;

  function choose(t: WritingTask) {
    setTask(t);
    setText('');
    setStarted(false);
    setSaved(false);
    setError(null);
    setAttempt((n) => n + 1);
  }

  // Each task number has several subjects; open the one practised least.
  function chooseNumber(n: WritingTask['task']) {
    if (inFlight.current || loading || n === task.task) return;
    if (text.trim() && !saved) setPendingTask(n);
    else void changeTask(n);
  }

  async function changeTask(n: WritingTask['task']) {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      choose(await pickNextItem(db, 'writing', WRITING_TASKS.filter((t) => t.task === n)));
      setPendingTask(null);
    } catch {
      setError('Impossible de charger la tâche. Réessayez.');
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    pickNextItem(db, 'writing', WRITING_TASKS.filter((t) => t.task === 1))
      .then((t) => { if (active) choose(t); })
      .catch(() => { if (active) setError('Impossible de charger la tâche. Réessayez.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function save() {
    if (inFlight.current || loading || saved || !text.trim()) return;
    inFlight.current = true;
    setSaving(true);
    setError(null);
    try {
      await saveWriting(db, task.id, text, words);
      await logAttempt(db, 'writing', task.id, inRange ? 1 : 0, 1, writingCounts(words, task.minWords));
      setSaved(true);
    } catch {
      setError('Impossible d’enregistrer le texte. Réessayez.');
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }

  return (
    <Screen fieldAtEnd>
      <View style={styles.tabs}>
        {([1, 2, 3] as const).map((n) => (
          <View key={n} style={{ flex: 1 }}>
            <Button title={`Tâche ${n}`} disabled={busy || pendingTask !== null} variant={n === task.task ? 'solid' : 'outline'} onPress={() => chooseNumber(n)} />
          </View>
        ))}
      </View>
      {error && <Body>{error}</Body>}
      <Sheet visible={pendingTask !== null} title="Changer de tâche ?" onClose={() => !busy && setPendingTask(null)}>
        <Body>Votre texte n’est pas enregistré. Changer de tâche supprimera ce brouillon.</Body>
        {error && <Body>{error}</Body>}
        <Button title="Garder mon texte" disabled={busy} variant="outline" onPress={() => setPendingTask(null)} />
        <Button title="Changer de tâche" disabled={busy} onPress={() => pendingTask !== null && changeTask(pendingTask)} />
      </Sheet>
      <Card>
        <H2>
          Tâche {task.task} · {task.minWords} à {task.maxWords} mots
        </H2>
        <Body>{task.prompt}</Body>
      </Card>
      {!started ? (
        <Footer>
          <Button title={`Commencer (${SUGGESTED_MINUTES[task.task]} min)`} disabled={busy || pendingTask !== null} onPress={() => setStarted(true)} />
        </Footer>
      ) : (
        <>
          <View style={styles.meta}>
            <View style={styles.clock}>
              <Ionicons name="timer-outline" size={20} color={theme.colors.muted} />
              <Body muted>{mmss(left)}</Body>
            </View>
            <Body muted>
              <Body>{words}</Body> {words > 1 ? 'mots' : 'mot'}{' '}
              {words > 0 && (inRange ? '✓' : words < task.minWords ? '· trop court' : '· trop long')}
            </Body>
          </View>
          {saved && (
            <Card>
              <H2>Texte enregistré</H2>
              {!writingCounts(words, task.minWords) && (
                <Body>
                  Pas compté dans le plan du jour : il faut au moins {task.minWords} mots (vous en avez {words}).
                </Body>
              )}
              <Body muted>
                La correction automatique (grammaire, vocabulaire, niveau estimé) arrive dans la prochaine version. En attendant, relisez-vous :
                accords, temps des verbes, connecteurs (cependant, en revanche, par conséquent).
              </Body>
            </Card>
          )}
          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={(t) => {
              markActive();
              setText(t);
            }}
            editable={!saved && !busy && pendingTask === null}
            placeholder="Écrivez votre réponse ici…"
            autoCorrect={false}
            textAlignVertical="top"
          />
          {/* Pinned at the bottom: stays above the keyboard while typing. */}
          <Footer>
            {saved ? (
              <Button title="Nouvelle tentative" variant="outline" onPress={() => choose(task)} />
            ) : (
              <Button title={saving ? 'Enregistrement…' : 'Terminer et enregistrer'} disabled={words === 0 || busy || pendingTask !== null} onPress={save} />
            )}
          </Footer>
        </>
      )}
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  tabs: { flexDirection: 'row', gap: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  clock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: {
    minHeight: 240,
    backgroundColor: t.colors.card,
    borderRadius: t.radius.field,
    borderWidth: t.button === 'brutal' ? 2.5 : 1.5,
    borderColor: t.colors.border,
    padding: 14,
    fontSize: 16,
    lineHeight: 23,
    color: t.colors.ink,
  },
}));
