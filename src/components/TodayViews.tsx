import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, Text, View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import type { StepId } from '../lib/db';
import type { Level } from '../lib/level';
import type { Step } from '../lib/plan';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import { GridPaper, tap } from './ui';

// count: short progress for a tile's corner (« 2/3 », « 48 cartes »).
export type StepState = { step: Step; done: boolean; label: string; count: string; n: number; target: number };
export type TodayData = { steps: StepState[]; minutes: number; streak: number; level: Level | null; now: Date };

type IconName = ComponentProps<typeof Ionicons>['name'];
const STEP_ICON: Record<StepId, IconName> = {
  vocab: 'albums-outline',
  listening: 'headset-outline',
  reading: 'book-outline',
  writing: 'create-outline',
  speaking: 'mic-outline',
  shadowing: 'repeat-outline',
};

const WEEKDAY = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const days = (n: number) => `${n} jour${n > 1 ? 's' : ''}`;

// The first step not done yet; the « go » button opens it.
function nextStep(steps: StepState[]) {
  return steps.findIndex((s) => !s.done);
}

function go(href: Href) {
  tap();
  router.push(href);
}

// The page: scrolls on small phones, and lets the « go » button sit at the bottom on tall ones.
function Page({ style, paper, children }: { style: ViewStyle | ViewStyle[]; paper?: boolean; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {paper && <GridPaper />}
      <ScrollView contentContainerStyle={style}>{children}</ScrollView>
    </View>
  );
}

// A small press effect shared by the tiles and rows.
const pressed = ({ pressed: p }: { pressed: boolean }) => (p ? { opacity: 0.85, transform: [{ scale: 0.98 }] } : null);

// ───────────────────────────── Bonbon ─────────────────────────────

