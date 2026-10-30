import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Body, Card, colors, H1, Screen } from '../../components/ui';
import { getStudyQueue, getTodayCounts, type Skill } from '../../lib/db';
import { stepProgress, todaysPlan } from '../../lib/plan';

export default function Today() {
  const db = useSQLiteContext();
  const [vocabLeft, setVocabLeft] = useState<number | null>(null);
  const [counts, setCounts] = useState<Partial<Record<Skill, number>>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setVocabLeft((await getStudyQueue(db)).length);
        setCounts(await getTodayCounts(db));
      })();
    }, [db]),
  );

  if (vocabLeft === null) return null;

  const plan = todaysPlan(new Date());
  const minutes = plan.reduce((sum, s) => sum + s.minutes, 0);
  const progress = plan.map((step) => stepProgress(step, counts, vocabLeft));
  const completed = progress.filter((p) => p.done).length;

  return (
    <Screen>
      <H1>Bonjour Felix 👋</H1>
      <Body muted>
        Plan du jour : environ {minutes} minutes · {completed}/{plan.length} terminé
      </Body>
      {plan.map((step, i) => {
        const { done, label } = progress[i];
        return (
          <Pressable key={step.skill} onPress={() => router.push(step.href)}>
            <Card style={styles.row}>
              <Ionicons
                name={done ? 'checkmark-circle' : 'ellipse-outline'}
                size={28}
                color={done ? colors.green : colors.border}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{step.title}</Text>
                <Body muted>
                  {step.detail} · {step.minutes} min
                </Body>
                <Text style={[styles.progress, done && { color: colors.green }]}>{label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink },
  progress: { fontSize: 14, fontWeight: '600', color: colors.blue, marginTop: 2 },
});
