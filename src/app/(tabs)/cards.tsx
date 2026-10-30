import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Card, colors, H1, Screen } from '../../components/ui';
import { exerciseFor, gradeAnswer, makeCloze, type ExerciseKind, type Verdict } from '../../lib/answer';
import { getStudyQueue, logAttempt, saveReview, type ReviewCard } from '../../lib/db';
import { intervalLabel, Rating, review, type Grade } from '../../lib/srs';

const GRADES: { grade: Grade; label: string; color: string }[] = [
  { grade: Rating.Again, label: 'À revoir', color: colors.red },
  { grade: Rating.Hard, label: 'Difficile', color: colors.amber },
  { grade: Rating.Good, label: 'Bien', color: colors.blue },
  { grade: Rating.Easy, label: 'Facile', color: colors.green },
];

const say = (text: string) => Speech.speak(text, { language: 'fr-FR' });

export default function Cards() {
  const db = useSQLiteContext();
  const [queue, setQueue] = useState<ReviewCard[] | null>(null);
  const [reviewed, setReviewed] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getStudyQueue(db).then(setQueue);
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
    // A card answered "Again" comes back within minutes, so keep it at the end of this session.
    const rest = queue!.slice(1);
    setQueue(next.due - now.getTime() < 15 * 60_000 ? [...rest, { ...card, ...next }] : rest);
  }

  const cloze = makeCloze(card.fr, card.example);
  const kind = exerciseFor(card.reps, cloze !== null);
  const key = `${card.id}-${card.reps}-${queue.length}`;

  return (
    <Screen>
      <Body muted>{queue.length} carte(s) restante(s)</Body>
      {kind === 'flashcard' ? (
        <Flashcard key={key} card={card} onGrade={grade} />
      ) : (
        <TypedExercise key={key} card={card} kind={kind} cloze={cloze} onGrade={grade} />
      )}
    </Screen>
  );
}

// New words: see the word, hear it, then grade yourself.
function Flashcard({ card, onGrade }: { card: ReviewCard; onGrade: (g: Grade) => void }) {
  const [revealed, setRevealed] = useState(false);
  const now = new Date();
  return (
    <>
      <Card style={styles.flashcard}>
        <Text style={styles.label}>Nouveau mot</Text>
        <Text style={styles.word}>{card.fr}</Text>
        <Button title="🔊 Écouter" variant="outline" onPress={() => say(card.fr)} />
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
              <Button title={label} color={color} onPress={() => onGrade(g)} />
              <Text style={styles.interval}>{intervalLabel(card, g, now)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Button title="Afficher la réponse" onPress={() => setRevealed(true)} />
      )}
    </>
  );
}

const PROMPTS: Record<Exclude<ExerciseKind, 'flashcard'>, string> = {
  dictation: 'Dictée : écoutez et écrivez le mot',
  meaning: 'Écrivez le mot français',
  cloze: 'Complétez la phrase',
};

const VERDICT_GRADE: Record<Verdict, Grade> = { correct: Rating.Good, accents: Rating.Hard, wrong: Rating.Again };

// Known words: type the answer, graded automatically into the scheduler.
function TypedExercise({
  card,
  kind,
  cloze,
  onGrade,
}: {
  card: ReviewCard;
  kind: Exclude<ExerciseKind, 'flashcard'>;
  cloze: { sentence: string; answer: string } | null;
  onGrade: (g: Grade) => void;
}) {
  const [typed, setTyped] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const expected = kind === 'cloze' && cloze ? cloze.answer : card.fr;

  useEffect(() => {
    if (kind === 'dictation') say(card.fr);
  }, []);

  function check() {
    const v = gradeAnswer(typed, expected);
    setVerdict(v);
    if (v !== 'correct') say(card.fr);
  }

  return (
    <>
      <Card style={styles.flashcard}>
        <Text style={styles.label}>{PROMPTS[kind]}</Text>
        {kind === 'dictation' && <Button title="🔊 Réécouter" variant="outline" onPress={() => say(card.fr)} />}
        {kind === 'meaning' && <Text style={styles.meaning}>{card.en}</Text>}
        {kind === 'cloze' && cloze && (
          <>
            <Text style={styles.sentence}>{cloze.sentence}</Text>
            <Body muted>({card.en})</Body>
          </>
        )}
        <TextInput
          style={[styles.input, verdict && { borderColor: verdict === 'correct' ? colors.green : verdict === 'accents' ? colors.amber : colors.red }]}
          value={typed}
          onChangeText={setTyped}
          editable={verdict === null}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoFocus
          placeholder="Tapez votre réponse"
          returnKeyType="done"
          onSubmitEditing={() => typed.trim() && verdict === null && check()}
        />
        {verdict && (
          <View style={{ gap: 6 }}>
            <Text style={[styles.feedback, { color: verdict === 'correct' ? colors.green : verdict === 'accents' ? colors.amber : colors.red }]}>
              {verdict === 'correct' ? '✓ Correct !' : verdict === 'accents' ? 'Presque : attention aux accents' : '✗ Pas tout à fait'}
            </Text>
            <Text style={styles.word}>{card.fr}</Text>
            <Body muted>{card.example}</Body>
          </View>
        )}
      </Card>
      {verdict === null ? (
        <Button title="Vérifier" disabled={!typed.trim()} onPress={check} />
      ) : (
        <View style={{ gap: 8 }}>
          <Button title="Continuer" onPress={() => onGrade(VERDICT_GRADE[verdict])} />
          {verdict !== 'correct' && (
            <Button title="J'avais raison (synonyme)" variant="outline" onPress={() => onGrade(Rating.Good)} />
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flashcard: { minHeight: 260, justifyContent: 'center', alignItems: 'stretch' },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, textAlign: 'center', textTransform: 'uppercase' },
  word: { fontSize: 30, fontWeight: '700', textAlign: 'center', color: colors.ink, marginBottom: 8 },
  meaning: { fontSize: 20, fontWeight: '600', textAlign: 'center', color: colors.blue },
  sentence: { fontSize: 19, lineHeight: 27, textAlign: 'center', color: colors.ink },
  input: { borderWidth: 2, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 20, color: colors.ink, marginTop: 8 },
  feedback: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  grades: { flexDirection: 'row', gap: 6 },
  interval: { textAlign: 'center', color: colors.muted, fontSize: 12 },
});
