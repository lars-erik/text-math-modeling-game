import { expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { serializeProblem } from '../problem-dsl';
import {
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
import type { HiddenRole } from '../problem-generation/hidden-role';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];

function supportedHiddenRoles(familyId: (typeof problemFamilyIds)[number]) {
  return problemFamilies[familyId].hiddenRoles;
}

test('every family x hidden-role x theme x mode x locale combination composes', () => {
  let composedCount = 0;
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      for (const modeId of modeIds) {
        const generated = generateFamilyCase(familyId, {
          seed: 321,
          hiddenRole,
        });
        expect(validateProblemAst(generated.problem), `${familyId}/${hiddenRole}`).toEqual([]);
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
            expect(screen.screen.modeId, `${familyId}/${hiddenRole}`).toBe(modeId);
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
  }
  expect(composedCount).toBe(7 * 5 * 2 * 2);
});

test('every hidden-role variant stays hidden-answer-private', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 321,
        hiddenRole,
      });
      const hiddenId = generated.problem.quantities.find(
        (quantity) => quantity.given.kind === 'hidden',
      )?.id;
      expect(hiddenId).toBeDefined();
      const hiddenValue = generated.answerKey.bindings[hiddenId!];
      for (const themeId of themeIds) {
        for (const locale of locales) {
          for (const modeId of modeIds) {
            const screen = composePuzzle({
              problem: generated.problem,
              themeId,
              modeId,
              locale,
            });
            const hidden = screen.context.quantities.find(
              (quantity) => quantity.given.kind === 'hidden',
            );
            expect(hidden?.displayValue).toBe('?');
            expect(hidden?.id).toBe(hiddenId);
            const knownValues = generated.problem.quantities
              .filter(
                (quantity): quantity is typeof quantity & {
                  given: { kind: 'known'; value: number };
                } => quantity.given.kind === 'known',
              )
              .map((quantity) => quantity.given.value);
            for (const value of collectNumberValues(screen)) {
              expect(knownValues, `${familyId}/${hiddenRole}/${modeId}`).toContain(value);
            }
          }
        }
      }
    }
  }
});

test('substitution and symbols derive from visibility for every hidden role', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 55,
        hiddenRole,
      });
      const substituted = substituteVisibleValues(generated.problem);
      const referencedIds = new Set(
        collectReferenceIds(substituted),
      );
      expect(referencedIds).toEqual(new Set([expect.any(String)]));
      for (const id of referencedIds) {
        const quantity = generated.problem.quantities.find(
          (candidate) => candidate.id === id,
        );
        expect(quantity?.given.kind).toBe('hidden');
      }
      const symbols = createAcademicSymbolMap(generated.problem);
      expect(new Set(Object.values(symbols)).size).toBe(
        generated.problem.quantities.length,
      );
    }
  }
});

function collectNumberValues(node: unknown): number[] {
  const values: number[] = [];
  const visit = (current: unknown) => {
    if (current === null || typeof current !== 'object') {
      return;
    }
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }
    for (const [key, value] of Object.entries(current)) {
      if (key === 'value' && typeof value === 'number') {
        values.push(value);
      } else {
        visit(value);
      }
    }
  };
  visit(node);
  return values;
}

function collectReferenceIds(relation: unknown): string[] {
  const ids: string[] = [];
  const visit = (node: any) => {
    if (node === null || typeof node !== 'object') {
      return;
    }
    if (node.kind === 'quantity') {
      ids.push(node.id);
      return;
    }
    for (const value of Object.values(node)) {
      if (typeof value === 'object') {
        visit(value);
      }
    }
  };
  visit(relation);
  return ids;
}

test('named-equation answers are accepted for every hidden-role variant', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 77,
        hiddenRole,
      });
      const problem = generated.problem;
      for (const locale of locales) {
        for (const themeId of themeIds) {
          const screenQuantities = composePuzzle({
            problem,
            themeId,
            modeId: 'quantities-to-named-equation',
            locale,
          }).context.quantities;
          const namesByRole = Object.fromEntries(
            screenQuantities.map((quantity) => [
              quantity.role,
              quantity.variableName,
            ]),
          ) as Record<string, string>;
          const equation = `${namesByRole.total} = ${
            problem.quantities.some((quantity) => quantity.role === 'base')
              ? `${namesByRole.base} + `
              : ''
          }${namesByRole.count} * ${namesByRole['per-item']}`;
          const accepted = submitPuzzle({
            problem,
            themeId,
            modeId: 'quantities-to-named-equation',
            locale,
            answer: { kind: 'text', input: equation },
          });
          expect(
            accepted.feedback?.kind,
            `${familyId}/${hiddenRole}/${themeId}/${locale}`,
          ).toBe('accepted');
        }
      }
    }
  }
});

