import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, colors, H2, Screen } from '../../components/ui';
import { getDeckStats, getOpenMistakes, getSkillStats, type Skill, type SkillStats } from '../../lib/db';

const LABELS: Record<Skill, string> = {
  vocab: 'Vocabulaire',
  listening: 'Compréhension orale',
  reading: 'Compréhension écrite',
  writing: 'Expression écrite',
  speaking: 'Expression orale',
};

export default function Progress() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState<SkillStats[]>([]);
  const [deck, setDeck] = useState({ learned: 0, due: 0, total: 0 });
  const [mistakes, setMistakes] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getSkillStats(db).then(setStats);
      getDeckStats(db).then(setDeck);
      getOpenMistakes(db).then((m) => setMistakes(m.length));
    }, [db]),
  );

  const bySkill = new Map(stats.map((s) => [s.skill, s]));

  return (
    <Screen>
      <Card>
        <H2>Mes erreurs</H2>
        <Body muted>{mistakes > 0 ? `${mistakes} question(s) à revoir, avec l'explication` : 'Aucune erreur à revoir'}</Body>
        <Button title="Revoir mes erreurs" variant="outline" onPress={() => router.push('/mistakes')} />
      </Card>
      <Card>
        <H2>Mes enregistrements</H2>
        <Body muted>Réécoutez vos réponses orales et comparez vos prises d’une même phrase.</Body>
        <Button title="Écouter mes enregistrements" variant="outline" onPress={() => router.push('/recordings')} />
      </Card>
      <Card>
        <H2>Vocabulaire</H2>
        <Body>
          {deck.learned ?? 0} mot(s) appris sur {deck.total} · {deck.due ?? 0} à revoir
        </Body>
      </Card>
      {(['listening', 'reading', 'writing', 'speaking'] as Skill[]).map((skill) => {
        const s = bySkill.get(skill);
        const graded = skill === 'listening' || skill === 'reading';
        const pct = s && s.total > 0 ? Math.round((100 * s.score) / s.total) : null;
        return (
          <Card key={skill}>
            <H2>{LABELS[skill]}</H2>
            <Body muted>{s ? `${s.attempts} exercice(s) terminé(s)` : 'Pas encore commencé'}</Body>
            {graded && pct !== null && (
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
                <Text style={styles.barLabel}>{pct} % de bonnes réponses</Text>
              </View>
            )}
          </Card>
        );
      })}
      <Body muted>Les tests de niveau et l'estimation NCLC arrivent dans une prochaine version.</Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  barTrack: { height: 28, borderRadius: 8, backgroundColor: colors.bg, overflow: 'hidden', justifyContent: 'center' },
  barFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#C9D6FA' },
  barLabel: { paddingHorizontal: 10, color: colors.ink, fontWeight: '600' },
});
