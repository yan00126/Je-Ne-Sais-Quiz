import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TaskTabs } from '../../components/TaskTabs';
import { Body, Button, Card, colors, H2, Screen, tint } from '../../components/ui';
import { DIALOGUES, type Dialogue } from '../../data/dialogues';
import { getItemsDoneToday, logAttempt, pickNextItem } from '../../lib/db';
import { speakFr, useRecording } from '../../lib/useRecording';

// One line of the conversation so far.
type Line = { who: 'examiner' | 'you'; text: string };

// A guided role-play on a TCF speaking task: the examiner speaks, you answer out loud with hints
// if you are stuck, then compare with a model answer before moving on.
export default function DialogueScreen() {
  const db = useSQLiteContext();
  const [dialogue, setDialogue] = useState<Dialogue>(DIALOGUES[0]);
  const [turn, setTurn] = useState(0);
  const [hints, setHints] = useState(0);
  const [history, setHistory] = useState<Line[]>([]);
  const [finished, setFinished] = useState(false);
  const [doneToday, setDoneToday] = useState<Set<string>>(new Set());
  const rec = useRecording();

  const current = dialogue.turns[turn];

  useEffect(() => {
    getItemsDoneToday(db, 'speaking').then(setDoneToday);
    choose(1);
  }, [db]);

  function begin(d: Dialogue) {
    setDialogue(d);
    setTurn(0);
    setHints(0);
    setFinished(false);
    rec.reset();
    const first = d.turns[0].examiner;
    setHistory(first ? [{ who: 'examiner', text: first }] : []);
    if (first) speakFr(first);
  }

  async function choose(n: Dialogue['task']) {
    if (rec.isRecording) return;
    begin(await pickNextItem(db, 'speaking', DIALOGUES.filter((d) => d.task === n)));
  }

  async function next() {
    const lines: Line[] = [{ who: 'you', text: current.model }];
    if (current.reply) lines.push({ who: 'examiner', text: current.reply });
    const following = dialogue.turns[turn + 1];
    if (following?.examiner) lines.push({ who: 'examiner', text: following.examiner });
    setHistory((h) => [...h, ...lines]);
    // Read out what the examiner says next: their answer, then their next question.
    const spoken = lines.filter((l) => l.who === 'examiner').map((l) => l.text).join(' ');
    if (spoken) speakFr(spoken);
    rec.reset();
    setHints(0);
    if (following) {
      setTurn(turn + 1);
      return;
    }
    setFinished(true);
    await logAttempt(db, 'speaking', dialogue.id, dialogue.turns.length, dialogue.turns.length);
    setDoneToday((prev) => new Set(prev).add(dialogue.id));
  }

  return (
    <Screen>
      <TaskTabs current={dialogue.task} done={(n) => DIALOGUES.some((d) => d.task === n && doneToday.has(d.id))} onPick={choose} />
      <Card>
        <H2>{dialogue.title}</H2>
        <Body muted>{dialogue.situation}</Body>
      </Card>

      {history.map((l, i) => (
        <Bubble key={i} line={l} />
      ))}

      {finished ? (
        <Card style={{ alignItems: 'center' }}>
          <H2>Dialogue terminé !</H2>
          <Body muted>Pour gagner en fluidité, répétez les réponses modèles dans « Répéter après le modèle ».</Body>
          <View style={{ alignSelf: 'stretch', marginTop: 8 }}>
            <Button title="Recommencer" variant="outline" onPress={() => begin(dialogue)} />
          </View>
        </Card>
      ) : (
        <>
          <Card style={styles.goal}>
            <Text style={styles.goalLabel}>
              À vous · {turn + 1} / {dialogue.turns.length}
            </Text>
            <Text style={styles.goalText}>{current.goal}</Text>
            {current.hints.slice(0, hints).map((h, i) => (
              <Text key={i} style={styles.hint}>
                💡 {h}
              </Text>
            ))}
          </Card>

          {rec.isRecording ? (
            <Button
              title={`■ Arrêter (${Math.round(rec.seconds)} s)`}
              color={colors.red}
              onPress={() => rec.stop({ kind: 'dialogue', itemId: dialogue.id, title: `${dialogue.title} · ${current.goal}`, text: current.model })}
            />
          ) : rec.uri ? (
            <>
              <Card style={styles.model}>
                <Text style={styles.goalLabel}>Exemple de réponse</Text>
                <Pressable onPress={() => speakFr(current.model)} style={styles.modelRow} accessibilityRole="button">
                  <Ionicons name="volume-medium" size={20} color={colors.green} />
                  <Text style={styles.modelText}>{current.model}</Text>
                </Pressable>
              </Card>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Button title="▶︎ Me réécouter" variant="outline" onPress={rec.playMine} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="● Réessayer" variant="outline" color={colors.red} onPress={rec.start} />
                </View>
              </View>
              <Button title={turn + 1 < dialogue.turns.length ? 'Continuer →' : 'Terminer'} onPress={next} />
            </>
          ) : (
            <>
              <Button title="● Répondre" color={colors.red} onPress={rec.start} />
              <View style={styles.row}>
                {current.examiner && (
                  <View style={{ flex: 1 }}>
                    <Button title="🔊 Réécouter" variant="outline" onPress={() => speakFr(current.examiner!)} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Button
                    title="💡 Indice"
                    variant="outline"
                    color={colors.amber}
                    disabled={hints >= current.hints.length}
                    onPress={() => setHints(hints + 1)}
                  />
                </View>
              </View>
            </>
          )}
        </>
      )}
    </Screen>
  );
}

function Bubble({ line }: { line: Line }) {
  const mine = line.who === 'you';
  return (
    <Pressable
      onPress={() => speakFr(line.text)}
      accessibilityRole="button"
      style={[styles.bubble, mine ? styles.mine : styles.theirs]}
    >
      <Text style={styles.who}>{mine ? 'Vous (modèle)' : 'Examinateur'}</Text>
      <Text style={styles.bubbleText}>{line.text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  goal: { borderColor: tint(colors.blue, 0.4), borderWidth: 1.5 },
  goalLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, textTransform: 'uppercase' },
  goalText: { fontSize: 18, lineHeight: 25, fontWeight: '600', color: colors.ink },
  hint: { fontSize: 16, lineHeight: 23, color: colors.amber, fontWeight: '600' },
  model: { borderColor: tint(colors.green, 0.4), borderWidth: 1.5 },
  modelRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  modelText: { flex: 1, fontSize: 16, lineHeight: 23, color: colors.ink },
  bubble: { maxWidth: '88%', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, gap: 2 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, borderBottomLeftRadius: 4 },
  mine: { alignSelf: 'flex-end', backgroundColor: tint(colors.blue, 0.1), borderBottomRightRadius: 4 },
  who: { fontSize: 11, fontWeight: '700', color: colors.muted, textTransform: 'uppercase' },
  bubbleText: { fontSize: 16, lineHeight: 22, color: colors.ink },
});