test('academic notation answers are accepted for every hidden-role variant', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 77,
        hiddenRole,
      });
      const problem = generated.problem;
      const symbols = createAcademicSymbolMap(problem);
      const substituted = substituteVisibleValues(problem);
      const format = (node: any): string => {
        switch (node.kind) {
          case 'literal':
            return String(node.value);
          case 'quantity':
            return symbols[node.id];
          case 'add':
            return `${format(node.left)} + ${format(node.right)}`;
          case 'multiply':
            return `${format(node.left)} * ${format(node.right)}`;
          default:
            throw new Error(`Unexpected node ${JSON.stringify(node)}`);
        }
      };
      const formatNamed = (
        node: any,
        names: Record<string, string>,
      ): string => {
        switch (node.kind) {
          case 'literal':
            return String(node.value);
          case 'quantity':
            return names[node.id] ?? symbols[node.id];
          case 'add':
            return `${formatNamed(node.left, names)} + ${formatNamed(node.right, names)}`;
          case 'multiply':
            return `${formatNamed(node.left, names)} * ${formatNamed(node.right, names)}`;
          default:
            throw new Error(`Unexpected node ${JSON.stringify(node)}`);
        }
      };
      const input = `${format(substituted.left)} = ${format(substituted.right)}`;
      const forward = submitPuzzle({
        problem,
        themeId: 'gaming.drone-power',
        modeId: 'named-equation-to-academic-notation',
        locale: 'en',
        answer: { kind: 'text', input },
      });
      expect(
        forward.feedback?.kind,
        `${familyId}/${hiddenRole} forward`,
      ).toBe('accepted');
      const learnerNamesByCanonicalId = Object.fromEntries(
        themes['gaming.drone-power']
          .present({ problem, locale: 'en', storySeed: 0 })
          .facts.map((fact) => [fact.canonicalId, fact.variableName]),
      );
      const reverseInput = `${formatNamed(
        problem.relation.left,
        learnerNamesByCanonicalId,
      )} = ${formatNamed(
        problem.relation.right,
        learnerNamesByCanonicalId,
      )}`;
      const reverse = submitPuzzle({
        problem,
        themeId: 'gaming.drone-power',
        modeId: 'academic-notation-to-named-equation',
        locale: 'en',
        answer: { kind: 'text', input: reverseInput },
      });
      expect(reverse.feedback?.kind, `${familyId}/${hiddenRole} reverse`).toBe(
        'accepted',
      );
    }
  }
});

test('story-to-quantities accepts the canonical known/unknown split for every hidden role', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 77,
        hiddenRole,
      });
      const problem = generated.problem;
      const knownIds = problem.quantities
        .filter((quantity) => quantity.given.kind === 'known')
        .map((quantity) => quantity.id);
      const unknownId = problem.quantities.find(
        (quantity) => quantity.given.kind === 'hidden',
      )?.id;
      const accepted = submitPuzzle({
        problem,
        themeId: 'gaming.drone-power',
        modeId: 'story-to-quantities',
        locale: 'en',
        answer: { knownIds, unknownId },
      });
      expect(
        accepted.feedback?.kind,
        `${familyId}/${hiddenRole}`,
      ).toBe('quantity-selection-accepted');
      const wrongSelection = submitPuzzle({
        problem,
        themeId: 'gaming.drone-power',
        modeId: 'story-to-quantities',
        locale: 'en',
        answer: {
          knownIds: [...knownIds, unknownId!],
          unknownId: knownIds[0],
        },
      });
      expect(wrongSelection.feedback?.kind).toBe('incorrect');
    }
  }
});

test('multiple-choice distractors remain genuinely incorrect for every hidden role', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 17,
        hiddenRole,
      });
      const seeds = createNamedEquationChoiceSeeds(generated.problem);
      expect(seeds.length, `${familyId}/${hiddenRole}`).toBeGreaterThan(1);
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
            `${familyId}/${hiddenRole} ${seed.id} vs ${other.id}`,
          ).toBe(false);
        }
      }
    }
  }
});

test('modes expose no per-hidden-role branches and stay theme-free', () => {
  for (const modeId of modeIds) {
    const mode = modes[modeId];
    expect(mode.id).toBe(modeId);
  }
  const modeSources = [
    'features/puzzle/modes/story-to-quantities.ts',
    'features/puzzle/modes/quantities-to-named-equation.ts',
    'features/puzzle/modes/named-equation-to-academic-notation.ts',
    'features/puzzle/modes/academic-notation-to-named-equation.ts',
  ];
  for (const source of modeSources) {
    const text = readFileSync(source, 'utf8');
    expect(text, `${source} must not branch on concrete hidden quantity ids`).not.toContain(
      "hiddenRole === 'unitValue'",
    );
  }
});

test('the screen quantities never leak the hidden answer value', () => {
  for (const familyId of problemFamilyIds) {
    for (const hiddenRole of supportedHiddenRoles(familyId)) {
      const generated = generateFamilyCase(familyId, {
        seed: 123,
        hiddenRole,
      });
      const hiddenValue =
        generated.answerKey.bindings[
          generated.problem.quantities.find(
            (quantity) => quantity.given.kind === 'hidden',
          )!.id
        ];
      for (const themeId of themeIds) {
        const screen = composePuzzle({
          problem: generated.problem,
          themeId,
          modeId: 'quantities-to-named-equation',
          locale: 'en',
        });
        const hidden = screen.context.quantities.find(
          (quantity) => quantity.given.kind === 'hidden',
        );
        expect(hidden?.displayValue).toBe('?');
        expect(hidden?.given).toEqual({ kind: 'hidden' });
        expect(
          collectNumberValues(hidden),
          `${familyId}/${hiddenRole}`,
        ).toEqual([]);
      }
    }
  }
});
