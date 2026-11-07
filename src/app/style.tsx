import { Pressable, Text, View } from 'react-native';
import { Body, H1, Screen, tap } from '../components/ui';
import { makeStyles, useSetTheme, useTheme } from '../theme/ThemeProvider';
import { THEME_ORDER, THEMES, type ThemeId } from '../theme/themes';

// « Ton style »: pick one of the three looks. It applies at once; the plan and progress don't change.
export default function StylePicker() {
  const t = useTheme();
  const setTheme = useSetTheme();
  const s = useStyles();
  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <H1>Ton style</H1>
        <Body muted>Change l’apparence de l’appli. Ton plan et tes progrès ne bougent pas.</Body>
      </View>
      {THEME_ORDER.map((id) => {
        const selected = t.id === id;
        return (
          <Pressable
            key={id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${THEMES[id].name} : ${THEMES[id].tagline}`}
            onPress={() => {
              tap();
              setTheme(id);
            }}
            style={({ pressed }) => [s.option, selected && s.selected, pressed && s.pressed]}
          >
            <Preview id={id} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={s.name}>{THEMES[id].name}</Text>
              <Text style={s.tagline}>{THEMES[id].tagline}</Text>
            </View>
            <View style={s.radio}>{selected && <View style={s.dot} />}</View>
          </Pressable>
        );
      })}
    </Screen>
  );
}

// A thumbnail of each look's Today screen, drawn in that look's own colours whatever the current theme.
function Preview({ id }: { id: ThemeId }) {
  const s = useStyles();
  if (id === 'bonbon') {
    return (
      <View style={[s.thumb, { backgroundColor: '#EDE6FF', borderRadius: 16, gap: 6 }]}>
        <View style={{ height: 18, borderRadius: 8, backgroundColor: '#7A5AF0' }} />
        {[
          ['#D4F7EA', '#FFE0F0'],
          ['#FFF0C7', '#DDEBFF'],
        ].map((row) => (
          <View key={row[0]} style={{ flex: 1, flexDirection: 'row', gap: 5 }}>
            {row.map((c) => (
              <View key={c} style={{ flex: 1, borderRadius: 8, backgroundColor: c }} />
            ))}
          </View>
        ))}
        <View style={{ height: 10, borderRadius: 99, backgroundColor: '#2A2350' }} />
      </View>
    );
  }
  if (id === 'cahier') {
    const box = { height: 14, borderRadius: 4, borderWidth: 1.5, borderColor: '#111111', boxShadow: '2px 2px 0px #111111' } as const;
    return (
      <View style={[s.thumb, { backgroundColor: '#FFFBEF', borderRadius: 10, borderWidth: 2, borderColor: '#111111', gap: 5, padding: 7 }]}>
        <View style={{ height: 12, borderRadius: 4, backgroundColor: '#111111' }} />
        <View style={[box, { backgroundColor: '#2EC4B6' }]} />
        <View style={[box, { backgroundColor: '#FFFFFF' }]} />
        <View style={[box, { backgroundColor: '#FFFFFF' }]} />
        <View style={[box, { backgroundColor: '#4D7CFE', marginTop: 'auto' }]} />
      </View>
    );
  }
  const stop = (c: string, filled: boolean, ring?: boolean) => (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: filled ? c : '#FFFFFF',
        borderWidth: filled ? 0 : 2.5,
        borderColor: c,
        ...(ring ? { boxShadow: '0px 0px 0px 2px #FFC72C' } : null),
      }}
    />
  );
  const rail = (c: string) => <View style={{ width: 3, flex: 1, backgroundColor: c }} />;
  return (
    <View style={[s.thumb, { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1.5, borderColor: '#D5DCE5', gap: 7 }]}>
      <View style={{ height: 14, borderRadius: 4, backgroundColor: '#10285A' }} />
      <View style={{ flex: 1, flexDirection: 'row', gap: 7 }}>
        <View style={{ width: 12, alignItems: 'center' }}>
          {stop('#13804F', true)}
          {rail('#13804F')}
          {stop('#2457D6', true, true)}
          {rail('#2457D6')}
          {stop('#C24A0C', false)}
          {rail('#C24A0C')}
          {stop('#7B3FB0', false)}
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 2 }}>
          {['80%', '100%', '70%', '85%'].map((w) => (
            <View key={w} style={{ height: 5, width: w as `${number}%`, borderRadius: 3, backgroundColor: '#D5DCE5' }} />
          ))}
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    backgroundColor: t.colors.card,
    borderRadius: t.radius.card,
    borderWidth: t.id === 'bonbon' ? 3 : t.card.borderWidth,
    borderColor: t.id === 'bonbon' ? t.colors.card : t.card.borderColor,
    ...(t.card.boxShadow ? { boxShadow: t.card.boxShadow } : null),
  },
  selected:
    t.id === 'cahier'
      ? { backgroundColor: t.colors.soft }
      : t.id === 'metro'
        ? { backgroundColor: t.colors.soft, borderColor: t.colors.accent }
        : { borderColor: t.colors.accent },
  pressed: t.id === 'cahier' ? { boxShadow: `0px 0px 0px ${t.colors.ink}`, transform: [{ translateX: 4 }, { translateY: 4 }] } : { opacity: 0.85 },
  thumb: { width: 88, height: 104, padding: 8 },
  name: { fontFamily: 'head', fontWeight: '800', fontSize: 20, color: t.colors.ink },
  tagline: { fontSize: 14, lineHeight: 19, fontWeight: '600', color: t.colors.muted },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2.5, borderColor: t.colors.ink, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: t.id === 'cahier' ? t.colors.ink : t.colors.accent },
}));
