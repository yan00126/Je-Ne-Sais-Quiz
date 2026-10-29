import { router, useFocusEffect, type Href } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Body, Card, colors, H1, Screen } from '../../components/ui';
import { getDeckStats, getSkillStats, type Skill } from '../../lib/db';

type Step = { skill: Skill; title: string; detail: string; minutes: number; href: Href };

// Each day covers vocabulary, listening and reading; writing and speaking alternate,
// so all four TCF skills get roughly equal time over a week.
function todaysPlan(dueCards: number): Step[] {
  const writingDay = new Date().getDate() % 2 === 0;
  return [
    { skill: 'vocab', title: 'Vocabulaire', detail: `${dueCards} carte(s) à revoir + nouveaux mots`, minutes: 10, href: '/cards' },
    { skill: 'listening', title: 'Compréhension orale', detail: 'Un document audio et ses questions', minutes: 10, href: '/practice/listening' },
    { skill: 'reading', title: 'Compréhension écrite', detail: 'Un texte et ses questions', minutes: 10, href: '/practice/reading' },
    writingDay
      ? { skill: 'writing', title: 'Expression écrite', detail: 'Une tâche du TCF, chronométrée', minutes: 20, href: '/practice/writing' }
      : { skill: 'speaking', title: 'Expression orale', detail: 'Une tâche du TCF, enregistrée', minutes: 15, href: '/practice/speaking' },
  ];
}

export default function Today() {
  const db = useSQLiteContext();
  const [due, setDue] = useState(0);
  const [doneToday, setDoneToday] = useState<Partial<Record<Skill, number>>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const deck = await getDeckStats(db);
        setDue(deck.due ?? 0);
        const stats = await getSkillStats(db);
        setDoneToday(Object.fromEntries(stats.map((s) => [s.skill, s.today])));
      })();
    }, [db]),
  );

  const plan = todaysPlan(due);
  const minutes = plan.reduce((sum, s) => sum + s.minutes, 0);
  const completed = plan.filter((s) => (doneToday[s.skill] ?? 0) > 0).length;

  return (
    <Screen>
      <H1>Bonjour Felix 👋</H1>
      <Body muted>
        Plan du jour : environ {minutes} minutes · {completed}/{plan.length} terminé
      </Body>
      {plan.map((step) => {
        const done = (doneToday[step.skill] ?? 0) > 0;
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
});
