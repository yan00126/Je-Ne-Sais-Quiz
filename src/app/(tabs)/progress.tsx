import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ProgressBonbon, ProgressCahier, ProgressMetro, type ProgressData } from '../../components/ProgressViews';
import {
  getActiveDays,
  getDeckStats,
  getOpenMistakes,
  getSkillStats,
  getStudySessions,
  getWordTiers,
  newWordsThisWeek,
  type Skill,
} from '../../lib/db';
import { lastDays, minutesBySkill, streak } from '../../lib/stats';
import { useTheme } from '../../theme/ThemeProvider';

const FOUR: { skill: Skill; title: string }[] = [
  { skill: 'listening', title: 'Compréhension orale' },
  { skill: 'reading', title: 'Compréhension écrite' },
  { skill: 'writing', title: 'Expression écrite' },
  { skill: 'speaking', title: 'Expression orale' },
];

export default function Progress() {
  const theme = useTheme();
  const db = useSQLiteContext();
  const [data, setData] = useState<ProgressData | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [stats, deck, mistakes, sessions, activeDays, tiers, newWords] = await Promise.all([
          getSkillStats(db),
          getDeckStats(db),
          getOpenMistakes(db),
          getStudySessions(db),
          getActiveDays(db),
          getWordTiers(db),
          newWordsThisWeek(db),
        ]);
        const now = Date.now();
        const bySkill = new Map(stats.map((s) => [s.skill, s]));
        const minutes = new Map(minutesBySkill(sessions).map((r) => [r.skill, r.minutes]));
        const sum = FOUR.reduce((n, f) => n + (minutes.get(f.skill) ?? 0), 0);
        setData({
          days: lastDays(sessions, now),
          streak: streak(activeDays, now),
          tracking: sessions.length > 0,
          skills: FOUR.map(({ skill, title }) => {
            const s = bySkill.get(skill);
            const m = minutes.get(skill) ?? 0;
            const graded = skill === 'listening' || skill === 'reading';
            return {
              skill,
              title,
              minutes: m,
              share: sum > 0 ? Math.round((100 * m) / sum) : 0,
              attempts: s?.attempts ?? 0,
              accuracy: graded && s && s.total > 0 ? Math.round((100 * s.score) / s.total) : null,
            };
          }),
          tiers,
          newWords,
          due: deck.due ?? 0,
          mistakes: mistakes.length,
        });
      })();
    }, [db]),
  );

  if (!data) return null;
  if (theme.id === 'cahier') return <ProgressCahier {...data} />;
  if (theme.id === 'metro') return <ProgressMetro {...data} />;
  return <ProgressBonbon {...data} />;
}
