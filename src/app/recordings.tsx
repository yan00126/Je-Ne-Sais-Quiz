import Ionicons from '@expo/vector-icons/Ionicons';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, colors, H2, Screen, tap, tint } from '../components/ui';
import { deleteRecording, getRecordings, KEEP_DAYS, recordingUri, setStarred, type RecordingKind, type SavedRecording } from '../lib/recordings';
import { speakFr } from '../lib/useRecording';

const KIND_LABEL: Record<RecordingKind, string> = { shadowing: 'Répétition', dialogue: 'Dialogue', exam: 'Tâche' };

function dayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Aujourd’hui';
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
}

const clock = (ts: number) => new Date(ts).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
const duration = (s: number) => (s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`);

// Every answer you recorded, to hear yourself improve: tap a sentence to see all your takes of it.
export default function Recordings() {
  const db = useSQLiteContext();
  const player = useAudioPlayer(null);
  const [all, setAll] = useState<SavedRecording[] | null>(null);
  const [starredOnly, setStarredOnly] = useState(false);
  // Only the takes of this sentence or prompt, oldest first, to compare progress.
  const [sameText, setSameText] = useState<string | null>(null);

  const load = useCallback(() => getRecordings(db).then(setAll), [db]);
  useEffect(() => {
    load();
  }, [load]);

  if (!all) return null;

  let shown = all.filter((r) => (!starredOnly || r.starred) && (!sameText || r.text === sameText));
  if (sameText) shown = [...shown].reverse();

  async function play(r: SavedRecording) {
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    player.replace({ uri: recordingUri(r.file) });
    player.play();
  }

  async function toggleStar(r: SavedRecording) {
    tap();
    await setStarred(db, r.id, !r.starred);
    setAll((list) => list!.map((x) => (x.id === r.id ? { ...x, starred: r.starred ? 0 : 1 } : x)));
  }

  function remove(r: SavedRecording) {
    Alert.alert('Supprimer cet enregistrement ?', undefined, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteRecording(db, r);
          setAll((list) => list!.filter((x) => x.id !== r.id));
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Button title="Tous" variant={starredOnly ? 'outline' : 'solid'} onPress={() => setStarredOnly(false)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="★ Favoris" variant={starredOnly ? 'solid' : 'outline'} color={colors.amber} onPress={() => setStarredOnly(true)} />
        </View>
      </View>

      {sameText && (
        <Card style={styles.filter}>
          <Body muted>Toutes vos prises de :</Body>
          <Text style={styles.filterText}>{sameText}</Text>
          <Button title="Voir tout" variant="outline" onPress={() => setSameText(null)} />
        </Card>
      )}

      {shown.length === 0 && (
        <Body muted>
          {starredOnly
            ? 'Aucun favori. Touchez ☆ sur un enregistrement pour le garder pour toujours.'
            : 'Pas encore d’enregistrement. Vos réponses en répétition, en dialogue guidé et en expression orale apparaîtront ici.'}
        </Body>
      )}

      {shown.map((r, i) => {
        const newDay = i === 0 || dayLabel(shown[i - 1].created_at) !== dayLabel(r.created_at);
        return (
          <View key={r.id} style={{ gap: 8 }}>
            {newDay && <H2>{dayLabel(r.created_at)}</H2>}
            <Card>
              <View style={styles.meta}>
                <Text style={styles.badge}>{KIND_LABEL[r.kind]}</Text>
                <Text style={styles.time}>
                  {clock(r.created_at)} · {duration(r.seconds)}
                </Text>
                <Pressable onPress={() => toggleStar(r)} hitSlop={10} accessibilityRole="button" accessibilityLabel={r.starred ? 'Retirer des favoris' : 'Garder en favori'}>
                  <Ionicons name={r.starred ? 'star' : 'star-outline'} size={22} color={colors.amber} />
                </Pressable>
              </View>
              <Text style={styles.title}>{r.title}</Text>
              <Pressable onPress={() => setSameText(r.text)} accessibilityRole="button" accessibilityHint="Voir toutes vos prises de cette phrase">
                <Text style={styles.text} numberOfLines={sameText ? undefined : 3}>
                  {r.text}
                </Text>
              </Pressable>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Button title="▶︎ Ma voix" variant="outline" onPress={() => play(r)} />
                </View>
                {r.kind !== 'exam' && (
                  <View style={{ flex: 1 }}>
                    <Button title="🔊 Modèle" variant="outline" color={colors.green} onPress={() => speakFr(r.text)} />
                  </View>
                )}
                <Pressable onPress={() => remove(r)} style={styles.trash} hitSlop={6} accessibilityRole="button" accessibilityLabel="Supprimer">
                  <Ionicons name="trash-outline" size={20} color={colors.muted} />
                </Pressable>
              </View>
            </Card>
          </View>
        );
      })}

      <Body muted>Les enregistrements sans ★ sont supprimés après {KEEP_DAYS} jours.</Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
    backgroundColor: tint(colors.blue, 0.1),
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  time: { flex: 1, fontSize: 13, color: colors.muted },
  title: { fontSize: 15, fontWeight: '600', color: colors.ink },
  text: { fontSize: 16, lineHeight: 23, color: colors.muted },
  filter: { borderColor: tint(colors.blue, 0.4), borderWidth: 1.5 },
  filterText: { fontSize: 17, lineHeight: 24, fontWeight: '600', color: colors.ink },
  trash: { width: 44, height: 50, alignItems: 'center', justifyContent: 'center' },
});
