import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Card, colors, H2, Screen } from '../components/ui';
import { LISTENING, READING } from '../data/comprehension';
import { addCustomWord, getOpenMistakes, markMistakeReviewed, type Mistake } from '../lib/db';

const ITEMS = new Map([...READING, ...LISTENING].map((i) => [i.id, i]));

// Wrong answers from listening and reading, kept until marked as understood.
export default function Mistakes() {
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
            <Text style={[styles.answer, { color: colors.red }]}>✗ {q.choices[m.picked]}</Text>
            <Text style={[styles.answer, { color: colors.green }]}>✓ {q.choices[q.answer]}</Text>
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

const styles = StyleSheet.create({
  answer: { fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 16, color: colors.ink },
});
