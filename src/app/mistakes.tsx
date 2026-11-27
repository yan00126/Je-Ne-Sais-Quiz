import { useSQLiteContext } from 'expo-sqlite';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RuleSheet } from '../components/GrammarViews';
import { Body, Button, Card, H2, Screen, tap } from '../components/ui';
import { LISTENING, READING } from '../data/comprehension';
import { RULE_BY_ID, type GrammarRule } from '../data/grammar';
import { STARTER_VOCAB } from '../data/vocab';
import { addCustomWord, getOpenMistakes, getWordMistakes, markMistakeReviewed, type Mistake } from '../lib/db';
import { ERROR_LABEL, weakPoints, type WeakPoint } from '../lib/wordMistakes';
import { makeStyles, useTheme } from '../theme/ThemeProvider';

const ITEMS = new Map([...READING, ...LISTENING].map((i) => [i.id, i]));

// Wrong answers from listening and reading, kept until marked as understood.
export default function Mistakes() {
  const t = useTheme();
  const styles = useStyles();
  const db = useSQLiteContext();
  const [mistakes, setMistakes] = useState<Mistake[] | null>(null);
  const [weak, setWeak] = useState<WeakPoint[]>([]);

  useEffect(() => {
    getOpenMistakes(db).then(setMistakes);
    getWordMistakes(db)
      .then((rows) => setWeak(weakPoints(rows, 3, 2, (id) => WORDS.has(id))))
      .catch(() => {});
  }, [db]);

  if (!mistakes) return null;

  async function understood(id: number) {
    await markMistakeReviewed(db, id);
    setMistakes((m) => m!.filter((x) => x.id !== id));
  }

  return (
    <Screen>
      <AddWord />
      <WeakPoints points={weak} />
      {mistakes.length === 0 && <Body muted>Aucune erreur à revoir. Bravo !</Body>}
      {mistakes.map((m) => {
        const item = ITEMS.get(m.item_id);
        const q = item?.questions[m.question];
        if (!item || !q) return null;
        return (
          <Card key={m.id}>
            <Body muted>
              {m.skill === 'listening' ? 'Compréhension orale' : 'Compréhension écrite'} · {item.title}
            </Body>
            <H2>{q.prompt}</H2>
            <Text style={[styles.answer, { color: t.colors.redText }]}>✗ {q.choices[m.picked]}</Text>
            <Text style={[styles.answer, { color: t.colors.greenText }]}>✓ {q.choices[q.answer]}</Text>
            {q.explanation && <Body>{q.explanation}</Body>}
            <Body muted>{item.text}</Body>
            <Button title="Compris" variant="outline" onPress={() => understood(m.id)} />
          </Card>
        );
      })}
    </Screen>
  );
}

const WORDS = new Map(STARTER_VOCAB.map((v) => [v.id, v]));
const times = (n: number) => `${n} fois`;

// What a weak point says: a kind of mistake (with its grammar card), two words mixed up, or one word that slips.
function describe(p: WeakPoint): { title: string; detail: string; rule: GrammarRule | null } | null {
  if (p.kind === 'type') {
    const rule = p.ruleId ? (RULE_BY_ID.get(p.ruleId) ?? null) : null;
    return { title: ERROR_LABEL[p.type], detail: `${times(p.count)}${rule ? ' · voir la règle' : ''}`, rule };
  }
  if (p.kind === 'pair') {
    const [a, b] = p.ids.map((id) => WORDS.get(id));
    if (!a || !b) return null;
    return { title: `${a.fr} ↔ ${b.fr}`, detail: `Confondus ${times(p.count)} · ${a.en} / ${b.en}`, rule: null };
  }
  const w = WORDS.get(p.id);
  return w ? { title: w.fr, detail: `Raté ${times(p.count)} · ${w.en}`, rule: null } : null;
}

// The three mistakes that come back most in the vocabulary of the last 30 days, worked out on the phone.
// A kind of mistake opens its grammar rule card.
function WeakPoints({ points }: { points: WeakPoint[] }) {
  const t = useTheme();
  const styles = useStyles();
  const [rule, setRule] = useState<GrammarRule | null>(null);
  const rows = points.flatMap((p) => {
    const d = describe(p);
    return d ? [d] : [];
  });
  return (
    <Card>
      <H2>Mes points faibles</H2>
      {rows.length === 0 ? (
        <Body muted>Pas encore de tendance : elle apparaît quand la même erreur revient au moins deux fois en vocabulaire.</Body>
      ) : (
        rows.map((r, i) => (
          <Pressable
            key={r.title}
            accessibilityRole={r.rule ? 'button' : undefined}
            disabled={!r.rule}
            onPress={() => {
              tap();
              setRule(r.rule);
            }}
            style={({ pressed }) => [styles.weak, i > 0 && styles.weakSep, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.rank}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.weakTitle}>{r.title}</Text>
              <Text style={styles.weakDetail}>{r.detail}</Text>
            </View>
            {r.rule && <Ionicons name="book-outline" size={20} color={t.colors.accentText} />}
          </Pressable>
        ))
      )}
      <Button title="Règles de grammaire" icon="library-outline" variant="outline" onPress={() => router.push('/grammar')} />
      <RuleSheet rule={rule} onClose={() => setRule(null)} />
    </Card>
  );
}

// Lets the learner turn an unknown word from a text into a flashcard.
function AddWord() {
  const styles = useStyles();
  const db = useSQLiteContext();
  const [fr, setFr] = useState('');
  const [meaning, setMeaning] = useState('');
  const [added, setAdded] = useState<string | null>(null);

  async function add() {
    await addCustomWord(db, fr.trim(), meaning.trim());
    setAdded(fr.trim());
    setFr('');
    setMeaning('');
  }

  return (
    <Card>
      <H2>Ajouter un mot inconnu</H2>
      <TextInput style={styles.input} placeholder="Mot ou expression en français" value={fr} onChangeText={setFr} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Sens (anglais ou chinois)" value={meaning} onChangeText={setMeaning} />
      <View>
        <Button title="Ajouter aux cartes" disabled={!fr.trim() || !meaning.trim()} onPress={add} />
      </View>
      {added && <Body muted>« {added} » ajouté : il apparaîtra dans le vocabulaire du jour.</Body>}
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  answer: { fontSize: 16, fontWeight: '600' },
  weak: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  weakSep: { borderTopWidth: 1, borderTopColor: t.colors.border },
  rank: { width: 22, fontSize: 18, fontWeight: '800', color: t.colors.accentText, textAlign: 'center' },
  weakTitle: { fontSize: 16, fontWeight: '700', color: t.colors.ink },
  weakDetail: { fontSize: 13, fontWeight: '600', color: t.colors.muted },
  input: { borderWidth: t.button === 'brutal' ? 2.5 : 1.5, borderColor: t.colors.border, backgroundColor: t.colors.card, borderRadius: t.radius.field, padding: 12, fontSize: 16, color: t.colors.ink },
}));
