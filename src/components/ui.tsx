import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import type { Theme } from '../theme/themes';

export function Screen({ children }: { children: ReactNode }) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={[s.fill, { backgroundColor: t.colors.bg }]}>
      {t.id === 'cahier' && <GridPaper />}
      <ScrollView style={s.fill} contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
  );
}

// Cahier's squared-paper background: faint lines every 24 px, fixed behind the content.
export function GridPaper() {
  const { width, height } = useWindowDimensions();
  const s = useStyles();
  const step = 24;
  return (
    <View pointerEvents="none" style={s.grid}>
      {Array.from({ length: Math.ceil(height / step) }, (_, i) => (
        <View key={`h${i}`} style={[s.gridH, { top: (i + 1) * step }]} />
      ))}
      {Array.from({ length: Math.ceil(width / step) }, (_, i) => (
        <View key={`v${i}`} style={[s.gridV, { left: (i + 1) * step }]} />
      ))}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle | (ViewStyle | false | null | undefined)[] }) {
  const s = useStyles();
  return <View style={[s.card, style]}>{children}</View>;
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={useStyles().h1}>{children}</Text>;
}

export function H2({ children }: { children: ReactNode }) {
  return <Text style={useStyles().h2}>{children}</Text>;
}

export function Body({ children, muted }: { children: ReactNode; muted?: boolean }) {
  const t = useTheme();
  return <Text style={[useStyles().body, muted && { color: t.colors.muted }]}>{children}</Text>;
}

// Small uppercase label above a block, e.g. « NOUVEAU MOT ».
export function Label({ children, center, color }: { children: ReactNode; center?: boolean; color?: string }) {
  const s = useStyles();
  return <Text style={[s.label, center && { textAlign: 'center' }, color ? { color } : null]}>{children}</Text>;
}

// Darker shade of a #RRGGBB colour, used for the raised bottom edge of buttons.
export function shade(hex: string, amount = 0.25) {
  const n = parseInt(hex.slice(1), 16);
  const c = (shift: number) => Math.round(((n >> shift) & 255) * (1 - amount));
  return `rgb(${c(16)}, ${c(8)}, ${c(0)})`;
}

// Tinted background for outline buttons and grade tiles.
export function tint(hex: string, alpha = 0.12) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// A theme colour used as text on a light background: pastel fills (Cahier) get their darker text version.
export function textColor(t: Theme, c: string) {
  const map: Record<string, string> = {
    [t.colors.green]: t.colors.greenText,
    [t.colors.amber]: t.colors.amberText,
    [t.colors.red]: t.colors.redText,
    [t.colors.accent]: t.colors.accentText,
  };
  return map[c] ?? c;
}

export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

// A button that looks pressable in every theme, with a light haptic tap.
// Bonbon and Métro: a darker bottom edge it sinks into. Cahier: a thick outline and a hard shadow it slides onto.
export function Button({
  title,
  onPress,
  color,
  textColor: textColorProp,
  variant = 'solid',
  disabled,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
}) {
  const t = useTheme();
  const s = useStyles();
  const c = color ?? t.colors.primary;
  const solid = variant === 'solid';
  const brutal = t.button === 'brutal';
  const fg = textColorProp ?? (brutal ? t.colors.ink : solid ? t.colors.onColor : textColor(t, c));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={() => {
        tap();
        onPress();
      }}
      disabled={disabled}
      style={({ pressed }) => [
        s.button,
        brutal
          ? [s.brutal, { backgroundColor: solid ? c : t.colors.card }, pressed && s.brutalPressed]
          : [
              {
                backgroundColor: solid ? c : t.colors.card,
                borderColor: solid ? c : tint(c, 0.45),
                borderBottomColor: solid ? shade(c) : tint(c, 0.7),
              },
              pressed && s.raisedPressed,
            ],
        disabled && { opacity: 0.4 },
      ]}
    >
      <Text style={[s.buttonText, { color: fg }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
        {title}
      </Text>
    </Pressable>
  );
}

// A thin progress bar in the theme's style.
export function Bar({ pct, color }: { pct: number; color?: string }) {
  const t = useTheme();
  const s = useStyles();
  return (
    <View style={s.barTrack}>
      {pct > 0 && <View style={[s.barFill, { width: `${Math.min(100, pct)}%`, backgroundColor: color ?? t.colors.accent }]} />}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  fill: { flex: 1 },
  screen: { padding: 16, gap: 14, paddingBottom: 40 },
  grid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#E9E2CF' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#E9E2CF' },
  card: {
    backgroundColor: t.colors.card,
    borderRadius: t.radius.card,
    padding: 16,
    gap: 8,
    borderWidth: t.card.borderWidth,
    borderColor: t.card.borderColor,
    ...(t.card.boxShadow ? { boxShadow: t.card.boxShadow } : null),
  },
  h1: { fontFamily: 'head', fontWeight: '800', fontSize: t.headUpper ? 28 : 30, lineHeight: t.headUpper ? 32 : 36, color: t.colors.ink },
  // Cahier keeps capitals for big titles only: its card titles are bold body text, as in the design.
  h2: { fontFamily: t.headUpper ? 'body' : 'head', fontWeight: '700', fontSize: t.headUpper ? 18 : 20, lineHeight: 25, color: t.colors.ink },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '500', color: t.colors.ink },
  label: { fontSize: 13, fontWeight: '800', letterSpacing: 1, color: t.colors.muted, textTransform: 'uppercase' },
  button: {
    minHeight: 52,
    borderRadius: t.radius.button,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brutal: { borderWidth: 3, borderBottomWidth: 3, borderColor: t.colors.ink, boxShadow: `4px 4px 0px ${t.colors.ink}` },
  // Slides onto its shadow when pressed.
  brutalPressed: { boxShadow: `0px 0px 0px ${t.colors.ink}`, transform: [{ translateX: 4 }, { translateY: 4 }] },
  // Sinks into its bottom edge when pressed.
  raisedPressed: { borderBottomWidth: 2, transform: [{ translateY: 2 }] },
  buttonText: { fontFamily: 'head', fontWeight: t.id === 'metro' ? '600' : '700', fontSize: t.headUpper ? 16 : 18 },
  barTrack: {
    height: 10,
    borderRadius: t.button === 'brutal' ? 0 : 5,
    backgroundColor: t.colors.track,
    overflow: 'hidden',
    borderWidth: t.button === 'brutal' ? 2 : 0,
    borderColor: t.colors.ink,
  },
  barFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
}));
