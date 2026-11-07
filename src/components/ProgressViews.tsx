import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Skill } from '../lib/db';
import { formatMinutes, type Day, type WordTiers } from '../lib/stats';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import { StudyTimeCard, WordsCard } from './StatsCards';
import { Mimi } from './TodayViews';
import { Body, Screen, tap } from './ui';

// One row per TCF skill: time spent, its share of the four, and how it went.
export type SkillRow = { skill: Skill; title: string; minutes: number; share: number; attempts: number; accuracy: number | null };

export type ProgressData = {
  days: Day[];
  streak: number;
  tracking: boolean;
  skills: SkillRow[];
  tiers: WordTiers;
  newWords: number;
  due: number;
  mistakes: number;
};

type IconName = ComponentProps<typeof Ionicons>['name'];
const SKILL_ICON: Record<Skill, IconName> = {
  vocab: 'albums-outline',
  listening: 'headset-outline',
  reading: 'book-outline',
  writing: 'create-outline',
  speaking: 'mic-outline',
};

type Link = { title: string; detail: string; icon: IconName; href: Href; badge?: number };

function links(mistakes: number, themeName: string): { main: Link[]; settings: Link[] } {
  return {
    main: [
      {
        title: 'Mes erreurs',
        detail: mistakes > 0 ? 'Les questions à revoir, avec l’explication' : 'Aucune erreur à revoir',
        icon: 'alert-circle-outline',
        href: '/mistakes',
        badge: mistakes,
      },
      { title: 'Mes enregistrements', detail: 'Réécoutez et comparez vos réponses orales', icon: 'mic-circle-outline', href: '/recordings' },
    ],
    settings: [
      { title: 'Style de l’appli', detail: `Actuel : ${themeName}`, icon: 'color-palette-outline', href: '/style' },
      { title: 'Voix française', detail: 'La voix qui lit les phrases', icon: 'volume-medium-outline', href: '/voice' },
    ],
  };
}

const today = (days: Day[]) => days.at(-1)?.minutes ?? 0;
const week = (days: Day[]) => days.reduce((sum, d) => sum + d.minutes, 0);
const daysLabel = (n: number) => `${n} jour${n > 1 ? 's' : ''}`;
// What the skill row says about results: accuracy for the graded skills, otherwise how many were done.
const result = (r: SkillRow) =>
  r.accuracy !== null ? `${r.accuracy} % juste` : r.attempts > 0 ? `${r.attempts} exercice${r.attempts > 1 ? 's' : ''}` : 'Pas encore commencé';

function go(href: Href) {
  tap();
  router.push(href);
}

// Progrès draws its own title, so it has no header bar: keep clear of the status bar.
function TopInset() {
  return <View style={{ height: useSafeAreaInsets().top }} />;
}

const FOOTNOTE = 'Les tests de niveau et l’estimation NCLC arrivent dans une prochaine version.';

// ───────────────────────────── Bonbon ─────────────────────────────
// Mimi cheers you on, three bubbles sum up the week, and the four skills are candy tiles.

