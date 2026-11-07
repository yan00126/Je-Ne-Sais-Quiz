import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { TodayBonbon, TodayCahier, TodayMetro, type TodayData } from '../../components/TodayViews';
import { LISTENING } from '../../data/comprehension';
import { getActiveDays, getLevelState, getStudyQueue, getTodayCounts } from '../../lib/db';
import { stepProgress, todaysPlan } from '../../lib/plan';
import { streak } from '../../lib/stats';
import { useTheme } from '../../theme/ThemeProvider';

export default function Today() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const [data, setData] = useState<TodayData | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const vocabLeft = (await getStudyQueue(db)).length;
        const counts = await getTodayCounts(db);
        const now = new Date();
        const plan = todaysPlan(now);
        const steps = plan.map((step) => {
          const p = stepProgress(step, counts, vocabLeft);
          const n = step.skill === 'vocab' ? (p.done ? 1 : 0) : Math.min(counts[step.skill] ?? 0, step.target);
          return { step, done: p.done, label: p.label, n, target: step.skill === 'vocab' ? 1 : step.target };
        });
        const level = (await getLevelState(db, 'listening', LISTENING).catch(() => null))?.level ?? null;
        setData({
          steps,
          minutes: plan.reduce((sum, s) => sum + s.minutes, 0),
          streak: streak(await getActiveDays(db), now.getTime()),
          level,
          now,
        });
      })();
    }, [db]),
  );

  if (!data) return null;
  if (theme.id === 'cahier') return <TodayCahier {...data} />;
  if (theme.id === 'metro') return <TodayMetro {...data} />;
  return <TodayBonbon {...data} />;
}
