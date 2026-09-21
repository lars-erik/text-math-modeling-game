import { expect, test } from 'vitest';
import { serializeProblem } from '../problem-dsl';
import {
  familySupportsMode,
  generateFamilyCase,
  problemFamilies,
  problemFamilyIds,
} from '../problem-generation/problem-families';
import { validateProblemAst } from '../problem-model/problem-validation';
import { substituteVisibleValues } from '../representations/substitute-visible-values';
import { createAcademicSymbolMap } from '../representations/academic-symbol-map';
import { themes } from '../themes';
import { themeIds } from '../themes';
import { modeIds, modes } from './modes';
import { composePuzzle, submitPuzzle } from './compose-puzzle';
import { createNamedEquationChoiceSeeds } from './modes/named-equation-choices';
import type { PuzzleLocale } from './lang';
import {
  relationsHaveNormalizedStructure,
  namedEquationStructurePolicy,
} from '../problem-model/normalized-structure';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];

test('every declared family x theme x mode x locale combination composes', () => {
  let composedCount = 0;
  for (const familyId of problemFamilyIds) {
    const family = problemFamilies[familyId];
    for (const modeId of modeIds) {
      const supported = familySupportsMode(familyId, modeId);
      expect(supported, `${familyId} x ${modeId} must be declared explicitly`).toBe(
        family.supportedModeIds.includes(modeId),
      );
      if (!supported) {
        continue;
      }
      const generated = generateFamilyCase(familyId, { seed: 321 });
      const problemBefore = structuredClone(generated.problem);
      const dslBefore = serializeProblem(generated.problem);
      for (const themeId of themeIds) {
        for (const locale of locales) {
          const screen = composePuzzle({
            problem: generated.problem,
            themeId,
            modeId,
            locale,
          });
          composedCount += 1;
          expect(screen.screen.modeId).toBe(modeId);
          expect(screen.context.themeId).toBe(themeId);
          expect(screen.context.locale).toBe(locale);
          expect(screen.context.story.length).toBeGreaterThan(0);
          expect(
            screen.context.quantities.filter(
              (quantity) => quantity.given.kind === 'hidden',
            ),
          ).toHaveLength(1);
        }
      }
      expect(generated.problem).toEqual(problemBefore);
      expect(serializeProblem(generated.problem)).toBe(dslBefore);
    }
  }
  expect(composedCount).toBe(2 * 2 * 4 * 2);
});

test('the family cross-product stays hidden-answer-private', () => {
  for (const familyId of problemFamilyIds) {
    const generated = generateFamilyCase(familyId, { seed: 321 });
    for (const themeId of themeIds) {
      for (const locale of locales) {
        const screen = composePuzzle({
          problem: generated.problem,
          themeId,
          modeId: 'quantities-to-named-equation',
          locale,
        });
        expect(JSON.stringify(screen)).not.toContain(
          `\"value\":${generated.answerKey.bindings.unitValue}`,
        );
        const hidden = screen.context.quantities.find(
          (quantity) => quantity.given.kind === 'hidden',
        );
        expect(hidden?.displayValue).toBe('?');
        expect(hidden?.id).toBe('unitValue');
      }
    }
  }
});

test('groups-total reuses the existing modes with role-based adapters', () => {
  const generated = generateFamilyCase('groups-total', { seed: 17 });
  const problem = generated.problem;
  expect(validateProblemAst(problem)).toEqual([]);

  const symbols = createAcademicSymbolMap(problem);
  expect(symbols).toEqual({ count: 'n', unitValue: 'p', total: 'T' });

  const substituted = substituteVisibleValues(problem);
  expect(substituted).toEqual({
    kind: 'equation',
    left: { kind: 'literal', value: generated.answerKey.bindings.total },
    right: {
      kind: 'multiply',
      left: { kind: 'literal', value: generated.answerKey.bindings.count },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  });

  for (const locale of locales) {
    for (const themeId of themeIds) {
      const screenQuantities = composePuzzle({
        problem,
        themeId,
        modeId: 'quantities-to-named-equation',
        locale,
      }).context.quantities;
      const names = Object.fromEntries(
        screenQuantities.map((quantity) => [
          quantity.role,
          quantity.variableName,
        ]),
      );
      const accepted = submitPuzzle({
        problem,
        themeId,
        modeId: 'quantities-to-named-equation',
        locale,
        answer: {
          kind: 'text',
          input: `${names.total} = ${names.count} * ${names['per-item']}`,
        },
      });
      expect(accepted.feedback?.kind, `${themeId}/${locale}`).toBe('accepted');

      const reversed = submitPuzzle({
        problem,
        themeId,
        modeId: 'quantities-to-named-equation',
        locale,
        answer: {
          kind: 'text',
          input: `${names.count} * ${names['per-item']} = ${names.total}`,
        },
      });
      expect(reversed.feedback?.kind, `${themeId}/${locale}`).toBe('accepted');

      const commuted = submitPuzzle({
        problem,
        themeId,
        modeId: 'quantities-to-named-equation',
        locale,
        answer: {
          kind: 'text',
          input: `${names.total} = ${names['per-item']} * ${names.count}`,
        },
      });
      expect(commuted.feedback?.kind, `${themeId}/${locale}`).toBe('accepted');

      const incorrect = submitPuzzle({
        problem,
        themeId,
        modeId: 'quantities-to-named-equation',
        locale,
        answer: {
          kind: 'text',
          input: `${names.total} = ${names.count} + ${names['per-item']}`,
        },
      });
      expect(incorrect.feedback?.kind, `${themeId}/${locale}`).not.toBe(
        'accepted',
      );
    }
  }
});

test('groups-total multiple-choice distractors are genuinely incorrect', () => {
  const generated = generateFamilyCase('groups-total', { seed: 17 });
  const seeds = createNamedEquationChoiceSeeds(generated.problem);
  expect(seeds.length).toBeGreaterThan(1);
  const matching = seeds.find((seed) => seed.id === 'matching');
  expect(matching?.relation).toEqual(generated.problem.relation);
  for (const seed of seeds) {
    const others = seeds.filter((candidate) => candidate.id !== seed.id);
    for (const other of others) {
      expect(
        relationsHaveNormalizedStructure(
          seed.relation,
          other.relation,
          namedEquationStructurePolicy,
        ),
        `${seed.id} must not be equivalent to ${other.id}`,
      ).toBe(false);
    }
  }
});

test('mode state is family-agnostic and theme-free', () => {
  for (const familyId of problemFamilyIds) {
    const generated = generateFamilyCase(familyId, { seed: 321 });
    for (const locale of locales) {
      for (const modeId of modeIds) {
        const { state } = modes[modeId].start({
          problem: generated.problem,
          locale,
        });
        expect(JSON.stringify(state)).not.toContain('theme');
      }
    }
  }
});

test('themes never rewrite the canonical groups-total problem', () => {
  const generated = generateFamilyCase('groups-total', { seed: 321 });
  const before = structuredClone(generated.problem);
  for (const themeId of Object.keys(themes) as (keyof typeof themes)[]) {
    for (const locale of locales) {
      themes[themeId].present({
        problem: generated.problem,
        locale,
        storySeed: 321,
      });
    }
  }
  expect(generated.problem).toEqual(before);
});
