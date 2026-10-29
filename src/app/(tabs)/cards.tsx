import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, colors, H1, Screen } from '../../components/ui';
import { getStudyQueue, logAttempt, saveReview, type ReviewCard } from '../../lib/db';
import { intervalLabel, Rating, review, type Grade } from '../../lib/srs';

const GRADES: { grade: Grade; label: string; color: string }[] = [
  { grade: Rating.Again, label: 'À revoir', color: colors.red },
  { grade: Rating.Hard, label: 'Difficile', color: colors.amber },
  { grade: Rating.Good, label: 'Bien', color: colors.blue },
  { grade: Rating.Easy, label: 'Facile', color: colors.green },
];

export default function Cards() {
  const db = useSQLiteContext();
  const [queue, setQueue] = useState<ReviewCard[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getStudyQueue(db).then(setQueue);
      setRevealed(false);
    }, [db]),
  );

  if (!queue) return null;

  const card = queue[0];
  if (!card) {
    return (
      <Screen>
        <H1>C'est tout pour aujourd'hui !</H1>
        <Body muted>
          {reviewed > 0 ? `${reviewed} carte(s) revue(s). ` : ''}Revenez demain pour les prochaines révisions.
        </Body>
      </Screen>
    );
  }

  async function grade(g: Grade) {
    const now = new Date();
    const next = review(card, g, now);
    await saveReview(db, next, card.reps === 0);
    await logAttempt(db, 'vocab', card.id, g === Rating.Again ? 0 : 1, 1);
    setReviewed((n) => n + 1);
    setRevealed(false);
    // A card answered "Again" comes back within minutes, so keep it at the end of this session.
    const rest = queue!.slice(1);
    setQueue(next.due - now.getTime() < 15 * 60_000 ? [...rest, { ...card, ...next }] : rest);
  }

  const now = new Date();
  return (
    <Screen>
      <Body muted>{queue.length} carte(s) restante(s)</Body>
      <Card style={styles.flashcard}>
        <Text style={styles.word}>{card.fr}</Text>
        <Button title="🔊 Écouter" variant="outline" onPress={() => Speech.speak(card.fr, { language: 'fr-FR' })} />
        {revealed && (
          <View style={{ gap: 8, marginTop: 8 }}>
            <Text style={styles.meaning}>{card.en}</Text>
            <Body muted>{card.example}</Body>
          </View>
        )}
      </Card>
      {revealed ? (
        <View style={styles.grades}>
          {GRADES.map(({ grade: g, label, color }) => (
            <View key={g} style={{ flex: 1, gap: 4 }}>
              <Button title={label} color={color} onPress={() => grade(g)} />
              <Text style={styles.interval}>{intervalLabel(card, g, now)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Button title="Afficher la réponse" onPress={() => setRevealed(true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flashcard: { minHeight: 260, justifyContent: 'center', alignItems: 'stretch' },
  word: { fontSize: 30, fontWeight: '700', textAlign: 'center', color: colors.ink, marginBottom: 8 },
  meaning: { fontSize: 20, fontWeight: '600', textAlign: 'center', color: colors.blue },
  grades: { flexDirection: 'row', gap: 6 },
  interval: { textAlign: 'center', color: colors.muted, fontSize: 12 },
});
