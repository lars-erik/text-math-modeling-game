import fc from 'fast-check';
import { expect, test } from 'vitest';
import { parseProblem } from '../problem-dsl/parse-problem';
import { serializeProblem } from '../problem-dsl/serialize-problem';
import { evaluateRelation } from '../problem-model/expression';
import {
  validateProblemAst,
  validateProblemConstraints,
} from '../problem-model/problem-validation';
import {
  generateFamilyCase,
  problemFamilies,
  problemFamilyIds,
} from './problem-families';

const supportedHiddenRoleCombinations = problemFamilyIds.flatMap((familyId) =>
  problemFamilies[familyId].hiddenRoles.map((hiddenRole) => ({
    familyId,
    hiddenRole,
  })),
);

const generationSeedArbitrary = fc.integer({ min: 0, max: 1_000_000 });

test('the registry declares the M12 family x hidden-role combinations', () => {
  expect(supportedHiddenRoleCombinations).toEqual([
    { familyId: 'total-from-parts', hiddenRole: 'per-item' },
    { familyId: 'total-from-parts', hiddenRole: 'base' },
    { familyId: 'total-from-parts', hiddenRole: 'count' },
    { familyId: 'total-from-parts', hiddenRole: 'total' },
    { familyId: 'groups-total', hiddenRole: 'per-item' },
    { familyId: 'groups-total', hiddenRole: 'count' },
    { familyId: 'groups-total', hiddenRole: 'total' },
  ]);
});

test('every supported family x hidden-role combination produces exactly one intended unknown with a valid private solution', () => {
  fc.assert(
    fc.property(
      generationSeedArbitrary,
      fc.context(),
      (seed, context) => {
        for (const { familyId, hiddenRole } of supportedHiddenRoleCombinations) {
          const generated = generateFamilyCase(familyId, { seed, hiddenRole });
          context.log(
            `family=${familyId} hiddenRole=${hiddenRole} seed=${seed}`,
          );
          const hiddenQuantities = generated.problem.quantities.filter(
            (quantity) => quantity.given.kind === 'hidden',
          );
          expect(
            hiddenQuantities.length,
            `${familyId}/${hiddenRole}`,
          ).toBe(1);
          expect(hiddenQuantities[0]?.role, `${familyId}/${hiddenRole}`).toBe(
            hiddenRole,
          );
          expect(
            generated.problem.replay?.hiddenRole,
            `${familyId}/${hiddenRole}`,
          ).toBe(hiddenRole);
          expect(
            generated.replay.hiddenRole,
            `${familyId}/${hiddenRole}`,
          ).toBe(hiddenRole);
          expect(
            validateProblemAst(generated.problem),
            `${familyId}/${hiddenRole}`,
          ).toEqual([]);
          expect(
            validateProblemConstraints(generated.problem, generated.answerKey, [
              'relation-satisfaction',
              'known-answer-consistency',
              'safe-answer-values',
            ]),
            `${familyId}/${hiddenRole}`,
          ).toEqual([]);
          expect(
            evaluateRelation(
              generated.problem.relation,
              generated.answerKey.bindings,
            ),
          ).toEqual({ kind: 'value', value: true });
          const hiddenId = hiddenQuantities[0]!.id;
          const hiddenValue = generated.answerKey.bindings[hiddenId];
          expect(Number.isSafeInteger(hiddenValue)).toBe(true);
          expect(hiddenValue).toBeGreaterThan(0);
        }
      },
    ),
    { numRuns: 60 },
  );
});

test('replay reproduces the same hidden role and values deterministically', () => {
  for (const { familyId, hiddenRole } of supportedHiddenRoleCombinations) {
    const first = generateFamilyCase(familyId, { seed: 4242, hiddenRole });
    const second = generateFamilyCase(familyId, { seed: 4242, hiddenRole });
    expect(first.problem, `${familyId}/${hiddenRole}`).toEqual(second.problem);
    expect(first.answerKey, `${familyId}/${hiddenRole}`).toEqual(
      second.answerKey,
    );
    expect(first.replay, `${familyId}/${hiddenRole}`).toEqual(second.replay);
  }
});

