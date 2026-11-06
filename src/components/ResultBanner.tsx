import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { answerFeedback, setSoundEnabled, soundEnabled, type Outcome } from '../lib/feedback';
import { colors, shade, tap, tint } from './ui';

const LOOK: Record<Outcome, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  correct: { color: colors.green, icon: 'checkmark-circle' },
  almost: { color: colors.amber, icon: 'alert-circle' },
  wrong: { color: colors.red, icon: 'close-circle' },
};

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
  const { color, icon } = LOOK[outcome];
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
        { backgroundColor: tint(color, 0.14), borderColor: tint(color, 0.45) },
        { opacity: slide, transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] },
      ]}
    >
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: pop }] }}>
          <Ionicons name={icon} size={38} color={color} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: shade(color, 0.1) }]}>{title}</Text>
          {detail ? <Text style={[styles.detail, { color: shade(color, 0.2) }]}>{detail}</Text> : null}
        </View>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Sons"
          accessibilityState={{ checked: sound }}
          hitSlop={10}
          onPress={toggleSound}
          style={styles.sound}
        >
          <Ionicons name={sound ? 'volume-high' : 'volume-mute'} size={20} color={shade(color, 0.1)} />
        </Pressable>
      </View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 16, borderWidth: 1.5, padding: 14, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: '800' },
  detail: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  sound: { padding: 6, opacity: 0.8 },
});
