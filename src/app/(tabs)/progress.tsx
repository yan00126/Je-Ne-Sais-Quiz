import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Body, Button, Card, H2, Label, Screen, tint } from '../../components/ui';
import { SkillTimeCard, StudyTimeCard, WordsCard } from '../../components/StatsCards';
import {
  getActiveDays,
  getDeckStats,
  getOpenMistakes,
  getSkillStats,
  getStudySessions,
  getWordTiers,
  newWordsThisWeek,
  type Skill,
  type SkillStats,
} from '../../lib/db';
import { lastDays, minutesBySkill, streak, type Session, type WordTiers } from '../../lib/stats';
import { makeStyles, useTheme } from '../../theme/ThemeProvider';

const LABELS: Record<Skill, string> = {
  vocab: 'Vocabulaire',
  listening: 'Compréhension orale',
  reading: 'Compréhension écrite',
  writing: 'Expression écrite',
  speaking: 'Expression orale',
};

export default function Progress() {
  const t = useTheme();
  const styles = useStyles();
  const db = useSQLiteContext();
  const [stats, setStats] = useState<SkillStats[]>([]);
  const [deck, setDeck] = useState({ learned: 0, due: 0, total: 0 });
  const [mistakes, setMistakes] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const [tiers, setTiers] = useState<WordTiers>({ unseen: 0, learning: 0, known: 0, mastered: 0 });
  const [newWords, setNewWords] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getSkillStats(db).then(setStats);
      getDeckStats(db).then(setDeck);
      getOpenMistakes(db).then((m) => setMistakes(m.length));
      getStudySessions(db).then(setSessions);
      getActiveDays(db).then(setActiveDays);
      getWordTiers(db).then(setTiers);
      newWordsThisWeek(db).then(setNewWords);
    }, [db]),
  );

  const bySkill = new Map(stats.map((s) => [s.skill, s]));
  const now = Date.now();

  return (
    <Screen>
      <StudyTimeCard days={lastDays(sessions, now)} streak={streak(activeDays, now)} tracking={sessions.length > 0} />
      <WordsCard tiers={tiers} newThisWeek={newWords} due={deck.due ?? 0} />
      <SkillTimeCard rows={minutesBySkill(sessions)} />
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
      <Label>Réglages</Label>
      <Card>
        <H2>Style de l’appli</H2>
        <Body muted>Actuel : {t.name}. Changez de look à tout moment : votre plan et vos progrès restent les mêmes.</Body>
        <Button title="Changer de style" variant="outline" onPress={() => router.push('/style')} />
      </Card>
      <Card>
        <H2>Voix française</H2>
        <Body muted>Choisissez la voix qui lit les phrases. La meilleure voix installée est choisie automatiquement.</Body>
        <Button title="Choisir la voix" variant="outline" onPress={() => router.push('/voice')} />
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

const useStyles = makeStyles((t) => ({
  barTrack: { height: 28, borderRadius: 8, backgroundColor: t.colors.track, overflow: 'hidden', justifyContent: 'center', borderWidth: t.button === 'brutal' ? 2 : 0, borderColor: t.colors.ink },
  barFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: tint(t.colors.accent, 0.35) },
  barLabel: { paddingHorizontal: 10, color: t.colors.ink, fontWeight: '600' },
}));
