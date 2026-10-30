import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TaskTabs } from '../../components/TaskTabs';
import { Body, Button, Card, colors, H2, Screen } from '../../components/ui';
import { DIALOGUES, shadowingLines, type Dialogue } from '../../data/dialogues';
import { getItemsDoneToday, logAttempt, pickNextItem } from '../../lib/db';
import { speakFr, useRecording } from '../../lib/useRecording';

const itemId = (d: Dialogue) => `sh-${d.id}`;

// Shadowing: listen to a sentence from a model answer, repeat it out loud, then compare.
export default function Shadowing() {
  const db = useSQLiteContext();
  const [dialogue, setDialogue] = useState<Dialogue>(DIALOGUES[0]);
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const [finished, setFinished] = useState(false);
  const [doneToday, setDoneToday] = useState<Set<string>>(new Set());
  const rec = useRecording();

  const lines = shadowingLines(dialogue);
  const line = lines[index];

  useEffect(() => {
    getItemsDoneToday(db, 'speaking').then(setDoneToday);
    choose(1);
  }, [db]);

  async function choose(n: Dialogue['task']) {
    if (rec.isRecording) return;
    const next = await pickNextItem(
      db,
      'speaking',
      DIALOGUES.filter((d) => d.task === n).map((d) => ({ ...d, id: itemId(d) })),
    );
    setDialogue(DIALOGUES.find((d) => itemId(d) === next.id)!);
    setIndex(0);
    setFinished(false);
    rec.reset();
  }

  async function next() {
    rec.reset();
    if (index + 1 < lines.length) {
      setIndex(index + 1);
      speakFr(lines[index + 1]);
      return;
    }
    setFinished(true);
    await logAttempt(db, 'speaking', itemId(dialogue), lines.length, lines.length);
    setDoneToday((prev) => new Set(prev).add(itemId(dialogue)));
  }

  return (
    <Screen>
      <TaskTabs
        current={dialogue.task}
        done={(n) => DIALOGUES.some((d) => d.task === n && doneToday.has(itemId(d)))}
        onPick={choose}
      />
      <Card>
        <H2>{dialogue.title}</H2>
        <Body muted>Écoutez la phrase, répétez-la à voix haute en imitant le rythme et l’intonation, puis comparez.</Body>
      </Card>

      {finished ? (
        <Card style={{ alignItems: 'center' }}>
          <H2>Bravo ! {lines.length} phrases répétées.</H2>
          <Body muted>Essayez maintenant le dialogue guidé sur le même sujet, avec vos propres mots.</Body>
          <View style={{ alignSelf: 'stretch', marginTop: 8 }}>
            <Button title="Recommencer" variant="outline" onPress={() => { setIndex(0); setFinished(false); }} />
          </View>
        </Card>
      ) : (
        <>
          <Card style={styles.lineCard}>
            <Text style={styles.counter}>
              Phrase {index + 1} / {lines.length}
            </Text>
            {showText ? <Text style={styles.line}>{line}</Text> : <Text style={styles.hidden}>Texte masqué : écoutez bien !</Text>}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Button title="🔊 Écouter" variant="outline" onPress={() => speakFr(line)} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="🐢 Lentement" variant="outline" onPress={() => speakFr(line, true)} />
              </View>
            </View>
            <Button title={showText ? 'Masquer le texte' : 'Afficher le texte'} variant="outline" color={colors.muted} onPress={() => setShowText(!showText)} />
          </Card>

          {rec.isRecording ? (
            <Button title={`■ Arrêter (${Math.round(rec.seconds)} s)`} color={colors.red} onPress={rec.stop} />
          ) : (
            <Button title={rec.uri ? '● Répéter encore' : '● Répéter'} color={colors.red} onPress={rec.start} />
          )}

          {rec.uri && !rec.isRecording && (
            <>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Button title="▶︎ Me réécouter" variant="outline" onPress={rec.playMine} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="🔊 Original" variant="outline" onPress={() => speakFr(line)} />
                </View>
              </View>
              <Button title={index + 1 < lines.length ? 'Phrase suivante →' : 'Terminer'} onPress={next} />
            </>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lineCard: { gap: 12 },
  counter: { fontSize: 13, fontWeight: '600', color: colors.muted, textAlign: 'center', textTransform: 'uppercase' },
  line: { fontSize: 22, lineHeight: 31, fontWeight: '600', color: colors.ink, textAlign: 'center' },
  hidden: { fontSize: 17, color: colors.muted, textAlign: 'center', fontStyle: 'italic', paddingVertical: 12 },
  row: { flexDirection: 'row', gap: 8 },
});
