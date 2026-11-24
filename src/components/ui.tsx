import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarHeightContext } from 'expo-router/js-tabs';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type ScrollViewInstance,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import type { Theme } from '../theme/themes';

// Lets a <Footer> anywhere inside a Screen put its buttons in that Screen's bottom bar.
const FooterSlot = createContext<((node: ReactNode) => void) | null>(null);

// A scrolling page. Buttons given with `footer` or <Footer> stay pinned at the bottom, above the keyboard when it
// is open, so the next action never needs a scroll. `followEnd` keeps the newest content in view as the page grows
// (a chat). `fieldAtEnd`: what goes with the text field is at the end of the page, so scroll there when the keyboard opens.
// A text field goes in the `footer` prop, never in <Footer>: <Footer> reaches the bar one render late.
export function Screen({
  children,
  footer: footerProp,
  followEnd,
  fieldAtEnd,
}: {
  children: ReactNode;
  footer?: ReactNode;
  followEnd?: boolean;
  fieldAtEnd?: boolean;
}) {
  const t = useTheme();
  const s = useStyles();
  const [slot, setSlot] = useState<ReactNode>(null);
  const footer = footerProp ?? slot;
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
  // In a tab, the tab bar below already keeps clear of the home indicator.
  const inTabs = useContext(BottomTabBarHeightContext) !== undefined;
  const insets = useSafeAreaInsets();
  const bottom = inTabs ? 0 : insets.bottom;
  const scroll = useRef<ScrollViewInstance>(null);
  const keyboard = useKeyboardOpen(() => fieldAtEnd && scroll.current?.scrollToEnd({ animated: true }));
  // followEnd: only when the content grows after the first layout, so the page still opens at the top.
  const height = useRef(0);
  return (
    <View style={[s.fill, { backgroundColor: t.colors.bg }]}>
      {t.id === 'cahier' && <GridPaper />}
      <KeyboardAvoidingView style={s.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={headerHeight}>
        <FooterSlot.Provider value={setSlot}>
          <ScrollView
            ref={scroll}
            style={s.fill}
            contentContainerStyle={s.screen}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={
              followEnd
                ? (_w, h) => {
                    if (height.current && h > height.current) scroll.current?.scrollToEnd({ animated: true });
                    height.current = h;
                  }
                : undefined
            }
          >
            {children}
          </ScrollView>
        </FooterSlot.Provider>
        {footer ? <BottomBar paddingBottom={keyboard ? 10 : Math.max(bottom, 12)}>{footer}</BottomBar> : null}
      </KeyboardAvoidingView>
    </View>
  );
}

// The pinned bar at the bottom of a page that holds its main actions. Screen uses it for its footer;
// pages with their own layout (Aujourd'hui) use it directly. `plain`: no top rule, on the page background.
export function BottomBar({ children, paddingBottom = 12, plain }: { children: ReactNode; paddingBottom?: number; plain?: boolean }) {
  const s = useStyles();
  return <View style={[s.footer, plain && s.footerPlain, { paddingBottom }]}>{children}</View>;
}

// The buttons of a Screen's pinned bottom bar. Renders nothing where it stands.
export function Footer({ children }: { children: ReactNode }) {
  const set = useContext(FooterSlot);
  useLayoutEffect(() => {
    set?.(children);
  });
  useLayoutEffect(() => () => set?.(null), [set]);
  return null;
}

function useKeyboardOpen(onShown: () => void) {
  const [open, setOpen] = useState(false);
  const shown = useRef(onShown);
  shown.current = onShown;
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setOpen(true));
    const done = Keyboard.addListener('keyboardDidShow', () => shown.current());
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setOpen(false));
    return () => {
      show.remove();
      done.remove();
      hide.remove();
    };
  }, []);
  return open;
}

// Two or more buttons side by side, sharing the width.
export function Row({ children }: { children: ReactNode }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <View style={useStyles().row}>
      {items.map((c, i) => (
        <View key={i} style={{ flex: 1 }}>
          {c}
        </View>
      ))}
    </View>
  );
}

// A panel that slides up from the bottom over a dimmed page: settings, options, confirmations.
// Tapping outside or the close button calls onClose.
export function Sheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const t = useTheme();
  const s = useStyles();
  const bottom = useSafeAreaInsets().bottom;
  const slide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      // A sheet opened while typing would sit under the keyboard.
      Keyboard.dismiss();
      slide.setValue(0);
      Animated.spring(slide, { toValue: 1, friction: 9, tension: 80, useNativeDriver: true }).start();
    }
  }, [visible, slide]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={s.sheetWrap}>
        <Pressable style={s.backdrop} onPress={onClose} accessible={false} importantForAccessibility="no" />
        <Animated.View
          accessibilityViewIsModal
          style={[
            s.sheet,
            { paddingBottom: Math.max(bottom, 16) + 4 },
            { transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }] },
          ]}
        >
          {t.button !== 'brutal' && <View style={s.grabber} />}
          <View style={s.sheetHead}>
            <Text style={[s.h2, { flex: 1 }]} accessibilityRole="header">
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              hitSlop={10}
              onPress={() => {
                tap();
                onClose();
              }}
              style={s.close}
            >
              <Ionicons name="close" size={22} color={t.colors.ink} />
            </Pressable>
          </View>
          {/* Scrolls only if the content is taller than the sheet can be (small phones). */}
          <ScrollView style={s.sheetBody} contentContainerStyle={s.sheetContent} bounces={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
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
  icon,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
  icon?: ComponentProps<typeof Ionicons>['name'];
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
        icon && { flexDirection: 'row', gap: 8 },
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
      {icon && <Ionicons name={icon} size={20} color={fg} />}
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
  row: { flexDirection: 'row', gap: 8 },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
    backgroundColor: t.colors.bg,
    borderTopWidth: t.button === 'brutal' ? 2.5 : 1,
    borderTopColor: t.button === 'brutal' ? t.colors.ink : t.colors.border,
  },
  footerPlain: { borderTopWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 20, paddingTop: 8 },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20, 16, 40, 0.45)' },
  sheet: {
    backgroundColor: t.colors.bg,
    borderTopLeftRadius: t.button === 'brutal' ? 14 : 28,
    borderTopRightRadius: t.button === 'brutal' ? 14 : 28,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 14,
    maxHeight: '88%',
    ...(t.button === 'brutal' ? { borderWidth: 2.5, borderBottomWidth: 0, borderColor: t.colors.ink, paddingTop: 16 } : null),
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: t.colors.border },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetBody: { flexGrow: 0, flexShrink: 1 },
  sheetContent: { gap: 14 },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.button === 'brutal' ? t.colors.card : t.colors.soft,
    ...(t.button === 'brutal' ? { borderWidth: 2, borderColor: t.colors.ink } : null),
  },
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
