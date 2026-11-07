import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Skill } from '../lib/db';
import { DAILY_GOAL_MIN, formatMinutes, type Day, type WordTiers } from '../lib/stats';
import { Card, H2, tint } from './ui';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import type { Theme } from '../theme/themes';

// One blue, light to dark: the further along a word is, the darker it gets.
const ramp = (t: Theme) => ({ learning: tint(t.colors.accent, 0.3), known: tint(t.colors.accent, 0.62), mastered: t.colors.accent, unseen: t.id === 'cahier' ? '#E9E2CF' : t.colors.track });

const WEEKDAY = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const LONG_DAY = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

function Stat({ value, label }: { value: string; label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const CHART_H = 120;

export function StudyTimeCard({ days, streak, tracking }: { days: Day[]; streak: number; tracking: boolean }) {
  const t = useTheme();
  const styles = useStyles();
  const [picked, setPicked] = useState(days.length - 1);
  const today = days.at(-1)?.minutes ?? 0;
  const week = days.reduce((sum, d) => sum + d.minutes, 0);
  const top = Math.max(DAILY_GOAL_MIN, ...days.map((d) => d.minutes));
  const sel = days[picked] ?? days.at(-1);
  return (
    <Card>
      <H2>Temps d’étude</H2>
      <View style={styles.statRow}>
        <Stat value={formatMinutes(today)} label="aujourd’hui" />
        <Stat value={`${streak} j`} label={streak > 1 ? 'jours de suite' : 'jour de suite'} />
        <Stat value={formatMinutes(week)} label="sur 7 jours" />
      </View>
      {sel && (
        <Text style={styles.caption}>
          {LONG_DAY.format(sel.date)} : <Text style={styles.captionStrong}>{formatMinutes(sel.minutes)}</Text>
        </Text>
      )}
      <View style={[styles.chart, { height: CHART_H }]}>
        <View style={[styles.goalLine, { bottom: (DAILY_GOAL_MIN / top) * CHART_H }]}>
          <Text style={styles.goalLabel}>{DAILY_GOAL_MIN} min</Text>
        </View>
        {days.map((d, i) => (
          <Pressable
            key={d.key}
            style={styles.barSlot}
            onPress={() => setPicked(i)}
            accessibilityLabel={`${LONG_DAY.format(d.date)}, ${formatMinutes(d.minutes)}`}
          >
            <View
              style={[
                styles.bar,
                { height: d.minutes > 0 ? Math.max(4, (d.minutes / top) * CHART_H) : 2 },
                d.minutes === 0 && { backgroundColor: t.colors.border },
                i === picked && styles.barPicked,
              ]}
            />
          </Pressable>
        ))}
      </View>
      <View style={styles.dayRow}>
        {days.map((d, i) => (
          <Text key={d.key} style={[styles.dayLabel, i === days.length - 1 && styles.dayToday]}>
            {WEEKDAY[new Date(d.date).getDay()]}
          </Text>
        ))}
      </View>
      {!tracking && <Text style={styles.note}>Le temps est compté à partir de cette version : faites un exercice pour voir la première barre.</Text>}
    </Card>
  );
}

export function WordsCard({ tiers, newThisWeek, due }: { tiers: WordTiers; newThisWeek: number; due: number }) {
  const t = useTheme();
  const styles = useStyles();
  const total = tiers.unseen + tiers.learning + tiers.known + tiers.mastered;
  const learned = tiers.known + tiers.mastered;
  const parts = [
    { key: 'mastered', label: 'Maîtrisés', hint: 'retenus 3 semaines ou plus', n: tiers.mastered, color: ramp(t).mastered },
    { key: 'known', label: 'Appris', hint: 'retenus, encore à consolider', n: tiers.known, color: ramp(t).known },
    { key: 'learning', label: 'En cours', hint: 'vus, pas encore retenus', n: tiers.learning, color: ramp(t).learning },
    { key: 'unseen', label: 'Pas encore vus', hint: '', n: tiers.unseen, color: ramp(t).unseen },
  ];
  return (
    <Card>
      <H2>Vocabulaire</H2>
      <View style={styles.statRow}>
        <Stat value={String(learned)} label={`mots appris sur ${total}`} />
        <Stat value={`+${newThisWeek}`} label="nouveaux sur 7 jours" />
        <Stat value={String(due)} label="à revoir maintenant" />
      </View>
      <View style={styles.stack}>
        {parts.map((p) =>
          p.n > 0 ? <View key={p.key} style={{ flex: p.n, backgroundColor: p.color, borderRadius: 4 }} /> : null,
        )}
      </View>
      {parts.map((p) => (
        <View key={p.key} style={styles.legendRow}>
          <View style={[styles.swatch, { backgroundColor: p.color }]} />
          <Text style={styles.legendLabel}>
            {p.label}
            {p.hint ? <Text style={styles.legendHint}> · {p.hint}</Text> : null}
          </Text>
          <Text style={styles.legendValue}>{p.n}</Text>
        </View>
      ))}
    </Card>
  );
}

const SKILL_LABELS: Record<Skill, string> = {
  listening: 'Compréhension orale',
  reading: 'Compréhension écrite',
  writing: 'Expression écrite',
  speaking: 'Expression orale',
  vocab: 'Vocabulaire',
};

// Share of time across the four TCF skills, with a tick at 25 %: the four count equally in the exam.
export function SkillTimeCard({ rows }: { rows: { skill: Skill; minutes: number }[] }) {
  const styles = useStyles();
  const four = rows.filter((r) => r.skill !== 'vocab');
  const vocab = rows.find((r) => r.skill === 'vocab')?.minutes ?? 0;
  const sum = four.reduce((s, r) => s + r.minutes, 0);
  return (
    <Card>
      <H2>Temps par épreuve</H2>
      <Text style={styles.note}>Les quatre épreuves comptent autant au TCF : visez environ 25 % chacune (trait vertical).</Text>
      {four.map((r) => {
        const pct = sum > 0 ? Math.round((100 * r.minutes) / sum) : 0;
        return (
          <View key={r.skill} style={{ gap: 4 }}>
            <View style={styles.skillHead}>
              <Text style={styles.legendLabel}>{SKILL_LABELS[r.skill]}</Text>
              <Text style={styles.legendValue}>
                {formatMinutes(r.minutes)} · {pct} %
              </Text>
            </View>
            <View style={styles.track}>
              {pct > 0 && <View style={[styles.fill, { width: `${pct}%` }]} />}
              <View style={styles.tick} />
            </View>
          </View>
        );
      })}
      <Text style={styles.note}>En plus : {formatMinutes(vocab)} de vocabulaire.</Text>
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  statRow: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: t.id === 'cahier' ? t.colors.bg : t.colors.soft,
    borderRadius: t.radius.field,
    borderWidth: t.id === 'cahier' ? 2 : 0,
    borderColor: t.colors.ink,
    padding: 10,
    gap: 2,
  },
  statValue: { fontFamily: 'head', fontSize: 22, fontWeight: '700', color: t.colors.ink },
  statLabel: { fontSize: 12, lineHeight: 16, color: t.colors.muted },
  caption: { fontSize: 14, color: t.colors.muted, marginTop: 4 },
  captionStrong: { color: t.colors.ink, fontWeight: '700' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, borderBottomWidth: 1, borderBottomColor: t.colors.border },
  goalLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: t.colors.muted },
  goalLabel: { position: 'absolute', right: 0, bottom: 2, fontSize: 11, color: t.colors.muted },
  barSlot: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '60%', maxWidth: 28, backgroundColor: ramp(t).known, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barPicked: { backgroundColor: t.colors.accent },
  dayRow: { flexDirection: 'row', gap: 2 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 12, color: t.colors.muted },
  dayToday: { color: t.colors.ink, fontWeight: '700' },
  note: { fontSize: 13, lineHeight: 18, color: t.colors.muted },
  stack: { flexDirection: 'row', gap: 2, height: 14, marginTop: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  swatch: { width: 12, height: 12, borderRadius: 3 },
  legendLabel: { flex: 1, fontSize: 15, color: t.colors.ink },
  legendHint: { fontSize: 13, color: t.colors.muted },
  legendValue: { fontSize: 15, fontWeight: '600', color: t.colors.ink, fontVariant: ['tabular-nums'] },
  skillHead: { flexDirection: 'row', alignItems: 'baseline' },
  track: { height: 10, borderRadius: 5, backgroundColor: t.colors.track, overflow: 'hidden', borderWidth: t.id === 'cahier' ? 1.5 : 0, borderColor: t.colors.ink },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: t.colors.accent, borderRadius: 5 },
  tick: { position: 'absolute', left: '25%', top: 0, bottom: 0, width: 2, backgroundColor: t.colors.ink },
}));