test('the hidden role changes visibility while the family values stay identical', () => {
  for (const familyId of problemFamilyIds) {
    const family = problemFamilies[familyId];
    const reference = generateFamilyCase(familyId, { seed: 77 });
    for (const hiddenRole of family.hiddenRoles) {
      const variant = generateFamilyCase(familyId, {
        seed: 77,
        hiddenRole,
      });
      expect(
        variant.answerKey.bindings,
        `${familyId}/${hiddenRole}`,
      ).toEqual(reference.answerKey.bindings);
      expect(variant.problem.relation, `${familyId}/${hiddenRole}`).toEqual(
        reference.problem.relation,
      );
      const hiddenIds = variant.problem.quantities
        .filter((quantity) => quantity.given.kind === 'hidden')
        .map((quantity) => quantity.id);
      expect(hiddenIds, `${familyId}/${hiddenRole}`).toHaveLength(1);
      const referenceHiddenIds = reference.problem.quantities
        .filter((quantity) => quantity.given.kind === 'hidden')
        .map((quantity) => quantity.id);
      if (hiddenRole === 'per-item') {
        expect(hiddenIds, `${familyId}/${hiddenRole}`).toEqual(
          referenceHiddenIds,
        );
      } else {
        expect(hiddenIds, `${familyId}/${hiddenRole}`).not.toEqual(
          referenceHiddenIds,
        );
      }
    }
  }
});

test('count-unknown variants keep the arithmetic clean within the integer product scope', () => {
  fc.assert(
    fc.property(generationSeedArbitrary, (seed) => {
      const totalFromParts = generateFamilyCase('total-from-parts', {
        seed,
        hiddenRole: 'count',
      });
      const parts = totalFromParts.answerKey.bindings;
      expect(parts.total! - parts.base!).toBe(parts.count! * parts.unitValue!);
      expect(parts.count).toBeGreaterThanOrEqual(2);
      expect(parts.count).toBeLessThanOrEqual(8);
      const groupsTotal = generateFamilyCase('groups-total', {
        seed,
        hiddenRole: 'count',
      });
      const groups = groupsTotal.answerKey.bindings;
      expect(groups.total).toBe(groups.count! * groups.unitValue!);
      expect(groups.count).toBeGreaterThanOrEqual(2);
      expect(groups.count).toBeLessThanOrEqual(12);
    }),
    { numRuns: 100 },
  );
});

test('hidden-role variants round-trip through canonical DSL serialization', () => {
  fc.assert(
    fc.property(generationSeedArbitrary, (seed) => {
      for (const { familyId, hiddenRole } of supportedHiddenRoleCombinations) {
        const generated = generateFamilyCase(familyId, { seed, hiddenRole });
        const dsl = serializeProblem(generated.problem);
        const parsed = parseProblem(dsl);
        expect(parsed.kind, `${familyId}/${hiddenRole}`).toBe('success');
        if (parsed.kind !== 'success') {
          throw new Error(`Expected parse success, received ${parsed.kind}`);
        }
        expect(parsed.problem, `${familyId}/${hiddenRole}`).toEqual(
          generated.problem,
        );
      }
    }),
    { numRuns: 40 },
  );
});

test('unsupported hidden roles are rejected explicitly', () => {
  expect(() =>
    generateFamilyCase('groups-total', { seed: 5, hiddenRole: 'base' }),
  ).toThrowError(/hidden role/i);
  expect(() =>
    generateFamilyCase('total-from-parts', {
      seed: 5,
      hiddenRole: 'nonsense' as never,
    }),
  ).toThrowError(/hidden role/i);
});

test('generation without an explicit hidden role keeps the per-item default', () => {
  for (const familyId of problemFamilyIds) {
    const generated = generateFamilyCase(familyId, { seed: 11 });
    const hidden = generated.problem.quantities.filter(
      (quantity) => quantity.given.kind === 'hidden',
    );
    expect(hidden).toHaveLength(1);
    expect(hidden[0]?.role).toBe('per-item');
    expect(generated.problem.replay?.hiddenRole).toBe('per-item');
  }
});
