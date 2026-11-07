import type { ComprehensionItem } from '../comprehension.ts';

// Moves each right answer to a spread of positions, so the answer is not usually the second choice.
// It rotates the choices (their order is otherwise kept) by a fixed amount from the item id and question,
// so a question always shows the same order and the mistake log's saved choice index stays valid.
export function balanced(items: ComprehensionItem[]): ComprehensionItem[] {
  return items.map((item) => ({
    ...item,
    questions: item.questions.map((q, qi) => {
      const n = q.choices.length;
      const target = (Number(item.id.replace(/\D/g, '')) + qi) % n;
      const shift = (target - q.answer + n) % n;
      const choices = q.choices.map((_, i) => q.choices[(i - shift + n) % n]);
      return { ...q, choices, answer: target };
    }),
  }));
}
