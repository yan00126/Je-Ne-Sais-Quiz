import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Body, Card, Screen } from '../../components/ui';
import type { Skill } from '../../lib/db';
import { makeStyles, useTheme } from '../../theme/ThemeProvider';

const SKILLS: { title: string; detail: string; skill: Skill; icon: ComponentProps<typeof Ionicons>['name']; href: Href }[] = [
  { title: 'Compréhension orale', detail: 'Documents avec questions, ou dictée de nombres', skill: 'listening', icon: 'headset-outline', href: '/practice/listening' },
  { title: 'Compréhension écrite', detail: 'Lisez un texte, répondez aux questions', skill: 'reading', icon: 'book-outline', href: '/practice/reading' },
  { title: 'Expression écrite', detail: 'Tâches 1, 2 et 3 avec minuterie et compteur de mots', skill: 'writing', icon: 'create-outline', href: '/practice/writing' },
  { title: 'Expression orale', detail: 'Tâches 1, 2 et 3 enregistrées', skill: 'speaking', icon: 'mic-outline', href: '/practice/speaking' },
  { title: 'Répéter après le modèle', detail: 'Écoutez, répétez, comparez votre prononciation', skill: 'speaking', icon: 'repeat-outline', href: '/practice/shadowing' },
  { title: 'Dialogue guidé', detail: 'Répondez à l’examinateur, avec des indices si vous bloquez', skill: 'speaking', icon: 'chatbubbles-outline', href: '/practice/dialogue' },
];

export default function Practice() {
  const t = useTheme();
  const styles = useStyles();
  return (
    <Screen>
      {SKILLS.map((s) => (
        <Pressable key={s.title} onPress={() => router.push(s.href)} accessibilityRole="button" style={({ pressed }) => pressed && { opacity: 0.85 }}>
          <Card style={styles.row}>
            <View style={[styles.icon, { backgroundColor: t.skills[s.skill].bg }]}>
              <Ionicons name={s.icon} size={24} color={t.id === 'cahier' ? t.colors.ink : t.skills[s.skill].color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{s.title}</Text>
              <Body muted>{s.detail}</Body>
            </View>
            <Ionicons name="chevron-forward" size={20} color={t.colors.muted} />
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 46,
    height: 46,
    borderRadius: t.id === 'cahier' ? 10 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: t.id === 'cahier' ? 2 : 0,
    borderColor: t.colors.ink,
  },
  title: { fontFamily: t.headUpper ? 'body' : 'head', fontSize: 18, fontWeight: '700', color: t.colors.ink },
}));
