import * as Speech from 'expo-speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { ComprehensionItem } from '../data/comprehension';
import { logAttempt, pickNextItem } from '../lib/db';
import { QuizRunner } from './QuizRunner';
import { Body, Button, Card, H2, Screen } from './ui';

// The real TCF plays each listening document once; practice mode allows one replay.
const MAX_PLAYS = 2;

export function ComprehensionSession({ skill, items }: { skill: 'listening' | 'reading'; items: ComprehensionItem[] }) {
  const db = useSQLiteContext();
  const [item, setItem] = useState<ComprehensionItem | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [plays, setPlays] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [showScript, setShowScript] = useState(false);

  async function load() {
    setItem(await pickNextItem(db, skill, items));
    setResult(null);
    setPlays(0);
    setShowScript(false);
  }

  useEffect(() => {
    load();
    return () => {
      Speech.stop();
    };
  }, []);

  if (!item) return null;

  function play(rate: number) {
    setPlays((n) => n + 1);
    setSpeaking(true);
    Speech.speak(item!.text, {
      language: 'fr-FR',
      rate,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  }

  async function finish(score: number) {
    await logAttempt(db, skill, item!.id, score, item!.questions.length);
    setResult(score);
    setShowScript(true);
  }

  return (
    <Screen>
      <Card>
        <Body muted>
          Niveau {item.level} · {item.title}
        </Body>
        {skill === 'reading' || showScript ? (
          <Body>{item.text}</Body>
        ) : (
          <View style={{ gap: 8 }}>
            <Body muted>
              Écoutes : {plays}/{MAX_PLAYS}. Au TCF, chaque document n'est diffusé qu'une fois.
            </Body>
            <Button title={speaking ? 'Lecture…' : '▶︎ Écouter'} disabled={speaking || plays >= MAX_PLAYS} onPress={() => play(1)} />
            <Button
              title="Écouter plus lentement"
              variant="outline"
              disabled={speaking || plays >= MAX_PLAYS}
              onPress={() => play(0.75)}
            />
          </View>
        )}
      </Card>
      {result === null ? (
        <QuizRunner key={item.id} questions={item.questions} onFinish={finish} />
      ) : (
        <Card>
          <H2>
            Résultat : {result}/{item.questions.length}
          </H2>
          {skill === 'listening' && <Body muted>La transcription est affichée ci-dessus.</Body>}
          <Button title="Document suivant" onPress={load} />
        </Card>
      )}
    </Screen>
  );
}