export function ProgressBonbon(d: ProgressData) {
  const t = useTheme();
  const s = useBonbon();
  const { main, settings } = links(d.mistakes, t.name);
  return (
    <Screen>
      <TopInset />
      <View style={s.hello}>
        <Mimi size={56} />
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Tes progrès</Text>
          <Text style={s.sub}>
            {d.streak > 1 ? `Déjà ${d.streak} jours de suite, continue !` : d.streak === 1 ? 'Une journée de faite, on recommence demain !' : 'Un exercice et ta série commence !'}
          </Text>
        </View>
      </View>

      <View style={s.hero}>
        {[
          { v: formatMinutes(today(d.days)), l: 'aujourd’hui' },
          { v: daysLabel(d.streak), l: 'de suite' },
          { v: formatMinutes(week(d.days)), l: 'sur 7 jours' },
        ].map((x) => (
          <View key={x.l} style={s.bubble}>
            <Text style={s.bubbleValue} numberOfLines={1} adjustsFontSizeToFit>
              {x.v}
            </Text>
            <Text style={s.bubbleLabel}>{x.l}</Text>
          </View>
        ))}
      </View>

      <StudyTimeCard days={d.days} streak={d.streak} tracking={d.tracking} title="Ta semaine" hideStats />

      <Text style={s.section}>Tes 4 épreuves</Text>
      <Text style={s.note}>Au TCF, elles comptent autant : vise environ 25 % du temps pour chacune.</Text>
      <View style={s.grid}>
        {d.skills.map((r) => {
          const look = t.skills[r.skill];
          return (
            <View key={r.skill} style={[s.tile, { backgroundColor: look.bg }]}>
              <View style={s.tileTop}>
                <View style={s.tileIcon}>
                  <Ionicons name={SKILL_ICON[r.skill]} size={20} color={look.color} />
                </View>
                <Text style={[s.share, { color: look.color }]}>{r.share} %</Text>
              </View>
              <Text style={[s.tileTitle, { color: look.ink }]} numberOfLines={2}>
                {r.title}
              </Text>
              <Text style={[s.tileMinutes, { color: look.ink }]}>{formatMinutes(r.minutes)}</Text>
              <Text style={[s.chip, { color: look.color }]}>{result(r)}</Text>
            </View>
          );
        })}
      </View>

      <WordsCard tiers={d.tiers} newThisWeek={d.newWords} due={d.due} />

      <Text style={s.section}>Pour aller plus loin</Text>
      {main.map((l) => (
        <BonbonRow key={l.title} link={l} />
      ))}
      <Text style={s.section}>Réglages</Text>
      {settings.map((l) => (
        <BonbonRow key={l.title} link={l} />
      ))}
      <Body muted>{FOOTNOTE}</Body>
    </Screen>
  );
}

function BonbonRow({ link }: { link: Link }) {
  const t = useTheme();
  const s = useBonbon();
  return (
    <Pressable accessibilityRole="button" onPress={() => go(link.href)} style={({ pressed }) => [s.row, pressed && { opacity: 0.85 }]}>
      <View style={s.rowIcon}>
        <Ionicons name={link.icon} size={22} color={t.colors.accentText} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{link.title}</Text>
        <Text style={s.rowDetail}>{link.detail}</Text>
      </View>
      {link.badge ? <Text style={s.badge}>{link.badge}</Text> : null}
      <Ionicons name="chevron-forward" size={20} color={t.colors.muted} />
    </Pressable>
  );
}

const useBonbon = makeStyles((t) => ({
  hello: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 2 },
  title: { fontFamily: 'head', fontWeight: '800', fontSize: 28, lineHeight: 32, color: t.colors.ink },
  sub: { fontSize: 15, fontWeight: '700', color: t.colors.muted },
  hero: { flexDirection: 'row', gap: 8, backgroundColor: '#7A5AF0', borderRadius: 30, padding: 14, boxShadow: '0px 10px 24px rgba(106, 69, 224, 0.25)' },
  bubble: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 22, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  bubbleValue: { fontFamily: 'head', fontWeight: '800', fontSize: 22, color: '#FFFFFF' },
  bubbleLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.85)' },
  section: { fontFamily: 'head', fontWeight: '800', fontSize: 21, color: t.colors.ink, marginTop: 6 },
  note: { fontSize: 14, lineHeight: 19, fontWeight: '700', color: t.colors.muted, marginTop: -8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47.5%', flexGrow: 1, borderRadius: 26, padding: 14, gap: 4 },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  tileIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  share: { fontSize: 15, fontWeight: '800' },
  tileTitle: { fontFamily: 'head', fontWeight: '700', fontSize: 16, lineHeight: 19 },
  tileMinutes: { fontFamily: 'head', fontWeight: '800', fontSize: 24, lineHeight: 30 },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: t.colors.card,
    borderRadius: 999,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 16,
    boxShadow: t.card.boxShadow,
  },
  rowIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: t.colors.soft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: 'head', fontWeight: '700', fontSize: 17, color: t.colors.ink },
  rowDetail: { fontSize: 13, fontWeight: '700', color: t.colors.muted },
  badge: {
    minWidth: 26,
    textAlign: 'center',
    backgroundColor: '#FF8DC2',
    color: t.colors.ink,
    borderRadius: 13,
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
  },
}));

