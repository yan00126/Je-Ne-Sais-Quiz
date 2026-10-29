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
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: solid ? color : 'transparent', borderColor: color, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, { color: solid ? '#fff' : color }]}>{title}</Text>
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
  button: { borderRadius: 10, borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
