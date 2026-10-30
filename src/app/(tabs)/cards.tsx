import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Card, colors, H1, Screen, shade, tap, tint } from '../../components/ui';
import { exerciseFor, gradeAnswer, hint, makeCloze, type ExerciseKind, type Verdict } from '../../lib/answer';
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
            <Example text={card.example} />
          </View>
        )}
      </Card>
      {revealed ? (
        <View style={styles.grades}>
          {GRADES.map(({ grade: g, label, color }) => (
            <GradeButton key={g} label={label} interval={intervalLabel(card, g, now)} color={color} onPress={() => onGrade(g)} />
          ))}
        </View>
      ) : (
        <Button title="Afficher la réponse" onPress={() => setRevealed(true)} />
      )}
    </>
  );
}

// A same-size tile per grade: the label on one line and, under it, when the card comes back.
function GradeButton({ label, interval, color, onPress }: { label: string; interval: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${interval}`}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.grade,
        { backgroundColor: tint(color), borderColor: tint(color, 0.5), borderBottomColor: shade(color, 0) },
        pressed && { backgroundColor: tint(color, 0.22), borderBottomWidth: 2, transform: [{ translateY: 2 }] },
      ]}
    >
      <Text style={[styles.gradeLabel, { color: shade(color, 0.1) }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
        {label}
      </Text>
      <Text style={[styles.gradeInterval, { color: shade(color, 0.1) }]}>{interval}</Text>
    </Pressable>
  );
}

// The example sentence, read aloud when tapped.
function Example({ text }: { text: string }) {
  if (!text) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Écouter : ${text}`}
      onPress={() => {
        tap();
        say(text);
      }}
      style={({ pressed }) => [styles.example, pressed && { backgroundColor: tint(colors.blue, 0.08) }]}
    >
      <Ionicons name="volume-medium" size={20} color={colors.blue} />
      <Text style={styles.exampleText}>{text}</Text>
    </Pressable>
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
  const [hints, setHints] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const expected = kind === 'cloze' && cloze ? cloze.answer : card.fr;
  // What the hint spells out: the first form of the answer, without grammar notes like "(+ subj.)".
  const hintBase = expected.split('/')[0].replace(/\(.*?\)/g, '').trim();
  const maxHints = Math.max(...hintBase.split(/[\s'’-]+/).map((w) => w.length)) - 1;

  useEffect(() => {
    if (kind === 'dictation') say(card.fr);
  }, []);

  function check() {
    const v = gradeAnswer(typed, expected);
    setVerdict(v);
    if (v !== 'correct') say(card.fr);
  }

  function giveUp() {
    setGaveUp(true);
    setVerdict('wrong');
    say(card.fr);
  }

  // Not knowing is an "Again"; needing a hint makes a right answer count as "Hard" instead of "Good".
  function grade(): Grade {
    if (gaveUp) return Rating.Again;
    if (verdict === 'correct' && hints > 0) return Rating.Hard;
    return VERDICT_GRADE[verdict!];
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
        {!gaveUp && (
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
        )}
        {hints > 0 && verdict === null && <Text style={styles.hint}>{hint(hintBase, hints)}</Text>}
        {verdict && (
          <View style={{ gap: 6 }}>
            <Text style={[styles.feedback, { color: verdict === 'correct' ? colors.green : verdict === 'accents' ? colors.amber : colors.red }]}>
              {gaveUp
                ? 'La réponse :'
                : verdict === 'correct'
                  ? '✓ Correct !'
                  : verdict === 'accents'
                    ? 'Presque : attention aux accents'
                    : '✗ Pas tout à fait'}
            </Text>
            <Text style={styles.word}>{card.fr}</Text>
            <Example text={card.example} />
          </View>
        )}
      </Card>
      {verdict === null ? (
        <View style={{ gap: 8 }}>
          <Button title="Vérifier" disabled={!typed.trim()} onPress={check} />
          <View style={styles.helpRow}>
            <View style={{ flex: 1 }}>
              <Button
                title="💡 Indice"
                variant="outline"
                color={colors.amber}
                disabled={hints >= maxHints}
                onPress={() => setHints((n) => n + 1)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Je ne sais pas" variant="outline" color={colors.muted} onPress={giveUp} />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <Button title="Continuer" onPress={() => onGrade(grade())} />
          {verdict !== 'correct' && !gaveUp && (
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
  hint: { fontSize: 22, fontWeight: '600', letterSpacing: 3, textAlign: 'center', color: colors.amber, fontVariant: ['tabular-nums'] },
  helpRow: { flexDirection: 'row', gap: 8 },
  example: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 8, borderRadius: 10 },
  exampleText: { flex: 1, fontSize: 16, lineHeight: 23, color: colors.muted },
  grades: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  grade: {
    flex: 1,
    height: 68,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 2,
  },
  gradeLabel: { fontSize: 15, fontWeight: '700' },
  gradeInterval: { fontSize: 12, fontWeight: '600', opacity: 0.8 },
});
