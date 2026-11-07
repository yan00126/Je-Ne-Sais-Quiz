import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, Text, TextInput, View } from 'react-native';
import { outcomeColor, ResultBanner } from '../../components/ResultBanner';
import { Body, Button, Card, H1, Screen, shade, tap, textColor, tint } from '../../components/ui';
import { REAL_EXAMPLES, WORD_AUDIO, type Recording } from '../../data/recordings';
import { clozeReveal, exerciseFor, gradeAnswer, hint, makeCloze, type ExerciseKind, type Verdict } from '../../lib/answer';
import type { Outcome } from '../../lib/feedback';
import { getStudyQueue, logAttempt, saveReview, type ReviewCard } from '../../lib/db';
import { markActive } from '../../lib/activity';
import { play } from '../../lib/audio';
import { intervalLabel, Rating, review, type Grade } from '../../lib/srs';
import { useStudyTimer } from '../../lib/useStudyTimer';
import { makeStyles, useTheme } from '../../theme/ThemeProvider';
import type { Theme } from '../../theme/themes';

const grades = (t: Theme): { grade: Grade; label: string; color: string }[] => [
  { grade: Rating.Again, label: 'À revoir', color: t.colors.red },
  { grade: Rating.Hard, label: 'Difficile', color: t.colors.amber },
  { grade: Rating.Good, label: 'Bien', color: t.colors.accent },
  { grade: Rating.Easy, label: 'Facile', color: t.colors.green },
];

// The word itself, in a human voice when Lingua Libre has a recording of it.
const sayWord = (card: ReviewCard) => play(card.fr, WORD_AUDIO[card.id]?.url);

