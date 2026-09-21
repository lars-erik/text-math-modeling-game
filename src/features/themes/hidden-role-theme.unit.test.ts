import { expect, test } from 'vitest';
import { generateFamilyCase } from '../problem-generation/problem-families';
import { presentTheme } from '../puzzle/compose-puzzle';
import { themeIds, type ThemeId } from '../themes';
import type { HiddenRole } from '../problem-generation/hidden-role';
import type { PuzzleLocale } from '../puzzle/lang';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];

const hiddenRoleQuestions: Record<
  ThemeId,
  Record<PuzzleLocale, Record<HiddenRole, RegExp>>
> = {
  'gaming.drone-power': {
    en: {
      'per-item': /How much power does one drone draw\?/,
      base: /How much power/,
      count: /How many drones/,
      total: /How much power.*in total\?/,
    },
    nb: {
      'per-item': /Hvor mye effekt trekker én drone\?/,
      base: /Hvor mye effekt/,
      count: /Hvor mange droner/,
      total: /Hvor mye effekt.*til sammen\?/,
    },
  },
  'creator.followers': {
    en: {
      'per-item': /How many followers does each post gain\?/,
      base: /How many followers/,
      count: /How many promoted posts/,
      total: /How many followers.*finish/,
    },
    nb: {
      'per-item': /Hvor mange følgere gir hvert innlegg\?/,
      base: /Hvor mange følgere/,
      count: /Hvor mange promoterte innlegg/,
      total: /Hvor mange følgere.*til slutt/,
    },
  },
};

test('every theme renders a question for the hidden role of each family variant', () => {
  for (const familyId of ['total-from-parts', 'groups-total'] as const) {
    for (const hiddenRole of ['per-item', 'base', 'count', 'total'] as const) {
      let generated;
      try {
        generated = generateFamilyCase(familyId, { seed: 91, hiddenRole });
      } catch {
        continue;
      }
      for (const themeId of themeIds) {
        for (const locale of locales) {
          const presentation = presentTheme(
            themeId,
            generated.problem,
            locale,
            0,
          );
          const expected =
            hiddenRoleQuestions[themeId][locale][hiddenRole];
          expect(
            presentation.story.text,
            `${familyId}/${hiddenRole}/${themeId}/${locale}`,
          ).toMatch(expected);
          const hiddenFacts = presentation.facts.filter(
            (fact) => fact.visibility === 'hidden',
          );
          expect(hiddenFacts).toHaveLength(1);
          expect(hiddenFacts[0]?.role).toBe(hiddenRole);
        }
      }
    }
  }
});

test('theme projection stays invariant across hidden-role variants', () => {
  for (const familyId of ['total-from-parts', 'groups-total'] as const) {
    const reference = generateFamilyCase(familyId, { seed: 91 });
    for (const hiddenRole of ['per-item', 'base', 'count', 'total'] as const) {
      let variant;
      try {
        variant = generateFamilyCase(familyId, { seed: 91, hiddenRole });
      } catch {
        continue;
      }
      for (const themeId of themeIds) {
        const referencePresentation = presentTheme(
          themeId,
          reference.problem,
          'en',
          0,
        );
        const variantPresentation = presentTheme(
          themeId,
          variant.problem,
          'en',
          0,
        );
        const normalize = (facts: typeof referencePresentation.facts) =>
          facts.map((fact) => ({
            ...fact,
            visibility: 'known' as const,
            value: reference.answerKey.bindings[fact.canonicalId],
          }));
        expect(normalize(variantPresentation.facts)).toEqual(
          normalize(referencePresentation.facts),
        );
        expect(variantPresentation.learnerNames).toEqual(
          referencePresentation.learnerNames,
        );
      }
    }
  }
});
