import { expect, test } from 'vitest';
import { groupsTotalProblem } from '../problem-model/groups-total';
import { generateGroupsTotalCase } from '../problem-generation/generate-groups-total';
import { presentTheme } from '../puzzle/compose-puzzle';
import { themeIds, type ThemeId, type ThemePresentation } from '../themes';
import type { PuzzleLocale } from '../puzzle/lang';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];

function present(
  themeId: ThemeId,
  problem = groupsTotalProblem,
  locale: PuzzleLocale = 'en',
): ThemePresentation {
  return presentTheme(themeId, problem, locale, 0);
}

test('every theme projects a groups-total problem in both locales', () => {
  for (const themeId of themeIds) {
    for (const locale of locales) {
      const presentation = present(themeId, groupsTotalProblem, locale);
      expect(presentation.themeId).toBe(themeId);
      expect(presentation.locale).toBe(locale);
      expect(presentation.story.text.length).toBeGreaterThan(0);
      expect(presentation.facts.map((fact) => fact.canonicalId)).toEqual([
        'count',
        'unitValue',
        'total',
      ]);
      const hidden = presentation.facts.filter(
        (fact) => fact.visibility === 'hidden',
      );
      expect(hidden).toHaveLength(1);
      expect(hidden[0]?.canonicalId).toBe('unitValue');
    }
  }
});

test('groups-total stories never mention a base quantity', () => {
  for (const themeId of themeIds) {
    for (const locale of locales) {
      const presentation = present(themeId, groupsTotalProblem, locale);
      const baseFacts = presentation.facts.filter((fact) => fact.role === 'base');
      expect(baseFacts).toHaveLength(0);
    }
  }
});

test('groups-total presentations adapt to generated values', () => {
  const generated = generateGroupsTotalCase({
    seed: 17,
    config: {
      count: { min: 2, max: 12 },
      unitValue: { min: 3, max: 25 },
      concepts: [
        'arithmetic.multiplication',
        'algebra.variable',
        'algebra.equation',
        'linear.one-unknown',
      ],
    },
  });
  for (const themeId of themeIds) {
    const presentation = presentTheme(themeId, generated.problem, 'en', 0);
    const knownFacts = presentation.facts.filter(
      (fact) => fact.visibility === 'known',
    );
    const countFact = knownFacts.find((fact) => fact.role === 'count');
    const totalFact = knownFacts.find((fact) => fact.role === 'total');
    expect(countFact?.value).toBe(generated.answerKey.bindings.count);
    expect(totalFact?.value).toBe(generated.answerKey.bindings.total);
    expect(presentation.story.text).toContain(String(totalFact?.value));
  }
});
