import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import type { Voice } from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Card, colors, H2, Screen, tap, tint } from '../components/ui';
import { getFrenchVoices, getVoiceChoice, previewVoice, setVoiceChoice } from '../lib/speech';
import { voiceTier, type Tier } from '../lib/voices';

const TIER_LABEL: Record<Tier, string> = { premium: 'Premium', enhanced: 'Améliorée', standard: 'Standard', novelty: 'Robotique' };
const TIER_COLOR: Record<Tier, string> = { premium: colors.green, enhanced: colors.blue, standard: colors.muted, novelty: colors.muted };
const REGION: Record<string, string> = { FR: 'France', CA: 'Canada', BE: 'Belgique', CH: 'Suisse' };
const region = (lang: string) => REGION[lang.split(/[-_]/)[1]?.toUpperCase()] ?? lang;

// Pick which installed French voice reads sentences aloud. Tap a voice to hear it and use it.
export default function VoicePicker() {
  const db = useSQLiteContext();
  const [voices, setVoices] = useState<Voice[] | null>(null);
  const [chosen, setChosen] = useState(getVoiceChoice());

  useEffect(() => {
    getFrenchVoices().then(setVoices, () => setVoices([]));
  }, []);

  if (!voices) return null;
  const best = voices[0];

  async function choose(v: Voice | null) {
    tap();
    setChosen(v?.identifier ?? null);
    await setVoiceChoice(db, v?.identifier ?? null);
    const said = v ?? best;
    if (said) previewVoice(said.identifier, said.language);
  }

  const hasGood = voices.some((v) => voiceTier(v) === 'premium' || voiceTier(v) === 'enhanced');

  return (
    <Screen>
      <Row
        title="Automatique"
        detail={best ? `Meilleure voix installée : ${best.name} (${TIER_LABEL[voiceTier(best)]})` : 'Voix française du système'}
        selected={chosen === null}
        onPress={() => choose(null)}
      />

      <H2>Voix installées</H2>
      {voices.length === 0 && <Body muted>Aucune voix française trouvée sur cet appareil.</Body>}
      {voices.map((v) => {
        const tier = voiceTier(v);
        return (
          <Row
            key={v.identifier}
            title={v.name}
            detail={region(v.language)}
            badge={TIER_LABEL[tier]}
            badgeColor={TIER_COLOR[tier]}
            selected={chosen === v.identifier}
            onPress={() => choose(v)}
          />
        );
      })}

      <Card>
        <H2>{hasGood ? 'Ajouter d’autres voix' : 'Pour une voix plus naturelle'}</H2>
        <Body muted>
          Sur iPhone : Réglages › Accessibilité › Contenu énoncé › Voix › Français, puis téléchargez une voix « Premium » ou
          « Améliorée ». Revenez ensuite ici : elle apparaîtra dans la liste.
        </Body>
      </Card>
    </Screen>
  );
}

function Row({
  title,
  detail,
  badge,
  badgeColor = colors.muted,
  selected,
  onPress,
}: {
  title: string;
  detail: string;
  badge?: string;
  badgeColor?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }}>
      {({ pressed }) => (
        <Card style={{ ...styles.row, ...(selected ? styles.selected : null), opacity: pressed ? 0.7 : 1 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {badge && <Text style={[styles.badge, { color: badgeColor, backgroundColor: tint(badgeColor, 0.12) }]}>{badge}</Text>}
            </View>
            <Text style={styles.detail}>{detail}</Text>
          </View>
          <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={selected ? colors.blue : colors.muted} />
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  selected: { borderColor: colors.blue, borderWidth: 1.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 17, fontWeight: '600', color: colors.ink },
  detail: { fontSize: 14, color: colors.muted },
  badge: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
});
