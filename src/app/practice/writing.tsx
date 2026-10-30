import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Body, Button, Card, colors, H2, Screen } from '../../components/ui';
import { WRITING_TASKS, type WritingTask } from '../../data/prompts';
import { logAttempt, saveWriting } from '../../lib/db';

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
  const db = useSQLiteContext();
  const [task, setTask] = useState<WritingTask>(WRITING_TASKS[0]);
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const left = useCountdown(SUGGESTED_MINUTES[task.task] * 60, started && !saved, attempt);

  const words = countWords(text);
  const inRange = words >= task.minWords && words <= task.maxWords;

  function choose(t: WritingTask) {
    setTask(t);
    setText('');
    setStarted(false);
    setSaved(false);
    setAttempt((n) => n + 1);
  }

  async function save() {
    await saveWriting(db, task.id, text, words);
    await logAttempt(db, 'writing', task.id, inRange ? 1 : 0, 1);
    setSaved(true);
  }

  return (
    <Screen>
      <View style={styles.tabs}>
        {WRITING_TASKS.map((t) => (
          <View key={t.id} style={{ flex: 1 }}>
            <Button title={`Tâche ${t.task}`} variant={t.id === task.id ? 'solid' : 'outline'} onPress={() => choose(t)} />
          </View>
        ))}
      </View>
      <Card>
        <H2>
          Tâche {task.task} · {task.minWords} à {task.maxWords} mots
        </H2>
        <Body>{task.prompt}</Body>
      </Card>
      {!started ? (
        <Button title={`Commencer (${SUGGESTED_MINUTES[task.task]} min)`} onPress={() => setStarted(true)} />
      ) : (
        <>
          <View style={styles.meta}>
            <Body muted>⏱ {mmss(left)}</Body>
            <Body muted>
              <Body>{words}</Body> mot(s){' '}
              {words > 0 && (inRange ? '✓' : words < task.minWords ? '· trop court' : '· trop long')}
            </Body>
          </View>
          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            editable={!saved}
            placeholder="Écrivez votre réponse ici…"
            autoCorrect={false}
            textAlignVertical="top"
          />
          {saved ? (
            <Card>
              <H2>Texte enregistré</H2>
              <Body muted>
                La correction automatique (grammaire, vocabulaire, niveau estimé) arrive dans la prochaine version. En attendant, relisez-vous :
                accords, temps des verbes, connecteurs (cependant, en revanche, par conséquent).
              </Body>
              <Button title="Nouvelle tentative" variant="outline" onPress={() => choose(task)} />
            </Card>
          ) : (
            <Button title="Terminer et enregistrer" disabled={words === 0} onPress={save} />
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    minHeight: 240,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 16,
    lineHeight: 23,
    color: colors.ink,
  },
});
