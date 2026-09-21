import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';
import { generateFamilyCase } from '../../problem-generation/problem-families';
import { createStoryCandidateSeeds } from './story-candidates';

test('a fixed problem contains exactly one matching story candidate', () => {
  const candidates = createStoryCandidateSeeds(totalFromPartsProblem);

  const matching = candidates.filter(
    (candidate) => candidate.id === 'matching',
  );
  expect(matching).toHaveLength(1);
  expect(matching[0].optionPosition).toBe(0);
  expect(matching[0].relation).toEqual(totalFromPartsProblem.relation);
});

test('the candidate set adds meaningful structural distractors for total-from-parts', () => {
  const candidates = createStoryCandidateSeeds(totalFromPartsProblem);

  expect(candidates.map((candidate) => candidate.id)).toEqual([
    'matching',
    'factor-into-group',
    'add-instead-of-multiply',
  ]);
  expect(candidates.map((candidate) => candidate.optionPosition)).toEqual([
    0, 1, 2,
  ]);
  const factorIntoGroup = candidates[1];
  expect(factorIntoGroup.relation).toEqual({
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'base' },
        right: { kind: 'quantity', id: 'unitValue' },
      },
    },
  });
  const addInsteadOfMultiply = candidates[2];
  expect(addInsteadOfMultiply.relation).toEqual({
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'base' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'count' },
        right: { kind: 'quantity', id: 'unitValue' },
      },
    },
  });
  for (const candidate of candidates) {
    for (const other of candidates) {
      if (candidate.id === other.id) {
        continue;
      }
      expect(
        relationsHaveNormalizedStructure(
          candidate.relation,
          other.relation,
          namedEquationStructurePolicy,
        ),
        `${candidate.id} must differ from ${other.id}`,
      ).toBe(false);
    }
  }
});

test('candidate generation is deterministic for the same problem', () => {
  const first = createStoryCandidateSeeds(totalFromPartsProblem);
  const second = createStoryCandidateSeeds(totalFromPartsProblem);
  expect(first).toEqual(second);
});

test('groups-total produces the add-instead-of-multiply distractor only', () => {
  const generated = generateFamilyCase('groups-total', { seed: 17 });
  const candidates = createStoryCandidateSeeds(generated.problem);

  expect(candidates.map((candidate) => candidate.id)).toEqual([
    'matching',
    'add-instead-of-multiply',
  ]);
  expect(candidates.map((candidate) => candidate.optionPosition)).toEqual([
    0, 1,
  ]);
  const addInsteadOfMultiply = candidates[1];
  expect(addInsteadOfMultiply.relation).toEqual({
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'count' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  });
});
