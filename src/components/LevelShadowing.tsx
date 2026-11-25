import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { Storage } from 'expo-sqlite/kv-store';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SHADOW_SENTENCES } from '../data/shadowing';
import { SHADOWING_PREFIX, logAttempt } from '../lib/db';
import {
  LEVEL_SPECS,
  PAUSE_ORDER,
  PAUSES,
  SESSION_SIZE,
  SHADOW_LEVELS,
  TEXT_HINTS,
  TEXT_MODES,
  TEXT_ORDER,
  createPlayer,
  isLevel,
  isPause,
  isTextMode,
  markSeen,
  pickSentences,
  rateLabel,
  sessionCounts,
  speedBars,
  textVisible,
  type PauseLength,
  type Phase,
  type Player,
  type PlayerState,
  type SeenHistory,
  type Sentence,
  type ShadowLevel,
  type TextMode,
} from '../lib/shadowing';
import { speakAt, stopSpeech } from '../lib/speech';
import { useStudyTimer } from '../lib/useStudyTimer';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import type { Theme } from '../theme/themes';
import { Body, Button, Card, Footer, H2, Label, Row, Screen, shade, Sheet, tap, tint } from './ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

const KEYS = { level: 'shadowingLevel', pause: 'shadowingPause', text: 'shadowingText', seen: 'shadowingSeen' };

