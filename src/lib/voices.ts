// Picks the best French voice installed on the device. Pure, so it can be tested without a phone.

export type VoiceInfo = { identifier: string; name: string; quality: string; language: string };

export type Tier = 'premium' | 'enhanced' | 'standard' | 'novelty';

// expo-speech reports iOS Premium voices as "Default", so the tier is read from the identifier too:
// com.apple.voice.premium.fr-CA.Amelie, com.apple.voice.enhanced.fr-FR.Thomas,
// com.apple.voice.compact.fr-FR.Thomas. Eloquence voices (Jacques, Grandma…) sound robotic.
export function voiceTier(v: VoiceInfo): Tier {
  const id = v.identifier.toLowerCase();
  if (id.includes('.premium.')) return 'premium';
  if (id.includes('.enhanced.') || v.quality === 'Enhanced') return 'enhanced';
  if (id.includes('eloquence') || id.includes('speech.synthesis.voice')) return 'novelty';
  return 'standard';
}

const TIER_RANK: Record<Tier, number> = { premium: 0, enhanced: 1, standard: 2, novelty: 3 };
// Same quality: France first (most TCF recordings), then Canada, then other French.
const LANG_RANK = (lang: string) => (/^fr[-_]FR/i.test(lang) ? 0 : /^fr[-_]CA/i.test(lang) ? 1 : 2);

export const isFrench = (v: VoiceInfo) => /^fr([-_]|$)/i.test(v.language);

// French voices, best first.
export function rankFrenchVoices<V extends VoiceInfo>(voices: V[]): V[] {
  return voices
    .filter(isFrench)
    .sort(
      (a, b) =>
        TIER_RANK[voiceTier(a)] - TIER_RANK[voiceTier(b)] ||
        LANG_RANK(a.language) - LANG_RANK(b.language) ||
        a.name.localeCompare(b.name),
    );
}

// The chosen voice if it is still installed, otherwise the best one.
export function pickVoice<V extends VoiceInfo>(voices: V[], chosen: string | null): V | undefined {
  const ranked = rankFrenchVoices(voices);
  return ranked.find((v) => v.identifier === chosen) ?? ranked[0];
}
