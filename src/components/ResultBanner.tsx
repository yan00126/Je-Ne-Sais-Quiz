import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { answerFeedback, setSoundEnabled, soundEnabled, type Outcome } from '../lib/feedback';
import { shade, tap, tint } from './ui';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import type { Theme } from '../theme/themes';

const ICON: Record<Outcome, keyof typeof Ionicons.glyphMap> = {
  correct: 'checkmark-circle',
  almost: 'alert-circle',
  wrong: 'close-circle',
};

// The button colour that goes with each result, e.g. for « Continuer ».
export function outcomeColor(t: Theme, outcome: Outcome) {
  return outcome === 'correct' ? t.colors.green : outcome === 'almost' ? t.colors.amber : t.colors.red;
}

// The coloured panel that slides up after an answer is checked. Mounting it plays the haptic and sound,
// and its speaker button turns the sounds on or off.
export function ResultBanner({
  outcome,
  title,
  detail,
  children,
}: {
  outcome: Outcome;
  title: string;
  detail?: string;
  children?: ReactNode;
}) {
  const t = useTheme();
  const styles = useStyles();
  const icon = ICON[outcome];
  const color = outcomeColor(t, outcome);
  // Cahier: a solid sticker in the result colour with black text. Others: a soft tint with coloured text.
  const brutal = t.button === 'brutal';
  const fg = brutal ? t.colors.ink : shade(color, 0.1);
  const slide = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0.3)).current;
  const [sound, setSound] = useState(soundEnabled);

  useEffect(() => {
    answerFeedback(outcome);
    Animated.parallel([
      Animated.timing(slide, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
  }, []);

  function toggleSound() {
    tap();
    setSoundEnabled(!sound);
    setSound(!sound);
  }

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        brutal ? { backgroundColor: color } : { backgroundColor: tint(color, 0.14), borderColor: tint(color, 0.45) },
        { opacity: slide, transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] },
      ]}
    >
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: pop }] }}>
          <Ionicons name={icon} size={38} color={brutal ? t.colors.ink : color} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: fg }]}>{title}</Text>
          {detail ? <Text style={[styles.detail, { color: brutal ? t.colors.ink : shade(color, 0.2) }]}>{detail}</Text> : null}
        </View>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Sons"
          accessibilityState={{ checked: sound }}
          hitSlop={10}
          onPress={toggleSound}
          style={styles.sound}
        >
          <Ionicons name={sound ? 'volume-high' : 'volume-mute'} size={20} color={fg} />
        </Pressable>
      </View>
      {children}
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  banner:
    t.button === 'brutal'
      ? { borderRadius: t.radius.card, borderWidth: 2.5, borderColor: t.colors.ink, boxShadow: `4px 4px 0px ${t.colors.ink}`, padding: 14, gap: 12 }
      : { borderRadius: t.radius.card, borderWidth: 1.5, padding: 14, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontFamily: 'head', fontWeight: '800', fontSize: 22 },
  detail: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  sound: { padding: 6, opacity: 0.8 },
}));
