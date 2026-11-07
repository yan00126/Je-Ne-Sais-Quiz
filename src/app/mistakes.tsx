import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Body, Button, Card, H2, Screen } from '../components/ui';
import { LISTENING, READING } from '../data/comprehension';
import { addCustomWord, getOpenMistakes, markMistakeReviewed, type Mistake } from '../lib/db';
import { makeStyles, useTheme } from '../theme/ThemeProvider';

const ITEMS = new Map([...READING, ...LISTENING].map((i) => [i.id, i]));

// Wrong answers from listening and reading, kept until marked as understood.
export default function Mistakes() {
  const t = useTheme();
  const styles = useStyles();
  const db = useSQLiteContext();
  const [mistakes, setMistakes] = useState<Mistake[] | null>(null);

  useEffect(() => {
    getOpenMistakes(db).then(setMistakes);
  }, [db]);

  if (!mistakes) return null;

  async function understood(id: number) {
    await markMistakeReviewed(db, id);
    setMistakes((m) => m!.filter((x) => x.id !== id));
  }

  return (
    <Screen>
      <AddWord />
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
  input: { borderWidth: t.button === 'brutal' ? 2.5 : 1.5, borderColor: t.colors.border, backgroundColor: t.colors.card, borderRadius: t.radius.field, padding: 12, fontSize: 16, color: t.colors.ink },
}));
