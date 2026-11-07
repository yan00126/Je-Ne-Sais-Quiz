import { useMemo, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import type { Question } from '../data/comprehension';
import { ResultBanner } from './ResultBanner';
import { Body, Button, Card, H2, textColor, tint } from './ui';
import { makeStyles, useTheme } from '../theme/ThemeProvider';

// Multiple-choice questions, one at a time, with the right answer revealed after each pick.
export function QuizRunner({
  questions,
  onAnswer,
  onFinish,
}: {
  questions: Question[];
  onAnswer?: (question: number, picked: number, correct: boolean) => void;
  onFinish: (score: number) => void;
}) {
  const t = useTheme();
  const styles = useStyles();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const last = index === questions.length - 1;
  const right = picked === q.answer;
  // Show choices in random order so the right answer isn't always in the same spot. Indexes stay the original ones.
  const order = useMemo(() => shuffle(q.choices.map((_, i) => i)), [q]);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    onAnswer?.(index, i, i === q.answer);
  }

  function next() {
    if (last) {
      onFinish(score);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  return (
    <Card>
      <Body muted>
        Question {index + 1} / {questions.length}
      </Body>
      <H2>{q.prompt}</H2>
      <View style={{ gap: 8 }}>
        {order.map((i, position) => {
          const choice = q.choices[i];
          const revealed = picked !== null;
          const mark = revealed && i === q.answer ? t.colors.green : revealed && i === picked ? t.colors.red : null;
          return (
            <Pressable
              key={i}
              onPress={() => pick(i)}
              style={[styles.choice, { borderColor: mark ?? t.colors.border, backgroundColor: mark ? tint(mark) : 'transparent' }]}
            >
              <Text style={styles.letter}>{'ABCD'[position]}</Text>
              <Text style={styles.choiceText}>{choice}</Text>
              {mark && <Ionicons name={i === q.answer ? 'checkmark-circle' : 'close-circle'} size={22} color={textColor(t, mark)} />}
            </Pressable>
          );
        })}
      </View>
      {picked !== null && q.explanation && <Body muted>{q.explanation}</Body>}
      {picked !== null && (
        <ResultBanner key={index} outcome={right ? 'correct' : 'wrong'} title={right ? 'Correct !' : 'Pas tout à fait'}>
          <Button title={last ? 'Voir le résultat' : 'Question suivante'} color={right ? t.colors.green : t.colors.red} onPress={next} />
        </ResultBanner>
      )}
    </Card>
  );
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const useStyles = makeStyles((t) => ({
  choice: { flexDirection: 'row', gap: 10, borderWidth: 2, borderRadius: 10, padding: 12, alignItems: 'center' },
  letter: { fontWeight: '700', color: t.colors.muted, width: 16 },
  choiceText: { flex: 1, fontSize: 16, color: t.colors.ink },
}));
