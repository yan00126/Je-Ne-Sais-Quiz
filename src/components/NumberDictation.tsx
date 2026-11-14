import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';
import { markActive } from '../lib/activity';
import { getNumberHistory, logNumberAnswer } from '../lib/db';
import { drillState, PHASE1_DAYS, pickCategory, scoreFor, SERIES, type DrillState, type NumberAnswer } from '../lib/numberDrill';
import { CATEGORIES, CATEGORY_BY_ID, makeItem, MAX_TIER, TIER_RATE, type CategoryId, type NumberItem } from '../lib/numbers';
import { speak } from '../lib/speech';
import { useStudyTimer } from '../lib/useStudyTimer';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import { outcomeColor, ResultBanner } from './ResultBanner';
import { Bar, Body, Button, Card, H2, Label, Screen } from './ui';

type Checked = { score: number; typed: string; gaveUp: boolean; levelUp: number | null };

const tierLabel = (tier: number) => `niveau ${tier + 1}/${MAX_TIER + 1}`;

// Number dictation: the voice reads a number (alone, as a price, a time, a date…) and you type it.
// What comes up adapts to your results per category; see lib/numberDrill.ts.
export function NumberDictation({ header }: { header?: ReactNode }) {
  const db = useSQLiteContext();
  const t = useTheme();
  const styles = useStyles();
  useStudyTimer('listening');
  const [history, setHistory] = useState<NumberAnswer[] | null>(null);
  const [state, setState] = useState<DrillState | null>(null);
  const [item, setItem] = useState<NumberItem | null>(null);
  const [count, setCount] = useState(0); // numbers started in this series
  const [seriesScores, setSeriesScores] = useState<number[]>([]);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState<Checked | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const replays = useRef(0);
  const audioEnd = useRef<number | null>(null);
  const lastCats = useRef<CategoryId[]>([]);

  useEffect(() => {
    getNumberHistory(db).then((h) => {
      setHistory(h);
      const s = drillState(h);
      setState(s);
      next(s);
    });
    return () => {
      Speech.stop();
    };
  }, [db]);

  function play(it: NumberItem, rate = TIER_RATE[it.tier]) {
    Speech.stop();
    setSpeaking(true);
    speak(it.spoken, {
      rate,
      onDone: () => {
        audioEnd.current = Date.now();
        setSpeaking(false);
      },
      onStopped: () => setSpeaking(false),
    });
  }

  function next(s: DrillState) {
    const category = pickCategory(s, Math.random, lastCats.current);
    lastCats.current = [...lastCats.current, category].slice(-3);
    const it = makeItem(category, s.categories[category].tier);
    setItem(it);
    setTyped('');
    setChecked(null);
    setCount((n) => n + 1);
    replays.current = 0;
    audioEnd.current = null;
    play(it);
  }

  function replay(slow = false) {
    if (!item) return;
    replays.current++;
    audioEnd.current = null;
    play(item, slow ? Math.min(0.7, TIER_RATE[item.tier]) : TIER_RATE[item.tier]);
  }

  async function check(gaveUp = false) {
    if (!item || !history || !state || checked) return;
    // Time to type, counted from the end of the audio; answering before it ends counts as fast.
    const ms = audioEnd.current === null ? 0 : Date.now() - audioEnd.current;
    const correct = !gaveUp && item.check(typed);
    const score = scoreFor(correct, ms, replays.current, item);
    const before = state.categories[item.category].tier;
    const h = [...history, { category: item.category, score, at: Date.now() }];
    const after = drillState(h);
    setHistory(h);
    setState(after);
    setSeriesScores((s) => [...s, score]);
    const tierNow = after.categories[item.category].tier;
    setChecked({ score, typed, gaveUp, levelUp: tierNow > before ? tierNow : null });
    logNumberAnswer(db, { category: item.category, tier: item.tier, score, expected: item.display, typed: gaveUp ? '' : typed, ms }).catch(() => {});
    // Hear it again, slowly, while reading the answer. Wait for the result sound first.
    if (score < 1) setTimeout(() => play(item, 0.7), 450);
  }

  function newSeries() {
    setSeriesScores([]);
    setCount(0);
    next(state!);
  }

  if (!state || !item) return null;
  const finished = checked && count >= SERIES;
  const category = CATEGORY_BY_ID.get(item.category)!;
  const outcome = checked ? (checked.score === 1 ? 'correct' : checked.score > 0 ? 'almost' : 'wrong') : null;
  const total = seriesScores.reduce((a, b) => a + b, 0);

  return (
    <Screen>
      {header}
      <Card>
        <Body muted>
          {state.phase === 1
            ? `Phase 1 : nombres seuls · jour ${Math.min(state.day, PHASE1_DAYS)}/${PHASE1_DAYS}`
            : 'Phase 2 : nombres en situation (prix, heures, dates…)'}
        </Body>
        <Bar pct={((Math.min(count, SERIES) - (checked ? 0 : 1)) / SERIES) * 100} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>
          {Math.min(count, SERIES)}/{SERIES} · {category.label} · {tierLabel(item.tier)}
        </Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button title={speaking ? 'Lecture…' : '🔊 Réécouter'} variant="outline" disabled={speaking} onPress={() => replay()} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="🐢 Lentement" variant="outline" disabled={speaking} onPress={() => replay(true)} />
          </View>
        </View>
        {!checked && <Body muted>{item.prompt}. Réécouter compte comme une demi-réussite.</Body>}
        {!(checked?.gaveUp) && (
          <TextInput
            key={count}
            style={[styles.input, outcome && { borderColor: outcomeColor(t, outcome) }]}
            value={checked ? checked.typed : typed}
            onChangeText={(v) => {
              markActive();
              setTyped(v);
            }}
            editable={!checked}
            keyboardType={item.keyboard}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            autoFocus
            placeholder="Votre réponse"
            returnKeyType="done"
            onSubmitEditing={() => typed.trim() && check()}
          />
        )}
        {checked && (
          <View style={{ gap: 4 }}>
            <Text style={styles.answer}>{item.display}</Text>
            <Text style={styles.spoken}>{item.spoken}</Text>
          </View>
        )}
      </Card>

      {!checked ? (
        <View style={{ gap: 8 }}>
          <Button title="Vérifier" disabled={!typed.trim()} onPress={() => check()} />
          <Button title="Je ne sais pas" variant="outline" color={t.colors.muted} onPress={() => check(true)} />
        </View>
      ) : (
        <ResultBanner
          outcome={outcome!}
          title={checked.score === 1 ? 'Exact !' : checked.score > 0 ? 'Juste' : checked.gaveUp ? 'À retenir' : 'Pas tout à fait'}
          detail={
            checked.score === 0.5
              ? replays.current > 0
                ? 'Après réécoute : compte pour moitié'
                : 'Un peu lent : compte pour moitié'
              : undefined
          }
        >
          {checked.levelUp !== null && (
            <Body>
              Bravo ! {category.label} passe au {tierLabel(checked.levelUp)} : {checked.levelUp === 1 ? 'plus rapide et des nombres plus longs' : 'dans des phrases'}.
            </Body>
          )}
          {!finished && <Button title="Continuer" color={outcomeColor(t, outcome!)} onPress={() => next(state)} />}
        </ResultBanner>
      )}

      {finished && <Summary state={state} total={total} onAgain={newSeries} />}
    </Screen>
  );
}