// ───────────────────────────── Cahier ─────────────────────────────
// A school report: big title with a sticker, a bulletin table of the four skills, numbered link cards.

const CAHIER_ROW_COLORS = ['#FF6B9A', '#2EC4B6', '#FFD43B', '#4D7CFE'];

export function ProgressCahier(d: ProgressData) {
  const t = useTheme();
  const s = useCahier();
  const { main, settings } = links(d.mistakes, t.name);
  return (
    <Screen>
      <TopInset />
      <View style={s.hello}>
        <Text style={s.title}>Mes{'\n'}progrès.</Text>
        <Text style={s.sticker}>{daysLabel(d.streak).toUpperCase()}</Text>
      </View>

      <View style={s.banner}>
        <View>
          <Text style={s.bannerLabel}>AUJOURD’HUI</Text>
          <Text style={s.bannerValue}>{formatMinutes(today(d.days))}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.bannerLabel}>SUR 7 JOURS</Text>
          <Text style={s.bannerValue}>{formatMinutes(week(d.days))}</Text>
        </View>
      </View>

      <View style={s.bulletin}>
        <View style={s.bulletinHead}>
          <Text style={s.bulletinTitle}>Bulletin</Text>
          <Text style={s.bulletinHint}>objectif : 25 % chacune</Text>
        </View>
        {d.skills.map((r) => (
          <View key={r.skill} style={s.line}>
            <View style={[s.marker, { backgroundColor: t.skills[r.skill].color }]} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={s.lineHead}>
                <Text style={s.lineTitle} numberOfLines={1}>
                  {r.title}
                </Text>
                <Text style={s.grade}>{r.accuracy !== null ? `${r.accuracy}%` : r.attempts > 0 ? `×${r.attempts}` : '—'}</Text>
              </View>
              <View style={s.track}>
                {r.share > 0 && <View style={[s.fill, { width: `${r.share}%`, backgroundColor: t.skills[r.skill].color }]} />}
                <View style={s.tick} />
              </View>
              <Text style={s.lineDetail}>
                {formatMinutes(r.minutes)} · {r.share} % du temps · {result(r)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <StudyTimeCard days={d.days} streak={d.streak} tracking={d.tracking} title="Ma semaine" hideStats />
      <WordsCard tiers={d.tiers} newThisWeek={d.newWords} due={d.due} />

      {[...main, ...settings].map((l, i) => (
        <Pressable
          key={l.title}
          accessibilityRole="button"
          onPress={() => go(l.href)}
          style={({ pressed }) => [s.card, { backgroundColor: CAHIER_ROW_COLORS[i % CAHIER_ROW_COLORS.length] }, pressed && s.pressed]}
        >
          <Text style={s.number}>{String(i + 1).padStart(2, '0')}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>{l.title}</Text>
            <Text style={s.cardDetail}>{l.detail}</Text>
          </View>
          {l.badge ? <Text style={s.badge}>{l.badge}</Text> : null}
          <Text style={s.arrow}>→</Text>
        </Pressable>
      ))}
      <Body muted>{FOOTNOTE}</Body>
    </Screen>
  );
}

const useCahier = makeStyles((t) => ({
  hello: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: 'head', fontSize: 34, lineHeight: 36, color: t.colors.ink },
  sticker: {
    backgroundColor: '#2EC4B6',
    borderWidth: 2.5,
    borderColor: t.colors.ink,
    boxShadow: `3px 3px 0px ${t.colors.ink}`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: t.colors.ink,
    transform: [{ rotate: '-4deg' }],
    marginTop: 4,
  },
  banner: { backgroundColor: t.colors.ink, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' },
  bannerLabel: { fontSize: 12, fontWeight: '700', color: t.colors.bg, letterSpacing: 1 },
  bannerValue: { fontFamily: 'head', fontSize: 24, color: '#FFD43B', textTransform: 'none' },
  bulletin: {
    backgroundColor: t.colors.card,
    borderWidth: 2.5,
    borderColor: t.colors.ink,
    borderRadius: 14,
    boxShadow: `4px 4px 0px ${t.colors.ink}`,
    overflow: 'hidden',
  },
  bulletinHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFD43B',
    borderBottomWidth: 2.5,
    borderBottomColor: t.colors.ink,
  },
  bulletinTitle: { fontFamily: 'head', fontSize: 18, color: t.colors.ink },
  bulletinHint: { fontSize: 13, fontWeight: '600', color: t.colors.ink },
  line: { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1.5, borderBottomColor: '#E9E2CF' },
  marker: { width: 14, height: 14, marginTop: 4, borderWidth: 2, borderColor: t.colors.ink },
  lineHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  lineTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: t.colors.ink },
  grade: { fontFamily: 'head', fontSize: 22, color: t.colors.ink },
  track: { height: 12, borderWidth: 2, borderColor: t.colors.ink, backgroundColor: t.colors.card },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  tick: { position: 'absolute', left: '25%', top: -4, bottom: -4, width: 2, backgroundColor: t.colors.ink },
  lineDetail: { fontSize: 13, fontWeight: '500', color: t.colors.muted },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2.5,
    borderColor: t.colors.ink,
    borderRadius: 14,
    boxShadow: `4px 4px 0px ${t.colors.ink}`,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pressed: { boxShadow: `0px 0px 0px ${t.colors.ink}`, transform: [{ translateX: 4 }, { translateY: 4 }] },
  number: { fontFamily: 'head', fontSize: 24, width: 34, color: t.colors.ink },
  cardTitle: { fontSize: 17, fontWeight: '700', color: t.colors.ink },
  cardDetail: { fontSize: 13, fontWeight: '500', color: t.colors.ink },
  badge: {
    minWidth: 28,
    textAlign: 'center',
    backgroundColor: t.colors.card,
    borderWidth: 2,
    borderColor: t.colors.ink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 14,
    fontWeight: '700',
    color: t.colors.ink,
  },
  arrow: { fontFamily: 'head', fontSize: 20, color: t.colors.ink },
}));

// ───────────────────────────── Métro ─────────────────────────────
// A departure board for the numbers, one metro line per skill, and the links as stations on a list.

export function ProgressMetro(d: ProgressData) {
  const t = useTheme();
  const s = useMetro();
  const { main, settings } = links(d.mistakes, t.name);
  return (
    <Screen>
      <TopInset />
      <View style={s.hello}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={s.kicker}>Tableau de bord</Text>
          <Text style={s.title}>Tes progrès</Text>
        </View>
        <View style={s.ticket}>
          <Ionicons name="ticket-outline" size={18} color={t.colors.onCta} />
          <Text style={s.ticketText}>{daysLabel(d.streak)}</Text>
        </View>
      </View>

      <View style={s.board}>
        {[
          { v: formatMinutes(today(d.days)), l: 'Aujourd’hui' },
          { v: `${d.streak} j`, l: 'Série' },
          { v: formatMinutes(week(d.days)), l: '7 jours' },
        ].map((x, i) => (
          <View key={x.l} style={[s.cell, i > 0 && s.cellSep]}>
            <Text style={s.cellLabel}>{x.l}</Text>
            <Text style={s.cellValue} numberOfLines={1} adjustsFontSizeToFit>
              {x.v}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <View style={s.cardHead}>
          <Text style={s.cardTitle}>Les quatre lignes</Text>
          <Text style={s.cardHint}>repère : 25 %</Text>
        </View>
        {d.skills.map((r, i) => {
          const look = t.skills[r.skill];
          return (
            <View key={r.skill} style={s.lineRow}>
              <View style={[s.lineBadge, { backgroundColor: look.color }]}>
                <Text style={s.lineBadgeText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <View style={s.lineHead}>
                  <Text style={s.lineTitle} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Text style={[s.lineMinutes, { color: look.color }]}>{formatMinutes(r.minutes)}</Text>
                </View>
                <View style={s.rail}>
                  {r.share > 0 && <View style={[s.railFill, { width: `${r.share}%`, backgroundColor: look.color }]} />}
                  <View style={s.railMark} />
                </View>
                <Text style={s.lineDetail}>
                  {r.share} % du temps · {result(r)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <StudyTimeCard days={d.days} streak={d.streak} tracking={d.tracking} title="Cette semaine" hideStats />
      <WordsCard tiers={d.tiers} newThisWeek={d.newWords} due={d.due} />

      <MetroList title="Correspondances" items={main} />
      <MetroList title="Réglages" items={settings} />
      <Body muted>{FOOTNOTE}</Body>
    </Screen>
  );
}

function MetroList({ title, items }: { title: string; items: Link[] }): ReactNode {
  const t = useTheme();
  const s = useMetro();
  return (
    <View style={{ gap: 8 }}>
      <Text style={s.kicker}>{title}</Text>
      <View style={s.list}>
        {items.map((l, i) => (
          <Pressable
            key={l.title}
            accessibilityRole="button"
            onPress={() => go(l.href)}
            style={({ pressed }) => [s.listRow, i > 0 && s.listSep, pressed && { backgroundColor: t.colors.soft }]}
          >
            <View style={s.listIcon}>
              <Ionicons name={l.icon} size={20} color={t.colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.listTitle}>{l.title}</Text>
              <Text style={s.listDetail}>{l.detail}</Text>
            </View>
            {l.badge ? <Text style={s.badge}>{l.badge}</Text> : null}
            <Ionicons name="chevron-forward" size={20} color={t.colors.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const useMetro = makeStyles((t) => ({
  hello: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  kicker: { fontSize: 13, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase', color: t.colors.muted },
  title: { fontFamily: 'head', fontWeight: '700', fontSize: 30, lineHeight: 34, color: t.colors.ink },
  ticket: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: t.colors.cta, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12 },
  ticketText: { fontSize: 14, fontWeight: '800', color: t.colors.onCta },
  board: { flexDirection: 'row', backgroundColor: t.colors.ink, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 6 },
  cell: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 6 },
  cellSep: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' },
  cellLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' },
  cellValue: { fontFamily: 'head', fontWeight: '700', fontSize: 24, color: t.colors.cta },
  card: { backgroundColor: t.colors.card, borderWidth: 2, borderColor: t.colors.border, borderRadius: 16, padding: 16, gap: 16 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontFamily: 'head', fontWeight: '700', fontSize: 20, color: t.colors.ink },
  cardHint: { fontSize: 13, fontWeight: '700', color: t.colors.muted },
  lineRow: { flexDirection: 'row', gap: 12 },
  lineBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  lineBadgeText: { fontFamily: 'head', fontWeight: '700', fontSize: 15, color: '#FFFFFF' },
  lineHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  lineTitle: { flex: 1, fontFamily: 'head', fontWeight: '600', fontSize: 17, color: t.colors.ink },
  lineMinutes: { fontSize: 15, fontWeight: '800' },
  rail: { height: 6, borderRadius: 99, backgroundColor: t.colors.track },
  railFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 99 },
  railMark: { position: 'absolute', left: '25%', top: -4, width: 3, height: 14, marginLeft: -1.5, borderRadius: 2, backgroundColor: t.colors.ink },
  lineDetail: { fontSize: 13, fontWeight: '600', color: t.colors.muted },
  list: { backgroundColor: t.colors.card, borderWidth: 2, borderColor: t.colors.border, borderRadius: 16, overflow: 'hidden' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  listSep: { borderTopWidth: 2, borderTopColor: t.colors.border },
  listIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: t.colors.soft, alignItems: 'center', justifyContent: 'center' },
  listTitle: { fontFamily: 'head', fontWeight: '600', fontSize: 17, color: t.colors.ink },
  listDetail: { fontSize: 13, fontWeight: '600', color: t.colors.muted },
  badge: {
    minWidth: 26,
    textAlign: 'center',
    backgroundColor: t.colors.cta,
    color: t.colors.onCta,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
  },
}));
