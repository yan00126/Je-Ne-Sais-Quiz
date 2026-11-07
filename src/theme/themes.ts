// The three looks from the « Je Ne Sais Quiz — design » canvas. Only the look changes between them:
// the plan, the cards and your progress stay the same.
import type { Skill } from '../lib/db';

export type ThemeId = 'bonbon' | 'cahier' | 'metro';
export type Weight = '400' | '500' | '600' | '700' | '800';
export type FontRole = 'head' | 'body';

export type SkillLook = {
  color: string; // the skill's own colour: metro line, progress fill, icon
  bg: string; // its tile background
  ink: string; // text on that background
};

export type Theme = {
  id: ThemeId;
  name: string;
  tagline: string;
  colors: {
    bg: string; // screen background
    card: string;
    ink: string;
    muted: string;
    border: string;
    primary: string; // default solid button
    accent: string; // progress fills, selected rows, icons
    accentText: string; // accent used as text on a light background
    soft: string; // tinted background behind accent elements
    track: string; // empty part of a progress bar
    onColor: string; // text on a solid coloured button
    cta: string; // the big « go » button on the Today screen
    onCta: string;
    green: string;
    amber: string;
    red: string;
    // The same three as text on a light background (some themes use pastel fills that would be unreadable).
    greenText: string;
    amberText: string;
    redText: string;
  };
  skills: Record<Skill, SkillLook>;
  fonts: Record<FontRole, Partial<Record<Weight, string>>>;
  headUpper: boolean; // Cahier sets its titles in capitals
  radius: { card: number; button: number; field: number };
  // Extra look of cards and buttons: borders and shadows.
  card: { borderWidth: number; borderColor: string; boxShadow?: string };
  button: 'raised' | 'brutal'; // raised: darker bottom edge; brutal: thick outline and a hard offset shadow
};

export const DEFAULT_THEME: ThemeId = 'bonbon';

const bonbon: Theme = {
  id: 'bonbon',
  name: 'Bonbon',
  tagline: 'Couleurs bonbon et la mascotte Mimi',
  colors: {
    bg: '#FBF8FF',
    card: '#FFFFFF',
    ink: '#2A2350',
    muted: '#6B6394',
    border: '#E6DEFA',
    primary: '#6A45E0',
    accent: '#6A45E0',
    accentText: '#5B36D6',
    soft: '#EDE6FF',
    track: '#EDE6FF',
    onColor: '#FFFFFF',
    cta: '#2A2350',
    onCta: '#FFFFFF',
    green: '#14805A',
    amber: '#A86400',
    red: '#D02E66',
    greenText: '#0F7A55',
    amberText: '#946200',
    redText: '#B0246A',
  },
  skills: {
    vocab: { color: '#0F7A55', bg: '#D4F7EA', ink: '#0B4D36' },
    listening: { color: '#B0246A', bg: '#FFE0F0', ink: '#6E1342' },
    reading: { color: '#946200', bg: '#FFF0C7', ink: '#5C3D00' },
    writing: { color: '#2457B8', bg: '#DDEBFF', ink: '#133673' },
    speaking: { color: '#A8461A', bg: '#FFE6D6', ink: '#5E2508' },
  },
  fonts: {
    head: { '600': 'Baloo2_600SemiBold', '700': 'Baloo2_700Bold', '800': 'Baloo2_800ExtraBold' },
    body: { '500': 'Nunito_500Medium', '700': 'Nunito_700Bold', '800': 'Nunito_800ExtraBold' },
  },
  headUpper: false,
  radius: { card: 24, button: 999, field: 16 },
  card: { borderWidth: 0, borderColor: 'transparent', boxShadow: '0px 8px 24px rgba(106, 69, 224, 0.12)' },
  button: 'raised',
};