// Mimi, the Bonbon mascot.
export function Mimi({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d="M8 40c0-16 10-28 24-28s24 12 24 28c0 8-6 12-12 12H20C13 52 8 48 8 40z" fill="#FF8DC2" />
      <Circle cx={24} cy={34} r={5} fill="#FFFFFF" />
      <Circle cx={40} cy={34} r={5} fill="#FFFFFF" />
      <Circle cx={25} cy={35} r={2.5} fill="#2A2350" />
      <Circle cx={41} cy={35} r={2.5} fill="#2A2350" />
      <Path d="M27 43c3 3 7 3 10 0" stroke="#2A2350" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Circle cx={17} cy={42} r={3} fill="#FF5FA8" opacity={0.6} />
      <Circle cx={47} cy={42} r={3} fill="#FF5FA8" opacity={0.6} />
      <Path d="M22 14c2-6 8-8 10-4" stroke="#2A2350" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function TodayBonbon({ steps, minutes, streak, level }: TodayData) {
  const t = useTheme();
  const s = useBonbon();
  const top = useSafeAreaInsets().top;
  const done = steps.filter((x) => x.done).length;
  const next = nextStep(steps);
  return (
    <Page style={[s.screen, { paddingTop: top + 16 }]}>
      <View style={s.hello}>
        <Mimi />
        <View style={{ flex: 1 }}>
          <Text style={s.helloTitle}>Salut Felix !</Text>
          <Text style={s.helloSub}>Mimi t’a préparé {minutes} min de français</Text>
        </View>
      </View>

      <View style={s.plan}>
        <View style={s.planHead}>
          <Text style={s.planTitle}>Plan du jour</Text>
          <Text style={s.planCount}>
            {done} sur {steps.length}
          </Text>
        </View>
        <View style={s.segments}>
          {steps.map((x) => (
            <View key={x.step.id} style={s.segment}>
              <View style={[s.segmentFill, { width: `${(100 * x.n) / x.target}%`, backgroundColor: x.done ? '#7CF0C8' : '#FFFFFF' }]} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Text style={s.chip}>Série : {days(streak)}</Text>
          {level && <Text style={s.chip}>Niveau {level}</Text>}
        </View>
      </View>

      <View style={s.grid}>
        {steps.map((x, i) => {
          const look = t.skills[x.step.skill];
          // An odd last tile spans the whole row, so it has no neighbour to line up with.
          const alone = i === steps.length - 1 && steps.length % 2 === 1;
          return (
            <Pressable
              key={x.step.id}
              onPress={() => go(x.step.href)}
              accessibilityRole="button"
              accessibilityLabel={`${x.step.title}, ${x.label}`}
              style={(p) => [s.tile, { backgroundColor: look.bg }, pressed(p)]}
            >
              <View style={s.tileTop}>
                <View style={s.tileIcon}>
                  <Ionicons name={STEP_ICON[x.step.id]} size={22} color={look.color} />
                </View>
                {x.done ? (
                  <View style={[s.check, { backgroundColor: look.color }]}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                ) : (
                  <Text style={[s.tileCount, { color: look.color }]}>{x.count}</Text>
                )}
              </View>
              <View>
                <Text style={[s.tileTitle, !alone && s.tileTitlePair, { color: look.ink }]} numberOfLines={2}>
                  {x.step.title}
                </Text>
                <Text style={[s.tileDetail, { color: look.color }]} numberOfLines={1}>
                  {x.done ? 'Terminé' : x.step.short} · {x.step.minutes} min
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => go(next >= 0 ? steps[next].step.href : '/practice')}
        style={({ pressed: p }) => [s.cta, p && { transform: [{ translateY: 2 }], borderBottomWidth: 2 }]}
      >
        <Text style={s.ctaText}>{next >= 0 ? (done === 0 ? 'C’est parti !' : 'On continue !') : 'Tout est fait, bravo !'}</Text>
      </Pressable>
    </Page>
  );
}

const useBonbon = makeStyles((t) => ({
  screen: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 12, gap: 16 },
  hello: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  helloTitle: { fontFamily: 'head', fontWeight: '800', fontSize: 28, lineHeight: 32, color: t.colors.ink },
  helloSub: { fontSize: 15, fontWeight: '700', color: t.colors.muted },
  plan: { backgroundColor: '#7A5AF0', borderRadius: 30, padding: 20, gap: 12, boxShadow: '0px 10px 24px rgba(106, 69, 224, 0.25)' },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  planTitle: { fontFamily: 'head', fontWeight: '700', fontSize: 20, color: '#FFFFFF' },
  planCount: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 12, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  segmentFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 99 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    overflow: 'hidden',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47.5%', flexGrow: 1, minHeight: 140, borderRadius: 26, padding: 16, justifyContent: 'space-between', gap: 12 },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tileIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tileCount: { fontSize: 15, fontWeight: '800' },
  tileTitle: { fontFamily: 'head', fontWeight: '700', fontSize: 18, lineHeight: 21 },
  // Tiles side by side reserve two title lines, so a one-line title (« Vocabulaire »)
  // sits as close to its icon as a two-line neighbour and the detail lines align.
  tileTitlePair: { minHeight: 42 },
  tileDetail: { fontSize: 13, fontWeight: '700' },
  cta: {
    marginTop: 'auto',
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: t.colors.cta,
    borderBottomWidth: 4,
    borderBottomColor: '#15112C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: 'head', fontWeight: '700', fontSize: 19, color: t.colors.onCta },
}));

// ───────────────────────────── Cahier ─────────────────────────────

export function TodayCahier({ steps, minutes, streak }: TodayData) {
  const t = useTheme();
  const s = useCahier();
  const top = useSafeAreaInsets().top;
  const done = steps.filter((x) => x.done).length;
  const next = nextStep(steps);
  return (
    <Page paper style={[s.screen, { paddingTop: top + 16 }]}>
      <View style={s.hello}>
        <Text style={s.helloTitle}>Bonjour{'\n'}Felix.</Text>
        <Text style={s.sticker}>{days(streak).toUpperCase()}</Text>
      </View>

      <View style={s.banner}>
        <Text style={s.bannerText}>PLAN DU JOUR · {minutes} MIN</Text>
        <Text style={s.bannerCount}>
          {done}/{steps.length}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {steps.map((x, i) => {
          const current = i === next;
          return (
            <Pressable
              key={x.step.id}
              onPress={() => go(x.step.href)}
              accessibilityRole="button"
              accessibilityLabel={`${x.step.title}, ${x.label}`}
              style={({ pressed: p }) => [s.row, x.done && { backgroundColor: t.skills.vocab.bg }, p && s.rowPressed]}
            >
              <View style={s.rowMain}>
                <Text style={s.number}>{String(i + 1).padStart(2, '0')}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowTitle, x.done && s.struck]}>{x.step.title}</Text>
                  <Text style={s.rowDetail}>
                    {x.step.short} · {x.step.minutes} min
                  </Text>
                </View>
                {x.done ? (
                  <View style={s.tick}>
                    <Ionicons name="checkmark" size={20} color={t.colors.ink} />
                  </View>
                ) : (
                  <Text style={s.count}>{x.count}</Text>
                )}
              </View>
              {current && x.target > 1 && (
                <View style={s.blocks}>
                  {Array.from({ length: x.target }, (_, k) => (
                    <View key={k} style={[s.block, k < x.n && { backgroundColor: t.skills[x.step.skill].color }]} />
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => go(next >= 0 ? steps[next].step.href : '/practice')}
        style={({ pressed: p }) => [s.cta, p && s.rowPressed]}
      >
        <Text style={s.ctaText}>{next >= 0 ? 'Continuer →' : 'Tout est fait !'}</Text>
      </Pressable>
    </Page>
  );
}

const useCahier = makeStyles((t) => ({
  screen: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 14, gap: 14 },
  hello: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  helloTitle: { fontFamily: 'head', fontSize: 34, lineHeight: 36, color: t.colors.ink },
  sticker: {
    backgroundColor: '#FF6B9A',
    borderWidth: 2.5,
    borderColor: t.colors.ink,
    boxShadow: `3px 3px 0px ${t.colors.ink}`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: t.colors.ink,
    transform: [{ rotate: '4deg' }],
    marginTop: 4,
  },
  banner: {
    backgroundColor: t.colors.ink,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: { fontSize: 15, fontWeight: '700', color: t.colors.bg },
  bannerCount: { fontFamily: 'head', fontSize: 22, color: '#FFD43B' },
  row: {
    backgroundColor: t.colors.card,
    borderWidth: 2.5,
    borderColor: t.colors.ink,
    borderRadius: 14,
    boxShadow: `4px 4px 0px ${t.colors.ink}`,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  rowPressed: { boxShadow: `0px 0px 0px ${t.colors.ink}`, transform: [{ translateX: 4 }, { translateY: 4 }] },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  number: { fontFamily: 'head', fontSize: 26, width: 38, color: t.colors.ink },
  rowTitle: { fontSize: 18, fontWeight: '700', color: t.colors.ink },
  struck: { textDecorationLine: 'line-through' },
  rowDetail: { fontSize: 14, fontWeight: '500', color: t.colors.ink },
  tick: {
    width: 32,
    height: 32,
    borderWidth: 2.5,
    borderColor: t.colors.ink,
    backgroundColor: t.colors.bg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontFamily: 'head', fontSize: 16, color: t.colors.ink },
  blocks: { flexDirection: 'row', gap: 6 },
  block: { flex: 1, height: 12, borderWidth: 2, borderColor: t.colors.ink, backgroundColor: t.colors.card },
  cta: {
    marginTop: 'auto',
    minHeight: 58,
    borderWidth: 3,
    borderColor: t.colors.ink,
    borderRadius: 14,
    backgroundColor: t.colors.cta,
    boxShadow: `5px 5px 0px ${t.colors.ink}`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: 'head', fontSize: 18, color: t.colors.onCta },
}));

// ───────────────────────────── Métro ─────────────────────────────

export function TodayMetro({ steps, minutes, streak, level, now }: TodayData) {
  const t = useTheme();
  const s = useMetro();
  const top = useSafeAreaInsets().top;
  const done = steps.filter((x) => x.done).length;
  const next = nextStep(steps);
  const current = next >= 0 ? steps[next] : null;
  return (
    <Page style={[s.screen, { paddingTop: top + 16 }]}>
      <View style={s.hello}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={s.kicker}>
            {capitalize(WEEKDAY.format(now))}
            {level ? ` · Direction ${level}` : ''}
          </Text>
          <Text style={s.helloTitle}>Bonjour Felix</Text>
        </View>
        <View style={s.ticket}>
          <Ionicons name="ticket-outline" size={18} color={t.colors.onCta} />
          <Text style={s.ticketText}>{days(streak)}</Text>
        </View>
      </View>

      <View style={s.board}>
        <View style={s.boardHead}>
          <View style={[s.boardDot, { backgroundColor: current ? t.skills[current.step.skill].color : t.skills.vocab.color }]}>
            {current ? <Text style={s.boardDotText}>{next + 1}</Text> : <Ionicons name="checkmark" size={24} color="#FFFFFF" />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.boardKicker}>{current ? 'Prochain arrêt' : 'Terminus'}</Text>
            <Text style={s.boardTitle} numberOfLines={2}>
              {current ? current.step.title : 'Journée terminée'}
            </Text>
          </View>
          <Text style={s.boardMeta}>
            {done}/{steps.length}
            {'\n'}
            {minutes} min
          </Text>
        </View>
        <View style={s.boardLine}>
          {steps.map((x, i) => (
            <View key={x.step.id} style={[s.boardSeg, i === 0 && { flex: 0 }]}>
              {i > 0 && <View style={[s.boardRail, { backgroundColor: i <= done ? '#FFFFFF' : 'rgba(255,255,255,0.3)' }]} />}
              <View style={[s.boardStop, x.done ? s.stopDone : i === next ? s.stopNext : s.stopLater]} />
            </View>
          ))}
        </View>
      </View>

      <View>
        {steps.map((x, i) => {
          const look = t.skills[x.step.skill];
          const isNext = i === next;
          const last = i === steps.length - 1;
          return (
            <Pressable
              key={x.step.id}
              onPress={() => go(x.step.href)}
              accessibilityRole="button"
              accessibilityLabel={`Station ${i + 1}, ${x.step.title}, ${x.label}`}
              style={(p) => [s.station, pressed(p)]}
            >
              <View style={s.track}>
                <View
                  style={[
                    s.stop,
                    x.done || isNext ? { backgroundColor: look.color } : { borderWidth: 5, borderColor: look.color, backgroundColor: '#FFFFFF' },
                    isNext && s.stopRing,
                  ]}
                >
                  {x.done ? (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  ) : (
                    <Text style={[s.stopText, { color: isNext ? '#FFFFFF' : look.color }]}>{i + 1}</Text>
                  )}
                </View>
                {!last && <View style={[s.rail, { backgroundColor: look.color }]} />}
              </View>
              <View style={[s.stationBody, isNext && [s.stationNext, { backgroundColor: look.bg }]]}>
                <View style={s.stationHead}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.stationTitle, x.done && { color: t.colors.muted }]}>{x.step.title}</Text>
                    <Text style={[s.stationDetail, x.done && { color: t.colors.greenText, fontWeight: '700' }]}>
                      {x.done ? 'Arrivé' : x.step.short} · {x.step.minutes} min
                    </Text>
                  </View>
                  {last && !x.done && !isNext ? (
                    <Text style={[s.terminus, { color: look.color, backgroundColor: look.bg }]}>Terminus</Text>
                  ) : (
                    !x.done && <Text style={[s.stationCount, isNext && { color: look.color }]}>{x.count}</Text>
                  )}
                </View>
                {isNext && x.target > 1 && (
                  <View style={s.segments}>
                    {Array.from({ length: x.target }, (_, k) => (
                      <View key={k} style={[s.segment, { backgroundColor: k < x.n ? look.color : '#C9D6F5' }]} />
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => go(current ? current.step.href : '/practice')}
        style={({ pressed: p }) => [s.cta, p && { transform: [{ translateY: 2 }], borderBottomWidth: 1 }]}
      >
        <Text style={s.ctaText} numberOfLines={1} adjustsFontSizeToFit>
          {current ? `Monter : ${current.step.title}` : 'Voir les exercices'}
        </Text>
        <Ionicons name="arrow-forward" size={20} color={t.colors.onCta} />
      </Pressable>
    </Page>
  );
}

const useMetro = makeStyles((t) => ({
  screen: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 14, gap: 16 },
  hello: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  kicker: { fontSize: 13, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase', color: t.colors.muted },
  helloTitle: { fontFamily: 'head', fontWeight: '700', fontSize: 30, lineHeight: 34, color: t.colors.ink },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: t.colors.cta,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  ticketText: { fontSize: 14, fontWeight: '800', color: t.colors.onCta },
  board: { backgroundColor: t.colors.ink, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 18, gap: 14 },
  boardHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  boardDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 0px 0px 4px ${t.colors.cta}`,
  },
  boardDotText: { fontFamily: 'head', fontWeight: '700', fontSize: 22, color: '#FFFFFF' },
  boardKicker: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.cta },
  boardTitle: { fontFamily: 'head', fontWeight: '600', fontSize: 20, lineHeight: 24, color: '#FFFFFF' },
  boardMeta: { fontSize: 13, fontWeight: '700', lineHeight: 17, color: '#FFFFFF', textAlign: 'right' },
  boardLine: { flexDirection: 'row', alignItems: 'center' },
  boardSeg: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  boardRail: { flex: 1, height: 5 },
  boardStop: { width: 14, height: 14, borderRadius: 7 },
  stopDone: { backgroundColor: '#FFFFFF' },
  stopNext: { backgroundColor: t.colors.cta },
  stopLater: { borderWidth: 3, borderColor: 'rgba(255,255,255,0.45)' },
  station: { flexDirection: 'row', gap: 14 },
  track: { width: 32, alignItems: 'center' },
  stop: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stopRing: { boxShadow: `0px 0px 0px 5px ${t.colors.cta}` },
  stopText: { fontFamily: 'head', fontWeight: '700', fontSize: 15 },
  rail: { width: 6, flex: 1 },
  stationBody: { flex: 1, paddingTop: 4, paddingBottom: 18, gap: 10 },
  stationNext: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 14 },
  stationHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  stationTitle: { fontFamily: 'head', fontWeight: '600', fontSize: 18, color: t.colors.ink },
  stationDetail: { fontSize: 14, fontWeight: '600', color: t.colors.muted },
  stationCount: { fontSize: 14, fontWeight: '800', color: t.colors.muted },
  terminus: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  segments: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 6, borderRadius: 99 },
  cta: {
    marginTop: 'auto',
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: t.colors.cta,
    borderBottomWidth: 3,
    borderBottomColor: '#D9A400',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  ctaText: { fontFamily: 'head', fontWeight: '700', fontSize: 18, color: t.colors.onCta, flexShrink: 1 },
}));
