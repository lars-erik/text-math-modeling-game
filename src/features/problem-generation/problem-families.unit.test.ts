import { expect, test } from 'vitest';
import {
  generateFamilyCase,
  isProblemFamilyId,
  problemFamilies,
  problemFamilyIds,
} from './problem-families';
import { serializeProblem } from '../problem-dsl';

test('the family registry contains exactly two real families', () => {
  expect(problemFamilyIds).toEqual(['total-from-parts', 'groups-total']);
  for (const familyId of problemFamilyIds) {
    expect(isProblemFamilyId(familyId)).toBe(true);
    expect(problemFamilies[familyId].id).toBe(familyId);
  }
  expect(isProblemFamilyId('unknown-family')).toBe(false);
});


test('both families generate deterministically from the same seed', () => {
  for (const familyId of problemFamilyIds) {
    const first = generateFamilyCase(familyId, { seed: 123 });
    const second = generateFamilyCase(familyId, { seed: 123 });
    expect(first.problem).toEqual(second.problem);
    expect(first.answerKey).toEqual(second.answerKey);
    expect(first.replay).toEqual(second.replay);
    expect(first.problem.replay?.seed).toBe(123);
    expect(first.problem.replay?.generatorVersion).toBe(
      first.replay.generatorVersion,
    );
  }
});

test('the families are genuinely different mathematical structures', () => {
  const totalFromParts = generateFamilyCase('total-from-parts', { seed: 123 });
  const groupsTotal = generateFamilyCase('groups-total', { seed: 123 });
  expect(groupsTotal.problem.quantities.map((q) => q.id)).toEqual([
    'count',
    'unitValue',
    'total',
  ]);
  expect(totalFromParts.problem.quantities.map((q) => q.id)).toEqual([
    'base',
    'count',
    'unitValue',
    'total',
  ]);
  expect(groupsTotal.problem.relation).not.toEqual(
    totalFromParts.problem.relation,
  );
  expect(groupsTotal.problem.relation).toEqual({
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  });
  expect(groupsTotal.problem.concepts).not.toContain('arithmetic.addition');
  expect(
    serializeProblem(groupsTotal.problem),
  ).not.toContain('base');
});

test('generateFamilyCase validates the seed', () => {
  expect(() => generateFamilyCase('groups-total', { seed: -1 })).toThrowError(
    /seed/,
  );
  expect(() =>
    generateFamilyCase('groups-total', { seed: Number.NaN }),
  ).toThrowError(/seed/);
  expect(() =>
    generateFamilyCase('groups-total', { seed: 0x1_0000_0000 }),
  ).toThrowError(/seed/);
});

test('every generated problem satisfies its family requiredRoles declaration', () => {
  for (const familyId of problemFamilyIds) {
    const family = problemFamilies[familyId];
    for (const seed of [0, 1, 17, 123, 4294967295]) {
      const { problem } = generateFamilyCase(familyId, { seed });
      const actualRoles = problem.quantities
        .map((quantity) => quantity.role)
        .filter((role) => role !== undefined)
        .sort();
      const declaredRoles = [...family.requiredRoles].sort();
      expect(actualRoles, `${familyId} seed ${seed}`).toEqual(declaredRoles);
    }
  }
});