const cahier: Theme = {
  id: 'cahier',
  name: 'Cahier',
  tagline: 'Contours noirs, esprit carnet de notes',
  colors: {
    bg: '#FFFBEF',
    card: '#FFFFFF',
    ink: '#111111',
    muted: '#3A3A3A',
    border: '#111111',
    primary: '#4D7CFE',
    accent: '#4D7CFE',
    accentText: '#2F5BD8',
    soft: '#FFD43B',
    track: '#FFFFFF',
    onColor: '#111111',
    cta: '#4D7CFE',
    onCta: '#111111',
    green: '#2EC4B6',
    amber: '#FFD43B',
    red: '#FF6B6B',
    greenText: '#0B7A70',
    amberText: '#8A5A00',
    redText: '#C92A2A',
  },
  skills: {
    vocab: { color: '#2EC4B6', bg: '#2EC4B6', ink: '#111111' },
    listening: { color: '#4D7CFE', bg: '#4D7CFE', ink: '#111111' },
    reading: { color: '#FF6B9A', bg: '#FF6B9A', ink: '#111111' },
    writing: { color: '#FFD43B', bg: '#FFD43B', ink: '#111111' },
    speaking: { color: '#B197FC', bg: '#B197FC', ink: '#111111' },
  },
  fonts: {
    head: { '400': 'ArchivoBlack_400Regular' },
    body: { '500': 'SpaceGrotesk_500Medium', '600': 'SpaceGrotesk_600SemiBold', '700': 'SpaceGrotesk_700Bold' },
  },
  headUpper: true,
  radius: { card: 14, button: 12, field: 10 },
  card: { borderWidth: 2.5, borderColor: '#111111', boxShadow: '4px 4px 0px #111111' },
  button: 'brutal',
};

const metro: Theme = {
  id: 'metro',
  name: 'Métro',
  tagline: 'Ta journée comme une ligne de métro',
  colors: {
    bg: '#FFFFFF',
    card: '#FFFFFF',
    ink: '#10285A',
    muted: '#52607A',
    border: '#E3E8EF',
    primary: '#10285A',
    accent: '#2457D6',
    accentText: '#2457D6',
    soft: '#EEF3FF',
    track: '#E3E8EF',
    onColor: '#FFFFFF',
    cta: '#FFC72C',
    onCta: '#10285A',
    green: '#13804F',
    amber: '#B45309',
    red: '#C53030',
    greenText: '#0E6B41',
    amberText: '#9A4A07',
    redText: '#B02A2A',
  },
  skills: {
    vocab: { color: '#13804F', bg: '#E3F4EA', ink: '#0E6B41' },
    listening: { color: '#2457D6', bg: '#EEF3FF', ink: '#10285A' },
    reading: { color: '#C24A0C', bg: '#FBE7DD', ink: '#9A3A09' },
    writing: { color: '#7B3FB0', bg: '#F1E8F8', ink: '#5B2A86' },
    speaking: { color: '#0E7C86', bg: '#DFF3F4', ink: '#0A5960' },
  },
  fonts: {
    head: { '500': 'Outfit_500Medium', '600': 'Outfit_600SemiBold', '700': 'Outfit_700Bold' },
    body: { '500': 'Figtree_500Medium', '600': 'Figtree_600SemiBold', '700': 'Figtree_700Bold', '800': 'Figtree_800ExtraBold' },
  },
  headUpper: false,
  radius: { card: 16, button: 12, field: 12 },
  card: { borderWidth: 2, borderColor: '#E3E8EF' },
  button: 'raised',
};

export const THEMES: Record<ThemeId, Theme> = { bonbon, cahier, metro };
export const THEME_ORDER: ThemeId[] = ['bonbon', 'cahier', 'metro'];

export const isThemeId = (v: unknown): v is ThemeId => typeof v === 'string' && v in THEMES;

const WEIGHTS: Weight[] = ['400', '500', '600', '700', '800'];

// The font file for a role and weight: the theme's closest weight, rounding up on a tie (bold stays bold).
export function fontFor(theme: Theme, role: FontRole, weight: string | number = '400'): string {
  const have = theme.fonts[role];
  const want = WEIGHTS.indexOf(String(weight === 'normal' ? 400 : weight === 'bold' ? 700 : weight) as Weight);
  let best: string | undefined;
  let bestDist = Infinity;
  WEIGHTS.forEach((w, i) => {
    const family = have[w];
    if (!family) return;
    const dist = Math.abs(i - (want < 0 ? 0 : want)) - (i > want ? 0.1 : 0);
    if (dist < bestDist) {
      bestDist = dist;
      best = family;
    }
  });
  return best!;
}
