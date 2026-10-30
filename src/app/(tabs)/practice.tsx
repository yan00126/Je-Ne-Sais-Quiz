import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Card, colors, Screen } from '../../components/ui';

const SKILLS: { title: string; detail: string; icon: ComponentProps<typeof Ionicons>['name']; href: Href }[] = [
  { title: 'Compréhension orale', detail: 'Écoutez un document, répondez aux questions', icon: 'headset-outline', href: '/practice/listening' },
  { title: 'Compréhension écrite', detail: 'Lisez un texte, répondez aux questions', icon: 'book-outline', href: '/practice/reading' },
  { title: 'Expression écrite', detail: 'Tâches 1, 2 et 3 avec minuterie et compteur de mots', icon: 'create-outline', href: '/practice/writing' },
  { title: 'Expression orale', detail: 'Tâches 1, 2 et 3 enregistrées', icon: 'mic-outline', href: '/practice/speaking' },
  { title: 'Répéter après le modèle', detail: 'Écoutez, répétez, comparez votre prononciation', icon: 'repeat-outline', href: '/practice/shadowing' },
  { title: 'Dialogue guidé', detail: 'Répondez à l’examinateur, avec des indices si vous bloquez', icon: 'chatbubbles-outline', href: '/practice/dialogue' },
];

export default function Practice() {
  return (
    <Screen>
      {SKILLS.map((s) => (
        <Pressable key={s.title} onPress={() => router.push(s.href)}>
          <Card style={styles.row}>
            <Ionicons name={s.icon} size={28} color={colors.blue} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{s.title}</Text>
              <Body muted>{s.detail}</Body>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink },
});