export default function Cards() {
  const db = useSQLiteContext();
  useStudyTimer('vocab');
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
  const t = useTheme();
  const styles = useStyles();
  const [revealed, setRevealed] = useState(false);
  const now = new Date();
  return (
    <>
      <Card style={styles.flashcard}>
        <Text style={styles.label}>Nouveau mot</Text>
        <Text style={styles.word}>{card.fr}</Text>
        <Button title="🔊 Écouter" variant="outline" onPress={() => sayWord(card)} />
        {WORD_AUDIO[card.id] && <Credit rec={WORD_AUDIO[card.id]} />}
        {revealed && (
          <View style={{ gap: 8, marginTop: 8 }}>
            <Text style={styles.meaning}>{card.en}</Text>
            <Example card={card} />
          </View>
        )}
      </Card>
      {revealed ? (
        <View style={styles.grades}>
          {grades(t).map(({ grade: g, label, color }) => (
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
  const t = useTheme();
  const styles = useStyles();
  const brutal = t.button === 'brutal';
  const fg = brutal ? t.colors.ink : shade(textColor(t, color), 0.1);
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
        brutal
          ? [styles.gradeBrutal, { backgroundColor: color }, pressed && styles.gradeBrutalPressed]
          : [
              { backgroundColor: tint(color), borderColor: tint(color, 0.5), borderBottomColor: shade(color, 0) },
              pressed && { backgroundColor: tint(color, 0.22), borderBottomWidth: 2, transform: [{ translateY: 2 }] },
            ],
      ]}
    >
      <Text style={[styles.gradeLabel, { color: fg }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
        {label}
      </Text>
      <Text style={[styles.gradeInterval, { color: fg }]}>{interval}</Text>
    </Pressable>
  );
}

// The example sentence, read aloud when tapped: a real Tatoeba sentence with a human recording
// when there is one, otherwise the deck's own sentence in the device voice.
function Example({ card }: { card: ReviewCard }) {
  const t = useTheme();
  const styles = useStyles();
  const real = REAL_EXAMPLES[card.id];
  const text = real?.fr ?? card.example;
  if (!text) return null;
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Écouter : ${text}`}
        onPress={() => {
          tap();
          play(text, real?.audio.url);
        }}
        style={({ pressed }) => [styles.example, pressed && { backgroundColor: tint(t.colors.accent, 0.08) }]}
      >
        <Ionicons name={real ? 'mic' : 'volume-medium'} size={20} color={t.colors.accentText} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.exampleText}>{text}</Text>
          {real?.en && <Text style={styles.exampleTranslation}>{real.en}</Text>}
        </View>
      </Pressable>
      {real && <Credit rec={real.audio} />}
    </View>
  );
}

// Who recorded it and under which licence, linking to the source page. The licences require this.
function Credit({ rec }: { rec: Recording }) {
  const styles = useStyles();
  return (
    <Text style={styles.credit} onPress={() => Linking.openURL(rec.page)} accessibilityRole="link">
      Voix : {rec.author} · {rec.source} · {rec.license}
    </Text>
  );
}

const PROMPTS: Record<Exclude<ExerciseKind, 'flashcard'>, string> = {
  dictation: 'Dictée : écoutez et écrivez le mot',
  meaning: 'Écrivez le mot français',
  cloze: 'Complétez la phrase',
};

const VERDICT_GRADE: Record<Verdict, Grade> = { correct: Rating.Good, accents: Rating.Hard, wrong: Rating.Again };
const OUTCOME: Record<Verdict, Outcome> = { correct: 'correct', accents: 'almost', wrong: 'wrong' };
const TITLES: Record<Verdict, string> = { correct: 'Correct !', accents: 'Presque !', wrong: 'Pas tout à fait' };

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
  const t = useTheme();
  const styles = useStyles();
  const [typed, setTyped] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [hints, setHints] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const expected = kind === 'cloze' && cloze ? cloze.answer : card.fr;
  // A cloze reveals what goes in the blank, so an article already in the sentence isn't shown twice.
  const reveal = kind === 'cloze' && cloze ? clozeReveal(card.fr, cloze) : { word: card.fr, entry: null };
  // What the hint spells out: the first form of the answer, without grammar notes like "(+ subj.)".
  const hintBase = expected.split('/')[0].replace(/\(.*?\)/g, '').trim();
  const maxHints = Math.max(...hintBase.split(/[\s'’-]+/).map((w) => w.length)) - 1;

  useEffect(() => {
    if (kind === 'dictation') sayWord(card);
  }, []);

  function check() {
    const v = gradeAnswer(typed, expected);
    setVerdict(v);
    // Let the result sound finish before the word is read out.
    if (v !== 'correct') setTimeout(() => sayWord(card), 450);
  }

  function giveUp() {
    setGaveUp(true);
    setVerdict('wrong');
    setTimeout(() => sayWord(card), 450);
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
        {kind === 'dictation' && <Button title="🔊 Réécouter" variant="outline" onPress={() => sayWord(card)} />}
        {kind === 'meaning' && <Text style={styles.meaning}>{card.en}</Text>}
        {kind === 'cloze' && cloze && (
          <>
            <Text style={styles.sentence}>{cloze.sentence}</Text>
            <Body muted>({card.en})</Body>
          </>
        )}
        {!gaveUp && (
          <TextInput
            style={[styles.input, verdict && { borderColor: verdict === 'correct' ? t.colors.green : verdict === 'accents' ? t.colors.amber : t.colors.red }]}
            value={typed}
            onChangeText={(t) => {
              markActive();
              setTyped(t);
            }}
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
            {gaveUp && <Text style={styles.label}>La réponse</Text>}
            <Text style={styles.word}>{reveal.word}</Text>
            {reveal.entry && <Text style={styles.entry}>{reveal.entry}</Text>}
            <Example card={card} />
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
                color={t.colors.amber}
                disabled={hints >= maxHints}
                onPress={() => setHints((n) => n + 1)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Je ne sais pas" variant="outline" color={t.colors.muted} onPress={giveUp} />
            </View>
          </View>
        </View>
      ) : (
        <ResultBanner
          outcome={OUTCOME[verdict]}
          title={gaveUp ? 'À retenir' : TITLES[verdict]}
          detail={gaveUp ? undefined : verdict === 'accents' ? 'Attention aux accents' : verdict === 'correct' && hints > 0 ? 'Avec un indice' : undefined}
        >
          <Button title="Continuer" color={outcomeColor(t, OUTCOME[verdict])} onPress={() => onGrade(grade())} />
          {verdict !== 'correct' && !gaveUp && (
            <Button title="J'avais raison (synonyme)" variant="outline" color={t.colors.muted} onPress={() => onGrade(Rating.Good)} />
          )}
        </ResultBanner>
      )}
    </>
  );
}

const useStyles = makeStyles((t) => ({
  flashcard: { minHeight: 260, justifyContent: 'center', alignItems: 'stretch' },
  label: { fontSize: 13, fontWeight: '600', color: t.colors.muted, textAlign: 'center', textTransform: 'uppercase' },
  word: { fontFamily: 'head', fontWeight: '800', textTransform: 'none', fontSize: 32, lineHeight: 40, textAlign: 'center', color: t.colors.ink, marginBottom: 8 },
  entry: { fontSize: 16, textAlign: 'center', color: t.colors.muted, marginTop: -6, marginBottom: 4 },
  meaning: { fontSize: 20, fontWeight: '600', textAlign: 'center', color: t.colors.accentText },
  sentence: { fontSize: 19, lineHeight: 27, textAlign: 'center', color: t.colors.ink },
  input: { borderWidth: t.button === 'brutal' ? 2.5 : 2, borderColor: t.colors.border, backgroundColor: t.colors.card, borderRadius: t.radius.field, padding: 12, fontSize: 20, color: t.colors.ink, marginTop: 8 },
  hint: { fontSize: 22, fontWeight: '600', letterSpacing: 3, textAlign: 'center', color: t.colors.amberText, fontVariant: ['tabular-nums'] },
  helpRow: { flexDirection: 'row', gap: 8 },
  example: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 8, borderRadius: 10 },
  exampleText: { fontSize: 16, lineHeight: 23, color: t.colors.muted },
  exampleTranslation: { fontSize: 14, lineHeight: 20, color: t.colors.muted, fontStyle: 'italic', opacity: 0.8 },
  credit: { fontSize: 11, color: t.colors.muted, textAlign: 'center', opacity: 0.8 },
  grades: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  grade: {
    flex: 1,
    height: 68,
    borderRadius: t.radius.field,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 2,
  },
  gradeBrutal: { borderWidth: 2.5, borderBottomWidth: 2.5, borderColor: t.colors.ink, boxShadow: `3px 3px 0px ${t.colors.ink}` },
  gradeBrutalPressed: { boxShadow: `0px 0px 0px ${t.colors.ink}`, transform: [{ translateX: 3 }, { translateY: 3 }] },
  gradeLabel: { fontSize: 15, fontWeight: '700' },
  gradeInterval: { fontSize: 12, fontWeight: '600', opacity: 0.8 },
}));
