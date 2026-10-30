import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';

export const colors = {
  bg: '#F6F4EF',
  card: '#FFFFFF',
  ink: '#1B1F3B',
  muted: '#6B6F80',
  border: '#E3E0D8',
  blue: '#1F4FD8',
  red: '#D8343F',
  green: '#1E8A4C',
  amber: '#C27C0E',
};

export function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.screen}>
      {children}
    </ScrollView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={styles.h1}>{children}</Text>;
}

export function H2({ children }: { children: ReactNode }) {
  return <Text style={styles.h2}>{children}</Text>;
}

export function Body({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <Text style={[styles.body, muted && { color: colors.muted }]}>{children}</Text>;
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

export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

// A raised button: it has a darker bottom edge and sinks into it when pressed, with a light haptic tap.
export function Button({
  title,
  onPress,
  color = colors.blue,
  variant = 'solid',
  disabled,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
}) {
  const solid = variant === 'solid';
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
        styles.button,
        {
          backgroundColor: solid ? color : colors.card,
          borderColor: solid ? color : tint(color, 0.45),
          borderBottomColor: solid ? shade(color) : tint(color, 0.7),
          opacity: disabled ? 0.4 : 1,
        },
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, { color: solid ? '#fff' : color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  h1: { fontSize: 26, fontWeight: '700', color: colors.ink },
  h2: { fontSize: 18, fontWeight: '600', color: colors.ink },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  button: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sinks into its bottom edge when pressed.
  buttonPressed: { borderBottomWidth: 2, transform: [{ translateY: 2 }] },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
