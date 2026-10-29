import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Question } from '../data/comprehension';
import { Body, Button, Card, colors, H2 } from './ui';

// Multiple-choice questions, one at a time, with the right answer revealed after each pick.
export function QuizRunner({ questions, onFinish }: { questions: Question[]; onFinish: (score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const last = index === questions.length - 1;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
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
        {q.choices.map((choice, i) => {
          const revealed = picked !== null;
          const border = revealed && i === q.answer ? colors.green : revealed && i === picked ? colors.red : colors.border;
          return (
            <Pressable key={i} onPress={() => pick(i)} style={[styles.choice, { borderColor: border }]}>
              <Text style={styles.letter}>{'ABCD'[i]}</Text>
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>
      {picked !== null && <Button title={last ? 'Voir le résultat' : 'Question suivante'} onPress={next} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  choice: { flexDirection: 'row', gap: 10, borderWidth: 2, borderRadius: 10, padding: 12, alignItems: 'center' },
  letter: { fontWeight: '700', color: colors.muted, width: 16 },
  choiceText: { flex: 1, fontSize: 16, color: colors.ink },
});
