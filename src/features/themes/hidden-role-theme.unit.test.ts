import { expect, test } from 'vitest';
import { generateFamilyCase } from '../problem-generation/problem-families';
import { presentTheme } from '../puzzle/compose-puzzle';
import { themeIds, type ThemeId } from '../themes';
import type { HiddenRole } from '../problem-generation/hidden-role';
import type { PuzzleLocale } from '../puzzle/lang';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];

type Structure = 'base-and-parts' | 'groups-only';

const hiddenRoleQuestions: Record<
  ThemeId,
  Record<PuzzleLocale, Record<HiddenRole, RegExp | Record<Structure, RegExp>>>
> = {
  'gaming.drone-power': {
    en: {
      'per-item': /How much power does one drone draw\?/,
      base: /How much power/,
      count: /How many drones/,
      total: {
        'base-and-parts': /How much power do the ship and its drones draw in total\?/,
        'groups-only': /How much power do the drones draw in total\?/,
      },
    },
    nb: {
      'per-item': /Hvor mye effekt trekker én drone\?/,
      base: /Hvor mye effekt/,
      count: /Hvor mange droner/,
      total: {
        'base-and-parts': /Hvor mye effekt trekker skipet og dronene til sammen\?/,
        'groups-only': /Hvor mye effekt trekker dronene til sammen\?/,
      },
    },
  },
  'creator.followers': {
    en: {
      'per-item': /How many followers does each post gain\?/,
      base: /How many followers/,
      count: /How many promoted posts/,
      total: {
        'base-and-parts': /How many followers does the creator finish with\?/,
        'groups-only': /How many followers do the promoted posts bring in, in total\?/,
      },
    },
    nb: {
      'per-item': /Hvor mange følgere gir hvert innlegg\?/,
      base: /Hvor mange følgere/,
      count: /Hvor mange promoterte innlegg/,
      total: {
        'base-and-parts': /Hvor mange følgere har innholdsskaperen til slutt\?/,
        'groups-only': /Hvor mange følgere gir de promoterte innleggene til sammen\?/,
      },
    },
  },
};

const numberWords = {
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  nb: ['null', 'én', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti'],
} as const;

function numberWord(value: string, locale: PuzzleLocale): string {
  const word = numberWords[locale][Number(value)] ?? value;
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

function structureOfFamily(familyId: string): Structure {
  return familyId === 'total-from-parts' ? 'base-and-parts' : 'groups-only';
}

test('every theme renders a structure-correct question for the hidden role of each family variant', () => {
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
          const pattern =
            expected instanceof RegExp
              ? expected
              : expected[structureOfFamily(familyId)];
          expect(
            presentation.story.text,
            `${familyId}/${hiddenRole}/${themeId}/${locale}`,
          ).toMatch(pattern);
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

test('the total question distinguishes base-and-parts from groups-only in both locales', () => {
  for (const themeId of themeIds) {
    for (const locale of locales) {
      const baseAndParts = generateFamilyCase('total-from-parts', {
        seed: 91,
        hiddenRole: 'total',
      });
      const groupsOnly = generateFamilyCase('groups-total', {
        seed: 91,
        hiddenRole: 'total',
      });
      const baseAndPartsStory = presentTheme(
        themeId,
        baseAndParts.problem,
        locale,
        0,
      ).story.text;
      const groupsOnlyStory = presentTheme(
        themeId,
        groupsOnly.problem,
        locale,
        0,
      ).story.text;
      const totalQuestion =
        hiddenRoleQuestions[themeId][locale].total;
      expect(totalQuestion).toBeInstanceOf(Object);
      expect(
        baseAndPartsStory,
        `${themeId}/${locale} base-and-parts`,
      ).toMatch(
        (totalQuestion as Record<Structure, RegExp>)['base-and-parts'],
      );
      expect(
        groupsOnlyStory,
        `${themeId}/${locale} groups-only`,
      ).toMatch(
        (totalQuestion as Record<Structure, RegExp>)['groups-only'],
      );
    }
  }
});

test('every theme renders all mathematically necessary known facts into the story', () => {
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
          const knownFacts = presentation.facts.filter(
            (fact) => fact.visibility === 'known',
          );
          expect(
            knownFacts.length,
            `${familyId}/${hiddenRole}/${themeId}/${locale}`,
          ).toBe(generated.problem.quantities.length - 1);
          for (const fact of knownFacts) {
            expect(
              fact.value,
              `${familyId}/${hiddenRole}/${themeId}/${locale}`,
            ).toBeDefined();
            const value = String(fact.value);
            const stated =
              presentation.story.text.includes(value) ||
              (fact.role === 'count' &&
                (presentation.story.text.includes(
                  numberWord(value, locale),
                ) ||
                  presentation.story.text.includes(
                    numberWord(value, locale).toLowerCase(),
                  )));
            expect(
              stated,
              `${familyId}/${hiddenRole}/${themeId}/${locale} story must state the known ${fact.role} value ${value}`,
            ).toBe(true);
          }
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
