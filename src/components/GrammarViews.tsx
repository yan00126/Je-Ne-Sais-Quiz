import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import type { GrammarRule } from '../data/grammar';
import { play } from '../lib/audio';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import { Sheet, tap } from './ui';

// A grammar rule card in a bottom sheet: the rule, its examples (tap one to hear it) and the usual mistake.
export function RuleSheet({ rule, onClose }: { rule: GrammarRule | null; onClose: () => void }) {
  const s = useStyles();
  const t = useTheme();
  return (
    <Sheet visible={rule !== null} title={rule?.title ?? ''} onClose={onClose}>
      {rule && (
        <View style={{ gap: 12 }}>
          <Text style={s.meta}>
            {rule.topic} · {rule.level} · {rule.id}
          </Text>
          <Text style={s.rule}>{rule.rule}</Text>
          <View style={{ gap: 8 }}>
            {rule.examples.map((e) => (
              <Pressable
                key={e.fr}
                accessibilityRole="button"
                accessibilityHint="Écouter l’exemple"
                onPress={() => {
                  tap();
                  play(e.fr);
                }}
                style={({ pressed }) => [s.example, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name="volume-medium-outline" size={18} color={t.colors.accentText} />
                <View style={{ flex: 1 }}>
                  <Text style={s.fr}>{e.fr}</Text>
                  <Text style={s.en}>{e.en}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          {rule.pitfall && (
            <View style={s.pitfall}>
              <Text style={s.pitfallLabel}>Erreur fréquente</Text>
              <Text style={s.pitfallText}>{rule.pitfall}</Text>
            </View>
          )}
        </View>
      )}
    </Sheet>
  );
}

// One rule in a list: its title, level and topic, opening the card when tapped.
export function RuleRow({ rule, first, onPress, detail }: { rule: GrammarRule; first?: boolean; onPress: () => void; detail?: string }) {
  const s = useStyles();
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [s.row, !first && s.sep, pressed && { backgroundColor: t.colors.soft }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{rule.title}</Text>
        <Text style={s.rowDetail}>{detail ?? `${rule.level} · ${rule.topic}`}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={t.colors.muted} />
    </Pressable>
  );
}

export const useGrammarList = makeStyles((t) => {
  const brutal = t.button === 'brutal';
  return {
    list: {
      backgroundColor: t.colors.card,
      borderWidth: brutal ? 2.5 : 1.5,
      borderColor: brutal ? t.colors.ink : t.colors.border,
      borderRadius: brutal ? 14 : 18,
      overflow: 'hidden',
    },
  };
});

const useStyles = makeStyles((t) => {
  const brutal = t.button === 'brutal';
  return {
    meta: { fontSize: 13, fontWeight: '600', color: t.colors.muted },
    rule: { fontSize: 17, lineHeight: 24, color: t.colors.ink },
    example: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: t.colors.soft, borderRadius: brutal ? 8 : 12, padding: 10 },
    fr: { fontSize: 16, fontWeight: '600', color: t.colors.ink },
    en: { fontSize: 14, color: t.colors.muted },
    pitfall: { gap: 4, borderLeftWidth: 4, borderLeftColor: t.colors.amber, paddingLeft: 10 },
    pitfallLabel: { fontSize: 13, fontWeight: '700', color: t.colors.amberText },
    pitfallText: { fontSize: 15, lineHeight: 21, color: t.colors.ink },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
    sep: { borderTopWidth: brutal ? 2 : 1, borderTopColor: brutal ? t.colors.ink : t.colors.border },
    rowTitle: { fontSize: 16, fontWeight: '700', color: t.colors.ink },
    rowDetail: { fontSize: 13, fontWeight: '600', color: t.colors.muted },
  };
});