function Summary({ state, total, onAgain }: { state: DrillState; total: number; onAgain: () => void }) {
  const styles = useStyles();
  const seen = CATEGORIES.filter((c) => state.categories[c.id].answers > 0);
  return (
    <Card style={{ gap: 10 }}>
      <H2>
        Série terminée : {String(total).replace('.', ',')}/{SERIES}
      </H2>
      <Label>Par catégorie (20 dernières réponses)</Label>
      {seen.map((c) => {
        const s = state.categories[c.id];
        const pct = s.accuracy === null ? null : Math.round(s.accuracy * 100);
        return (
          <View key={c.id} style={styles.statRow}>
            <Text style={styles.statName}>{c.label}</Text>
            <Text style={styles.statTier}>{tierLabel(s.tier)}</Text>
            <Text style={styles.statPct}>{pct === null ? 'nouveau' : `${pct} %`}</Text>
          </View>
        );
      })}
      <Body muted>Les catégories les plus faibles reviennent le plus souvent. Au-dessus de 90 %, une catégorie passe au niveau suivant.</Body>
      <Button title="Nouvelle série" onPress={onAgain} />
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  card: { gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: t.colors.muted, textAlign: 'center', textTransform: 'uppercase' },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    borderWidth: t.button === 'brutal' ? 2.5 : 2,
    borderColor: t.colors.border,
    backgroundColor: t.colors.card,
    borderRadius: t.radius.field,
    padding: 12,
    fontSize: 24,
    textAlign: 'center',
    color: t.colors.ink,
    fontVariant: ['tabular-nums'],
  },
  answer: { fontFamily: 'head', fontWeight: '800', fontSize: 30, lineHeight: 38, textAlign: 'center', color: t.colors.ink },
  spoken: { fontSize: 16, lineHeight: 22, textAlign: 'center', color: t.colors.muted, fontStyle: 'italic' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statName: { flex: 1, fontSize: 16, fontWeight: '600', color: t.colors.ink },
  statTier: { fontSize: 14, color: t.colors.muted },
  statPct: { width: 72, textAlign: 'right', fontSize: 16, fontWeight: '700', color: t.colors.ink, fontVariant: ['tabular-nums'] },
}));
