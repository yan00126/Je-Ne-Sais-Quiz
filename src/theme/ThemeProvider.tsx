import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black/400Regular';
import { Baloo2_600SemiBold } from '@expo-google-fonts/baloo-2/600SemiBold';
import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2/700Bold';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2/800ExtraBold';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Figtree_700Bold } from '@expo-google-fonts/figtree/700Bold';
import { Figtree_800ExtraBold } from '@expo-google-fonts/figtree/800ExtraBold';
import { Nunito_500Medium } from '@expo-google-fonts/nunito/500Medium';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Outfit_500Medium } from '@expo-google-fonts/outfit/500Medium';
import { Outfit_600SemiBold } from '@expo-google-fonts/outfit/600SemiBold';
import { Outfit_700Bold } from '@expo-google-fonts/outfit/700Bold';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { useFonts } from 'expo-font';
import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { DEFAULT_THEME, fontFor, isThemeId, THEMES, type FontRole, type Theme, type ThemeId } from './themes';

const FONTS = {
  ArchivoBlack_400Regular,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
};

type Ctx = { theme: Theme; setTheme: (id: ThemeId) => void };
const ThemeContext = createContext<Ctx>({ theme: THEMES[DEFAULT_THEME], setTheme: () => {} });

// Reads the saved look before the first frame, so the app never flashes the default one.
function savedTheme(db: ReturnType<typeof useSQLiteContext>): ThemeId {
  try {
    const row = db.getFirstSync<{ value: string }>("SELECT value FROM settings WHERE key = 'theme'");
    return isThemeId(row?.value) ? row.value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [id, setId] = useState<ThemeId>(() => savedTheme(db));
  const [fontsLoaded, fontError] = useFonts(FONTS);

  function setTheme(next: ThemeId) {
    setId(next);
    db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('theme', ?)", next).catch(() => {});
  }

  // Wait for the fonts; if they fail to load, carry on with the system font rather than a blank app.
  if (!fontsLoaded && !fontError) return null;
  return <ThemeContext.Provider value={{ theme: THEMES[id], setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext).theme;
export const useSetTheme = () => useContext(ThemeContext).setTheme;

// The font for inline styles: { fontFamily } for a role and weight in the current theme.
export function font(theme: Theme, role: FontRole, weight: TextStyle['fontWeight'] = '400'): TextStyle {
  return {
    fontFamily: fontFor(theme, role, weight ?? '400'),
    ...(role === 'head' && theme.headUpper ? { textTransform: 'uppercase' as const } : null),
  };
}

type AnyStyle = ViewStyle | TextStyle | ImageStyle;
type Named<T> = { [K in keyof T]: AnyStyle };

// Custom fonts come as one file per weight, so a text style's fontWeight becomes the matching font file.
// fontFamily: 'head' picks the theme's title font; anything else with a font size gets its body font.
function resolveFonts(theme: Theme, style: AnyStyle): AnyStyle {
  const s = style as TextStyle;
  const isText = s.fontSize !== undefined || s.fontWeight !== undefined || s.fontFamily !== undefined;
  if (!isText) return style;
  const role: FontRole = s.fontFamily === 'head' ? 'head' : 'body';
  const { fontWeight, ...rest } = s;
  return { ...rest, ...font(theme, role, fontWeight), ...(s.textTransform ? { textTransform: s.textTransform } : null) };
}

// Like StyleSheet.create, but built from the current theme, once per theme.
export function makeStyles<T extends Named<T>>(factory: (t: Theme) => T) {
  const cache = new Map<ThemeId, T>();
  return function useStyles(): T {
    const theme = useTheme();
    let styles = cache.get(theme.id);
    if (!styles) {
      const raw = factory(theme);
      const resolved = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, resolveFonts(theme, v as AnyStyle)]));
      styles = StyleSheet.create(resolved) as T;
      cache.set(theme.id, styles);
    }
    return styles;
  };
}
