import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { makeStyles, useTheme } from '../theme/ThemeProvider';
import { tap } from './ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, [IconName, IconName]> = {
  index: ['sunny-outline', 'sunny'],
  cards: ['albums-outline', 'albums'],
  practice: ['school-outline', 'school'],
  progress: ['stats-chart-outline', 'stats-chart'],
};

// The bottom tab bar, drawn per theme: a floating pill (Bonbon), a ruled strip with a sticker for the
// current tab (Cahier), or a station sign with every label shown (Métro).
export function ThemedTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const t = useTheme();
  const s = useStyles();
  const showAllLabels = t.id === 'metro';
  return (
    <View style={[s.bar, { paddingBottom: t.id === 'bonbon' ? Math.max(insets.bottom, 12) : insets.bottom + 6 }]}>
      <View style={s.inner}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const title = descriptors[route.key].options.title ?? route.name;
          const [outline, filled] = ICONS[route.name] ?? ['ellipse-outline', 'ellipse'];
          const color = focused ? (t.id === 'cahier' ? t.colors.ink : t.colors.accentText) : t.id === 'cahier' ? t.colors.ink : t.colors.muted;
          const onPress = () => {
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              tap();
              navigateToTab(route.key);
            }
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={title}
              accessibilityState={{ selected: focused }}
              style={s.item}
              hitSlop={4}
            >
              <View style={[s.pill, focused && s.pillActive]}>
                <Ionicons name={focused && t.id !== 'metro' ? filled : outline} size={22} color={color} />
                {focused && !showAllLabels && <Text style={[s.pillLabel, { color }]}>{title}</Text>}
              </View>
              {showAllLabels && <Text style={[s.label, { color }, focused && s.labelActive]}>{title}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  bar:
    t.id === 'bonbon'
      ? { backgroundColor: t.colors.bg, paddingHorizontal: 16, paddingTop: 6 }
      : t.id === 'cahier'
        ? { backgroundColor: t.colors.bg, borderTopWidth: 3, borderTopColor: t.colors.ink, paddingTop: 10 }
        : { backgroundColor: t.colors.card, borderTopWidth: 2, borderTopColor: t.colors.border, paddingTop: 8 },
  inner:
    t.id === 'bonbon'
      ? {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
          borderRadius: 999,
          backgroundColor: t.colors.card,
          boxShadow: '0px 8px 24px rgba(106, 69, 224, 0.15)',
          paddingHorizontal: 6,
        }
      : { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', minHeight: 50 },
  item: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 44 },
  pill:
    t.id === 'metro'
      ? { paddingHorizontal: 16, paddingVertical: 3, borderRadius: 10 }
      : { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: t.id === 'bonbon' ? 999 : 10 },
  pillActive:
    t.id === 'cahier'
      ? { backgroundColor: t.colors.soft, borderWidth: 2.5, borderColor: t.colors.ink, paddingVertical: 6 }
      : { backgroundColor: t.colors.soft },
  pillLabel: { fontSize: 13, fontWeight: t.id === 'cahier' ? '700' : '800', textTransform: t.id === 'cahier' ? 'uppercase' : 'none' },
  label: { fontSize: 11, fontWeight: '700' },
  labelActive: { fontWeight: '800' },
}));
