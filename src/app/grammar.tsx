import { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { RuleRow, RuleSheet, useGrammarList } from '../components/GrammarViews';
import { Body, Screen } from '../components/ui';
import { GRAMMAR, searchRules, TOPICS, type GrammarRule } from '../data/grammar';
import { makeStyles } from '../theme/ThemeProvider';

// Every grammar rule card, by topic, with a search. A card opens in a bottom sheet.
export default function Grammar() {
  const s = useStyles();
  const list = useGrammarList();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<GrammarRule | null>(null);
  const found = useMemo(() => searchRules(query), [query]);
  const searching = query.trim().length > 1;

  return (
    <Screen>
      <TextInput
        style={s.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Chercher : subjonctif, dont, depuis…"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      {searching ? (
        found.length ? (
          <View style={list.list}>
            {found.map((r, i) => (
              <RuleRow key={r.id} rule={r} first={i === 0} onPress={() => setOpen(r)} />
            ))}
          </View>
        ) : (
          <Body muted>Aucune règle ne correspond. Essayez un autre mot.</Body>
        )
      ) : (
        TOPICS.map((topic) => {
          const rules = GRAMMAR.filter((r) => r.topic === topic);
          if (!rules.length) return null;
          return (
            <View key={topic} style={{ gap: 8 }}>
              <Text style={s.topic}>{topic}</Text>
              <View style={list.list}>
                {rules.map((r, i) => (
                  <RuleRow key={r.id} rule={r} first={i === 0} detail={r.level} onPress={() => setOpen(r)} />
                ))}
              </View>
            </View>
          );
        })
      )}
      <RuleSheet rule={open} onClose={() => setOpen(null)} />
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  input: { borderWidth: t.button === 'brutal' ? 2.5 : 1.5, borderColor: t.colors.border, backgroundColor: t.colors.card, borderRadius: t.radius.field, padding: 12, fontSize: 16, color: t.colors.ink },
  topic: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', color: t.colors.muted, marginTop: 6 },
}));
