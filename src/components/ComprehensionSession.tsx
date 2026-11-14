import * as Speech from 'expo-speech';
import { speak } from '../lib/speech';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import type { ComprehensionItem } from '../data/comprehension';
import { getLevelState, getTodayCounts, logAttempt, logMistake, pickNextItem } from '../lib/db';
import { LEVELS, nextLevel, playbackFor, PROMOTE_AT, WINDOW, type LevelState } from '../lib/level';
import { todaysPlan } from '../lib/plan';
import { useStudyTimer } from '../lib/useStudyTimer';
import { QuizRunner } from './QuizRunner';
import { Body, Button, Card, H2, Screen } from './ui';

// `header` goes above the document, e.g. the listening mode switcher.
export function ComprehensionSession({
  skill,
  items,
  header,
}: {
  skill: 'listening' | 'reading';
  items: ComprehensionItem[];
  header?: ReactNode;
}) {
  const db = useSQLiteContext();
  useStudyTimer(skill);
  const [item, setItem] = useState<ComprehensionItem | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [plays, setPlays] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [doneToday, setDoneToday] = useState(0);
  // Listening only: documents come from your current level, which moves with your results.
  const adaptive = skill === 'listening';
  const [levelState, setLevelState] = useState<LevelState | null>(null);
  const [levelChange, setLevelChange] = useState<'up' | 'down' | null>(null);
  const target = todaysPlan(new Date()).find((s) => s.skill === skill)?.target ?? 0;

  async function load() {
    setDoneToday((await getTodayCounts(db))[skill] ?? 0);
    let pool = items;
    if (adaptive) {
      const state = await getLevelState(db, skill, items);
      setLevelState(state);
      pool = items.filter((i) => i.level === state.level);
    }
    setItem(await pickNextItem(db, skill, pool));
    setResult(null);
    setLevelChange(null);
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
  const playback = playbackFor(item.level);
  const playsLabel = playback.maxPlays === Infinity ? `${plays}` : `${plays}/${playback.maxPlays}`;
  const canPlay = !speaking && plays < playback.maxPlays;

  function play(rate: number) {
    setPlays((n) => n + 1);
    setSpeaking(true);
    speak(item!.text, {
      rate,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  }

  async function finish(score: number) {
    await logAttempt(db, skill, item!.id, score, item!.questions.length);
    setDoneToday((n) => n + 1);
    if (adaptive && levelState) {
      const after = await getLevelState(db, skill, items);
      if (after.level !== levelState.level) setLevelChange(LEVELS.indexOf(after.level) > LEVELS.indexOf(levelState.level) ? 'up' : 'down');
      setLevelState(after);
    }
    setResult(score);
    setShowScript(true);
  }

  return (
    <Screen>
      {header}
      <Card>
        <Body muted>
          Niveau {item.level} · {item.title} · aujourd'hui {Math.min(doneToday, target)}/{target}
        </Body>
        {adaptive && levelState && result === null && <LevelProgress state={levelState} />}
        {skill === 'reading' || showScript ? (
          <Body>{item.text}</Body>
        ) : (
          <View style={{ gap: 8 }}>
            <Body muted>
              Écoutes : {playsLabel}.{' '}
              {item.level === 'B2'
                ? 'Une seule écoute, comme au TCF.'
                : playback.maxPlays === Infinity
                  ? 'Réécoutez autant que nécessaire.'
                  : "Au TCF, chaque document n'est diffusé qu'une fois."}
            </Body>
            <Button
              title={speaking ? 'Lecture…' : playback.defaultRate < 1 ? '▶︎ Écouter (lentement)' : '▶︎ Écouter'}
              disabled={!canPlay}
              onPress={() => play(playback.defaultRate)}
            />
            {playback.slowOption && (
              <Button
                title={playback.defaultRate < 1 ? 'Écouter à vitesse normale' : 'Écouter plus lentement'}
                variant="outline"
                disabled={!canPlay}
                onPress={() => play(playback.defaultRate < 1 ? 1 : 0.75)}
              />
            )}
          </View>
        )}
      </Card>
      {result === null ? (
        <QuizRunner
          key={item.id}
          questions={item.questions}
          onAnswer={(q, picked, correct) => {
            if (!correct) logMistake(db, skill, item.id, q, picked);
          }}
          onFinish={finish}
        />
      ) : (
        <Card>
          <H2>
            Résultat : {result}/{item.questions.length}
          </H2>
          {skill === 'listening' && <Body muted>La transcription est affichée ci-dessus.</Body>}
          {levelChange === 'up' && <Body>Bravo ! Vous passez au niveau {levelState?.level}.</Body>}
          {levelChange === 'down' && (
            <Body>On revient au niveau {levelState?.level} pour consolider, puis vous remonterez.</Body>
          )}
          {result < item.questions.length && <Body muted>Vos erreurs sont dans Progrès → Mes erreurs.</Body>}
          <Button title="Document suivant" onPress={load} />
        </Card>
      )}
    </Screen>
  );
}

function LevelProgress({ state }: { state: LevelState }) {
  const next = nextLevel(state.level);
  const pct = state.accuracy === null ? null : Math.round(state.accuracy * 100);
  if (!next) return <Body muted>Niveau le plus élevé atteint. Documents récents : {pct ?? '–'} %.</Body>;
  const left = WINDOW - state.recent.length;
  return (
    <Body muted>
      {left > 0
        ? `Encore ${left} document(s) au niveau ${state.level}, puis ${Math.round(PROMOTE_AT * 100)} % de bonnes réponses pour passer au ${next}.`
        : `${Math.round(PROMOTE_AT * 100)} % sur vos ${WINDOW} derniers documents pour passer au ${next}.`}
      {pct !== null && ` Actuellement : ${pct} %.`}
    </Body>
  );
}