function load<T>(key: string, valid: (v: unknown) => v is T, fallback: T): T {
  try {
    const v = Storage.getItemSync(key);
    return valid(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: string) {
  try {
    Storage.setItemSync(key, value);
  } catch {}
}

function loadSeen(): SeenHistory {
  try {
    return JSON.parse(Storage.getItemSync(KEYS.seen) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

const IDLE: PlayerState = { index: 0, phase: 'slow', status: 'paused', gap: null, completed: 0 };

// The badge colour of each level, from easy (green) to hard (red).
function levelColor(t: Theme, level: ShadowLevel) {
  return { A1: t.colors.green, A2: t.colors.accent, B1: t.colors.amber, B2: t.colors.red }[level];
}

// Shadowing by level: choose a level, then each sentence plays slow, you repeat, it plays at the
// level's normal speed, you repeat, and the next one starts by itself.
export function LevelShadowing({ header }: { header?: ReactNode }) {
  const db = useSQLiteContext();
  const [level, setLevel] = useState<ShadowLevel>(() => load(KEYS.level, isLevel, 'A2'));
  const [pause, setPause] = useState<PauseLength>(() => load(KEYS.pause, isPause, 'medium'));
  const [textMode, setTextMode] = useState<TextMode>(() => load(KEYS.text, isTextMode, 'always'));
  const [session, setSession] = useState<Sentence[] | null>(null);
  const [ps, setPs] = useState<PlayerState>(IDLE);
  const [heard, setHeard] = useState<Set<number>>(new Set());
  const [showEn, setShowEn] = useState(false);
  const [counted, setCounted] = useState(false);
  const player = useRef<Player | null>(null);
  // How far the series got, so the sentences you heard are remembered even if you leave early.
  const reached = useRef(-1);
  const logged = useRef(false);
  const shown = useRef(0); // the sentence the translation toggle belongs to
  useStudyTimer('speaking', ps.status === 'playing');

  useEffect(() => () => {
    player.current?.dispose();
    player.current = null;
  }, []);

  function remember(sentences: Sentence[]) {
    if (reached.current < 0) return;
    save(KEYS.seen, JSON.stringify(markSeen(loadSeen(), sentences.slice(0, reached.current + 1).map((s) => s.id), Date.now())));
    reached.current = -1;
  }

  async function record(sentences: Sentence[], lvl: ShadowLevel, completed: number) {
    if (logged.current || completed === 0) return;
    logged.current = true;
    const counts = sessionCounts(completed, sentences.length);
    setCounted(counts);
    await logAttempt(db, 'speaking', `${SHADOWING_PREFIX}lvl-${lvl}`, completed, sentences.length, counts).catch(() => {});
  }

  function start() {
    const sentences = pickSentences(SHADOW_SENTENCES, level, loadSeen());
    player.current?.dispose();
    reached.current = -1;
    logged.current = false;
    setCounted(false);
    setHeard(new Set());
    setShowEn(false);
    shown.current = 0;
    setSession(sentences);
    const p = createPlayer(
      { sentences, level, pause },
      {
        speak: (text, rate, onDone) => speakAt(text, rate, onDone),
        stop: stopSpeech,
        setTimer: (fn, ms) => setTimeout(fn, ms),
        clearTimer: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
        now: Date.now,
        onChange: (s) => {
          if (s.index !== shown.current) {
            shown.current = s.index;
            setShowEn(false);
          }
          setPs(s);
          reached.current = Math.max(reached.current, s.index);
          if (s.phase !== 'slow') setHeard((prev) => (prev.has(s.index) ? prev : new Set(prev).add(s.index)));
        },
        onGapStart: () => tap(),
        onFinish: (completed) => {
          remember(sentences);
          record(sentences, level, completed);
        },
      },
    );
    player.current = p;
    p.start();
  }

  // Leave the series: what was practised still counts.
  function stop() {
    const p = player.current;
    if (p && session) {
      p.dispose();
      remember(session);
      record(session, level, p.state.completed);
    }
    player.current = null;
    setSession(null);
    setPs(IDLE);
  }

  if (!session) {
    return (
      <Setup
        header={header}
        level={level}
        pause={pause}
        textMode={textMode}
        onLevel={(l) => { setLevel(l); save(KEYS.level, l); }}
        onPause={(p) => { setPause(p); save(KEYS.pause, p); }}
        onTextMode={(m) => { setTextMode(m); save(KEYS.text, m); }}
        onStart={start}
      />
    );
  }

  if (ps.status === 'finished') {
    return <Finished sentences={session} level={level} completed={ps.completed} counted={counted} onAgain={start} onChangeLevel={stop} />;
  }

  return (
    <Playing
      sentences={session}
      level={level}
      state={ps}
      showText={textVisible(textMode, ps.phase, heard.has(ps.index))}
      showEn={showEn}
      onToggleEn={() => setShowEn(!showEn)}
      onToggle={() => player.current?.toggle()}
      onReplay={() => player.current?.replay()}
      onNext={() => player.current?.next()}
      onPrevious={() => player.current?.previous()}
      onQuit={stop}
    />
  );
}

// ——— Choosing the level ———

function Setup(props: {
  header?: ReactNode;
  level: ShadowLevel;
  pause: PauseLength;
  textMode: TextMode;
  onLevel: (l: ShadowLevel) => void;
  onPause: (p: PauseLength) => void;
  onTextMode: (m: TextMode) => void;
  onStart: () => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const spec = LEVEL_SPECS[props.level];
  const [options, setOptions] = useState(false);
  return (
    <Screen>
      {props.header}
      <View style={{ gap: 4 }}>
        <H2>Choisissez votre niveau</H2>
        <Body muted>Plus le niveau monte, plus les phrases sont longues et plus la voix parle vite.</Body>
      </View>
      <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
        {SHADOW_LEVELS.map((l) => (
          <LevelOption key={l} level={l} selected={l === props.level} onPress={() => props.onLevel(l)} />
        ))}
      </View>

      {/* The pause and text options live in a sheet; « Commencer » is pinned at the bottom with them. */}
      <Footer>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Options de la série"
          onPress={() => {
            tap();
            setOptions(true);
          }}
          style={({ pressed }) => [s.optionsRow, pressed && s.pressed]}
        >
          <Ionicons name="options-outline" size={20} color={t.colors.accentText} />
          <Text style={s.optionsText} numberOfLines={1}>
            Pause {PAUSES[props.pause].label.toLowerCase()} · Texte {TEXT_MODES[props.textMode].toLowerCase()}
          </Text>
          <Text style={s.optionsEdit}>Modifier</Text>
        </Pressable>
        <Button title={`Commencer · ${SESSION_SIZE} phrases ${spec.level}`} icon="play" onPress={props.onStart} />
      </Footer>

      <Sheet visible={options} title="Options de la série" onClose={() => setOptions(false)}>
        <View style={s.settings}>
          <Label>Déroulement de chaque phrase</Label>
          <PhaseTrack level={props.level} />
          <View style={s.divider} />
          <Label>Pause pour répéter</Label>
          <Segmented options={PAUSE_ORDER.map((p) => ({ value: p, label: PAUSES[p].label }))} value={props.pause} onChange={props.onPause} />
          <Label>Texte de la phrase</Label>
          <Segmented options={TEXT_ORDER.map((m) => ({ value: m, label: TEXT_MODES[m] }))} value={props.textMode} onChange={props.onTextMode} />
          <Text style={s.hint}>{TEXT_HINTS[props.textMode]}</Text>
        </View>
        <Button title="OK" onPress={() => setOptions(false)} />
      </Sheet>
    </Screen>
  );
}

function LevelOption({ level, selected, onPress }: { level: ShadowLevel; selected: boolean; onPress: () => void }) {
  const t = useTheme();
  const s = useStyles();
  const spec = LEVEL_SPECS[level];
  const color = levelColor(t, level);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${level} ${spec.name} : ${spec.detail}`}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [s.option, selected && s.optionSelected, pressed && s.pressed]}
    >
      <View style={[s.badge, { backgroundColor: color }, t.button === 'raised' && { borderBottomColor: shade(color) }]}>
        <Text style={[s.badgeText, { color: t.button === 'brutal' ? t.colors.ink : t.colors.onColor }]}>{level}</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.optName}>{spec.name}</Text>
        <Text style={s.optDetail}>
          {spec.detail} · {spec.words[0]}–{spec.words[1]} mots
        </Text>
        <View style={s.metaRow}>
          <SpeedMeter bars={speedBars(level)} />
          <Text style={s.optMeta}>
            lent {rateLabel(spec.slowRate)} · normal {rateLabel(spec.normalRate)}
          </Text>
        </View>
      </View>
      <View style={[s.radio, selected && s.radioOn]}>{selected && <View style={s.radioDot} />}</View>
    </Pressable>
  );
}

// Four bars like a signal meter: how fast the voice speaks at this level.
function SpeedMeter({ bars }: { bars: number }) {
  const s = useStyles();
  return (
    <View style={s.meter} accessibilityLabel={`Vitesse ${bars} sur 4`}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[s.meterBar, { height: 5 + i * 3 }, i < bars ? s.meterOn : s.meterOff]} />
      ))}
    </View>
  );
}

function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const s = useStyles();
  return (
    <View style={s.segTrack} accessibilityRole="radiogroup">
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => {
              tap();
              onChange(o.value);
            }}
            style={[s.seg, i > 0 && s.segSep, on && s.segOn]}
          >
            <Text style={[s.segText, on && s.segTextOn]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ——— The four steps of a sentence, as stations on a line ———

const STEPS: { phase: Phase; icon: IconName; label: string }[] = [
  { phase: 'slow', icon: 'volume-low', label: 'Lent' },
  { phase: 'gapSlow', icon: 'mic', label: 'À vous' },
  { phase: 'normal', icon: 'volume-high', label: 'Normal' },
  { phase: 'gapNormal', icon: 'mic', label: 'À vous' },
];

function PhaseTrack({ level, phase }: { level: ShadowLevel; phase?: Phase }) {
  const t = useTheme();
  const s = useStyles();
  const spec = LEVEL_SPECS[level];
  const active = phase ? STEPS.findIndex((x) => x.phase === phase) : -1;
  const sub = (p: Phase) => (p === 'slow' ? rateLabel(spec.slowRate) : p === 'normal' ? rateLabel(spec.normalRate) : 'pause');
  return (
    <View style={s.track}>
      <View style={s.trackLine} />
      {active > 0 && <View style={[s.trackLine, s.trackLineOn, { right: `${12.5 + (3 - active) * 25}%` }]} />}
      {STEPS.map((step, i) => {
        const done = i < active;
        const on = i === active;
        const turn = step.phase === 'gapSlow' || step.phase === 'gapNormal';
        const fill = on ? (turn ? t.skills.speaking.color : t.colors.accent) : done ? t.colors.accent : t.colors.card;
        const fg = on || done ? (t.button === 'brutal' ? t.colors.ink : t.colors.onColor) : t.colors.muted;
        return (
          <View key={i} style={s.station}>
            <View style={[s.stationDot, { backgroundColor: fill }, (on || done) && s.stationDotOn, on && s.stationDotActive]}>
              <Ionicons name={done ? 'checkmark' : step.icon} size={on ? 20 : 17} color={fg} />
            </View>
            <Text style={[s.stationLabel, on && s.stationLabelOn]}>{step.label}</Text>
            <Text style={s.stationSub}>{sub(step.phase)}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ——— Playing a series ———

function Playing(props: {
  sentences: Sentence[];
  level: ShadowLevel;
  state: PlayerState;
  showText: boolean;
  showEn: boolean;
  onToggleEn: () => void;
  onToggle: () => void;
  onReplay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onQuit: () => void;
}) {
  const t = useTheme();
  const s = useStyles();
  const { state, level } = props;
  const spec = LEVEL_SPECS[level];
  const sentence = props.sentences[state.index];
  const turn = state.phase === 'gapSlow' || state.phase === 'gapNormal';
  const playing = state.status === 'playing';

  // Redraw the countdown while a pause runs.
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!state.gap || !playing) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [state.gap, playing]);
  const left = state.gap ? Math.max(0, state.gap.endsAt - now) : 0;
  const pct = state.gap ? (left / state.gap.ms) * 100 : 0;

  const message = !playing
    ? { icon: 'pause' as IconName, title: 'En pause', detail: 'Touchez ▶︎ pour reprendre.' }
    : turn
      ? { icon: 'mic' as IconName, title: 'À vous ! Répétez', detail: state.phase === 'gapSlow' ? 'Lentement, à voix haute.' : 'Au rythme normal, à voix haute.' }
      : state.phase === 'slow'
        ? { icon: 'volume-low' as IconName, title: 'Écoutez · lentement', detail: `Vitesse ${rateLabel(spec.slowRate)}` }
        : { icon: 'volume-high' as IconName, title: 'Écoutez · vitesse normale', detail: `Vitesse ${rateLabel(spec.normalRate)}` };

  return (
    <Screen>
      <View style={s.topBar}>
        <View style={[s.chip, { backgroundColor: tint(levelColor(t, level), t.button === 'brutal' ? 1 : 0.14) }]}>
          <Text style={[s.chipText, t.button !== 'brutal' && { color: textOn(t, levelColor(t, level)) }]}>
            {level} · {spec.name}
          </Text>
        </View>
        <Text style={s.counter}>
          Phrase {state.index + 1} / {props.sentences.length}
        </Text>
      </View>
      <Segments total={props.sentences.length} index={state.index} />

      <Card style={s.sentenceCard}>
        {props.showText ? (
          <Text style={s.sentence} accessibilityLanguage="fr-FR">
            {sentence.fr}
          </Text>
        ) : (
          <View style={s.masked}>
            <Ionicons name="ear-outline" size={30} color={t.colors.muted} />
            <Text style={s.maskedText}>Écoutez d’abord… le texte apparaîtra après.</Text>
          </View>
        )}
        <Pressable accessibilityRole="button" onPress={props.onToggleEn} style={s.enToggle} hitSlop={8}>
          <Ionicons name={props.showEn ? 'eye-off-outline' : 'language-outline'} size={16} color={t.colors.accentText} />
          <Text style={s.enToggleText}>{props.showEn ? 'Masquer la traduction' : 'Voir la traduction'}</Text>
        </Pressable>
        {props.showEn && <Text style={s.en}>{sentence.en}</Text>}
      </Card>

      <Card style={[s.status, turn && playing && s.statusTurn]}>
        <PhaseTrack level={level} phase={state.phase} />
        <View style={s.statusRow}>
          <View style={[s.statusIcon, turn && playing && s.statusIconTurn]}>
            <Ionicons name={message.icon} size={22} color={turn && playing && t.button !== 'brutal' ? t.colors.onColor : t.colors.ink} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.statusTitle}>{message.title}</Text>
            <Text style={s.statusDetail}>{message.detail}</Text>
          </View>
          {state.gap && <Text style={s.seconds}>{Math.ceil(left / 1000)} s</Text>}
        </View>
        {state.gap && (
          <View style={s.countTrack}>
            <View style={[s.countFill, { width: `${pct}%` }]} />
          </View>
        )}
      </Card>

      <View style={s.controls}>
        <RoundButton icon="play-skip-back" label="Précédente" onPress={props.onPrevious} disabled={state.index === 0} />
        <RoundButton icon="refresh" label="Rejouer" onPress={props.onReplay} />
        <RoundButton icon={playing ? 'pause' : 'play'} label={playing ? 'Pause' : 'Reprendre'} big onPress={props.onToggle} />
        <RoundButton icon="play-skip-forward" label="Suivante" onPress={props.onNext} />
      </View>

      <Pressable accessibilityRole="button" onPress={props.onQuit} style={s.quit} hitSlop={8}>
        <Text style={s.quitText}>Arrêter la série</Text>
      </Pressable>
    </Screen>
  );
}

const textOn = (t: Theme, c: string) =>
  ({ [t.colors.green]: t.colors.greenText, [t.colors.amber]: t.colors.amberText, [t.colors.red]: t.colors.redText, [t.colors.accent]: t.colors.accentText })[c] ?? c;

function Segments({ total, index }: { total: number; index: number }) {
  const s = useStyles();
  return (
    <View style={s.segments} accessibilityLabel={`Phrase ${index + 1} sur ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[s.segment, i < index && s.segmentDone, i === index && s.segmentNow]} />
      ))}
    </View>
  );
}

function RoundButton({ icon, label, onPress, big, disabled }: { icon: IconName; label: string; onPress: () => void; big?: boolean; disabled?: boolean }) {
  const t = useTheme();
  const s = useStyles();
  const brutal = t.button === 'brutal';
  const bg = big ? t.colors.primary : t.colors.card;
  const fg = big ? (brutal ? t.colors.ink : t.colors.onColor) : brutal ? t.colors.ink : t.colors.accentText;
  return (
    <View style={s.roundWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => {
          tap();
          onPress();
        }}
        style={({ pressed }) => [
          s.round,
          big && s.roundBig,
          { backgroundColor: bg },
          brutal
            ? [s.roundBrutal, pressed && s.roundBrutalPressed]
            : [
                { borderColor: big ? bg : tint(t.colors.accent, 0.35), borderBottomColor: big ? shade(bg) : tint(t.colors.accent, 0.6) },
                pressed && s.roundRaisedPressed,
              ],
          disabled && { opacity: 0.35 },
        ]}
      >
        <Ionicons name={icon} size={big ? 34 : 22} color={fg} style={icon === 'play' ? { marginLeft: 4 } : null} />
      </Pressable>
      <Text style={s.roundLabel}>{label}</Text>
    </View>
  );
}

// ——— End of the series ———

function Finished(props: { sentences: Sentence[]; level: ShadowLevel; completed: number; counted: boolean; onAgain: () => void; onChangeLevel: () => void }) {
  const t = useTheme();
  const s = useStyles();
  const spec = LEVEL_SPECS[props.level];
  const [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => () => stopSpeech(), []);
  const n = props.completed;
  return (
    <Screen>
      <Card style={s.doneCard}>
        <View style={s.doneIcon}>
          <Ionicons name={n > 0 ? 'checkmark' : 'play-skip-forward'} size={34} color={t.button === 'brutal' ? t.colors.ink : t.colors.onColor} />
        </View>
        <H2>{n > 0 ? `Bravo ! ${n} phrase${n > 1 ? 's' : ''} répétée${n > 1 ? 's' : ''}` : 'Série terminée'}</H2>
        <Body muted>
          Niveau {props.level} · lent {rateLabel(spec.slowRate)} · normal {rateLabel(spec.normalRate)}
        </Body>
        <View style={[s.doneNote, props.counted && s.doneNoteOk]}>
          <Ionicons name={props.counted ? 'checkmark-circle' : 'information-circle-outline'} size={18} color={props.counted ? t.colors.greenText : t.colors.muted} />
          <Text style={[s.doneNoteText, props.counted && { color: t.colors.greenText }]}>
            {props.counted
              ? 'Étape « Répéter après le modèle » validée pour aujourd’hui.'
              : `Répétez au moins ${Math.ceil(props.sentences.length * 0.75)} phrases jusqu’au bout pour valider l’étape du jour.`}
          </Text>
        </View>
      </Card>

      <Card>
        <Label>Les phrases de la série</Label>
        {props.sentences.map((x, i) => (
          <Pressable
            key={x.id}
            accessibilityRole="button"
            accessibilityLabel={`Réécouter : ${x.fr}`}
            onPress={() => {
              setPlaying(x.id);
              speakAt(x.fr, spec.normalRate, () => setPlaying(null));
            }}
            style={({ pressed }) => [s.review, i > 0 && s.reviewSep, pressed && { opacity: 0.6 }]}
          >
            <Text style={s.reviewText}>{x.fr}</Text>
            <Ionicons name={playing === x.id ? 'volume-high' : 'volume-medium-outline'} size={20} color={t.colors.accentText} />
          </Pressable>
        ))}
      </Card>

      <Footer>
        <Row>
          <Button title="Changer de niveau" variant="outline" onPress={props.onChangeLevel} />
          <Button title="Nouvelle série" icon="refresh" onPress={props.onAgain} />
        </Row>
      </Footer>
    </Screen>
  );
}

const useStyles = makeStyles((t) => {
  const brutal = t.button === 'brutal';
  const ink = t.colors.ink;
  return {
    settings: { gap: 12 },
    optionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: t.radius.field,
      backgroundColor: brutal ? t.colors.card : t.colors.soft,
      ...(brutal ? { borderWidth: 2, borderColor: ink } : null),
    },
    optionsText: { flex: 1, fontSize: 14, fontWeight: '600', color: t.colors.ink },
    optionsEdit: { fontSize: 14, fontWeight: '800', color: t.colors.accentText },
    hint: { fontSize: 13, lineHeight: 18, fontWeight: '500', color: t.colors.muted, marginTop: -4 },
    divider: { height: brutal ? 2 : 1, backgroundColor: brutal ? ink : t.colors.border, marginVertical: 2 },

    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      backgroundColor: t.colors.card,
      borderRadius: t.radius.card,
      borderWidth: t.id === 'bonbon' ? 2.5 : t.card.borderWidth,
      borderColor: t.id === 'bonbon' ? t.colors.card : t.card.borderColor,
      ...(t.card.boxShadow ? { boxShadow: t.card.boxShadow } : null),
    },
    optionSelected:
      t.id === 'cahier'
        ? { backgroundColor: t.colors.soft }
        : t.id === 'metro'
          ? { backgroundColor: t.colors.soft, borderColor: t.colors.accent }
          : { borderColor: t.colors.accent },
    pressed: brutal ? { boxShadow: `0px 0px 0px ${ink}`, transform: [{ translateX: 4 }, { translateY: 4 }] } : { opacity: 0.85 },
    badge: {
      width: 52,
      height: 52,
      borderRadius: brutal ? 10 : t.id === 'bonbon' ? 18 : 12,
      alignItems: 'center',
      justifyContent: 'center',
      ...(brutal ? { borderWidth: 2.5, borderColor: ink } : { borderBottomWidth: 3, borderColor: 'transparent' }),
    },
    badgeText: { fontFamily: 'head', fontWeight: '800', fontSize: 19 },
    optName: { fontFamily: 'head', fontWeight: '700', fontSize: t.headUpper ? 15 : 18, lineHeight: 22, color: ink },
    optDetail: { fontSize: 14, lineHeight: 19, fontWeight: '500', color: t.colors.muted },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    optMeta: { flexShrink: 1, fontSize: 12, lineHeight: 17, fontWeight: '700', color: t.colors.accentText },
    meter: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 14 },
    meterBar: { width: 4, borderRadius: brutal ? 0 : 2 },
    meterOn: { backgroundColor: brutal ? ink : t.colors.accent },
    meterOff: brutal ? { borderWidth: 1.5, borderColor: ink } : { backgroundColor: t.colors.track },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: brutal ? ink : t.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.card,
    },
    radioOn: { borderColor: brutal ? ink : t.colors.accent },
    radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: brutal ? ink : t.colors.accent },

    segTrack: {
      flexDirection: 'row',
      padding: brutal ? 0 : 4,
      gap: brutal ? 0 : 4,
      borderRadius: brutal ? 10 : t.id === 'bonbon' ? 999 : 12,
      backgroundColor: brutal ? t.colors.card : t.id === 'bonbon' ? t.colors.soft : t.colors.bg,
      borderWidth: brutal ? 2.5 : t.id === 'metro' ? 1.5 : 0,
      borderColor: brutal ? ink : t.colors.border,
      overflow: 'hidden',
    },
    seg: { flex: 1, minHeight: 40, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderRadius: brutal ? 0 : t.id === 'bonbon' ? 999 : 9 },
    segSep: brutal ? { borderLeftWidth: 2.5, borderLeftColor: ink } : {},
    segOn: brutal
      ? { backgroundColor: t.colors.soft }
      : t.id === 'bonbon'
        ? { backgroundColor: t.colors.card, boxShadow: '0px 2px 8px rgba(106, 69, 224, 0.18)' }
        : { backgroundColor: t.colors.primary },
    segText: { fontSize: 14, fontWeight: '700', color: t.colors.muted },
    segTextOn: { color: brutal ? ink : t.id === 'bonbon' ? t.colors.accentText : t.colors.onColor },

    track: { flexDirection: 'row', position: 'relative' },
    trackLine: {
      position: 'absolute',
      top: 18,
      left: '12.5%',
      right: '12.5%',
      height: brutal ? 3 : 4,
      marginTop: brutal ? -1.5 : -2,
      borderRadius: 2,
      backgroundColor: brutal ? ink : t.colors.track,
    },
    trackLineOn: { backgroundColor: brutal ? ink : t.colors.accent },
    station: { flex: 1, alignItems: 'center', gap: 3 },
    stationDot: {
      width: 36,
      height: 36,
      borderRadius: brutal ? 8 : 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: brutal ? 2.5 : 2,
      borderColor: brutal ? ink : t.colors.track,
    },
    stationDotOn: brutal ? {} : { borderColor: 'transparent' },
    stationDotActive: brutal ? { boxShadow: `3px 3px 0px ${ink}` } : { boxShadow: `0px 0px 0px 4px ${tint(t.colors.accent, 0.18)}` },
    stationLabel: { fontSize: 13, fontWeight: '700', color: t.colors.muted, marginTop: 2 },
    stationLabelOn: { color: ink },
    stationSub: { fontSize: 11, fontWeight: '600', color: t.colors.muted },

    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: brutal ? 8 : 999,
      ...(brutal ? { borderWidth: 2.5, borderColor: ink } : null),
    },
    chipText: { fontSize: 14, fontWeight: '800', color: ink },
    counter: { fontSize: 14, fontWeight: '700', color: t.colors.muted, fontVariant: ['tabular-nums'] },
    segments: { flexDirection: 'row', gap: 5, marginTop: -4 },
    segment: {
      flex: 1,
      height: 8,
      borderRadius: brutal ? 0 : 4,
      backgroundColor: brutal ? t.colors.card : t.colors.track,
      ...(brutal ? { borderWidth: 2, borderColor: ink } : null),
    },
    segmentDone: { backgroundColor: brutal ? t.colors.green : t.colors.accent },
    segmentNow: { backgroundColor: brutal ? t.colors.soft : tint(t.colors.accent, 0.45) },

    sentenceCard: { paddingVertical: 26, paddingHorizontal: 20, gap: 14, alignItems: 'center', minHeight: 170, justifyContent: 'center' },
    sentence: { fontFamily: t.headUpper ? 'body' : 'head', fontSize: 24, lineHeight: 33, fontWeight: '700', color: ink, textAlign: 'center' },
    masked: { alignItems: 'center', gap: 8, paddingVertical: 6 },
    maskedText: { fontSize: 16, lineHeight: 22, fontWeight: '600', color: t.colors.muted, textAlign: 'center', fontStyle: 'italic' },
    enToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 },
    enToggleText: { fontSize: 14, fontWeight: '700', color: t.colors.accentText },
    en: { fontSize: 15, lineHeight: 21, fontWeight: '500', color: t.colors.muted, textAlign: 'center', marginTop: -6 },

    status: { gap: 16, paddingVertical: 18 },
    statusTurn: brutal ? { backgroundColor: t.skills.speaking.bg } : { backgroundColor: t.skills.speaking.bg, borderColor: t.skills.speaking.bg },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    statusIcon: {
      width: 44,
      height: 44,
      borderRadius: brutal ? 10 : 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brutal ? t.colors.card : t.colors.soft,
      ...(brutal ? { borderWidth: 2.5, borderColor: ink } : null),
    },
    statusIconTurn: { backgroundColor: brutal ? t.colors.card : t.skills.speaking.color },
    statusTitle: { fontFamily: t.headUpper ? 'body' : 'head', fontSize: 18, lineHeight: 23, fontWeight: '700', color: brutal ? ink : ink },
    statusDetail: { fontSize: 14, lineHeight: 19, fontWeight: '500', color: t.colors.muted },
    seconds: { fontFamily: t.headUpper ? 'body' : 'head', fontSize: 24, fontWeight: '800', color: brutal ? ink : t.skills.speaking.ink, fontVariant: ['tabular-nums'] },
    countTrack: {
      height: 10,
      borderRadius: brutal ? 0 : 5,
      overflow: 'hidden',
      backgroundColor: brutal ? t.colors.card : tint(t.skills.speaking.color, 0.18),
      ...(brutal ? { borderWidth: 2, borderColor: ink } : null),
    },
    countFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: brutal ? ink : t.skills.speaking.color },

    controls: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 4 },
    roundWrap: { alignItems: 'center', gap: 6, flex: 1 },
    round: {
      width: 56,
      height: 56,
      borderRadius: brutal ? 14 : 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderBottomWidth: 4,
      marginVertical: 11, // same height as the big button, so the labels line up
    },
    roundBig: { width: 78, height: 78, borderRadius: brutal ? 18 : 39, marginVertical: 0 },
    roundBrutal: { borderWidth: 3, borderBottomWidth: 3, borderColor: ink, boxShadow: `4px 4px 0px ${ink}` },
    roundBrutalPressed: { boxShadow: `0px 0px 0px ${ink}`, transform: [{ translateX: 4 }, { translateY: 4 }] },
    roundRaisedPressed: { borderBottomWidth: 2, transform: [{ translateY: 2 }] },
    roundLabel: { fontSize: 12, fontWeight: '700', color: t.colors.muted },
    quit: { alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16, marginTop: 4 },
    quitText: { fontSize: 15, fontWeight: '700', color: t.colors.muted, textDecorationLine: 'underline' },

    doneCard: { alignItems: 'center', gap: 10, paddingVertical: 24 },
    doneIcon: {
      width: 68,
      height: 68,
      borderRadius: brutal ? 16 : 34,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.green,
      ...(brutal ? { borderWidth: 3, borderColor: ink, boxShadow: `4px 4px 0px ${ink}` } : null),
    },
    doneNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      marginTop: 4,
      borderRadius: brutal ? 8 : 14,
      backgroundColor: brutal ? t.colors.card : t.colors.soft,
      ...(brutal ? { borderWidth: 2, borderColor: ink } : null),
    },
    doneNoteOk: { backgroundColor: brutal ? t.colors.card : tint(t.colors.green, 0.12) },
    doneNoteText: { flex: 1, fontSize: 14, lineHeight: 19, fontWeight: '600', color: t.colors.muted },
    review: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
    reviewSep: { borderTopWidth: brutal ? 2 : 1, borderTopColor: brutal ? ink : t.colors.border },
    reviewText: { flex: 1, fontSize: 16, lineHeight: 22, fontWeight: '600', color: ink },
  };
});
