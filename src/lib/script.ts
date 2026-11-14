// Splits a listening script into who says what, so text-to-speech reads the lines without the
// speaker labels ("Client : …") and can give each speaker their own voice. Pure, so it can be tested.

export type Turn = { speaker: string | null; line: string };

// A label is one capitalised word followed by " : ", at the start of the script or of a sentence.
const LABEL = /(^|(?<=[.!?…»]\s+))(\p{Lu}[\p{L}’'-]*) : /gu;

export function splitTurns(text: string): Turn[] {
  const labels = [...text.matchAll(LABEL)];
  // Not a dialogue (a message, an announcement…): read it as it is.
  if (labels.length === 0) return [{ speaker: null, line: text.trim() }];
  const turns: Turn[] = [];
  const first = labels[0].index ?? 0;
  if (first > 0) turns.push({ speaker: null, line: text.slice(0, first).trim() });
  labels.forEach((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < labels.length ? labels[i + 1].index : text.length;
    const line = text.slice(start, end).trim();
    if (line) turns.push({ speaker: m[2], line });
  });
  return turns;
}

// The speakers in order of first appearance: the first gets the main voice, the second another one.
export function speakers(turns: Turn[]): string[] {
  return [...new Set(turns.map((t) => t.speaker).filter((s): s is string => s !== null))];
}
