import { describe, expect, test } from 'vitest';

import { collectReferences, evaluateRelation } from './expression';
import {
  getVisibleBindings,
  validateProblemInvariants,
  validateProblemReferences,
  validateProblemSolution,
} from './problem';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from './total-from-parts.fixture';

describe('learner-visible problem boundary', () => {
  test('omits the hidden per-item value from visible bindings', () => {
    expect(getVisibleBindings(totalFromPartsProblem)).toEqual({
      base: 30,
      count: 4,
      total: 210,
    });
  });

  test('keeps complete bindings in a separate answer key', () => {
    expect(
      evaluateRelation(
        totalFromPartsProblem.relation,
        totalFromPartsAnswerKey.bindings,
      ),
    ).toEqual({ kind: 'value', value: true });
  });

  test('collects referenced quantity IDs in stable tree order', () => {
    expect(collectReferences(totalFromPartsProblem.relation)).toEqual([
      'total',
      'base',
      'count',
      'unitValue',
    ]);
  });

  test('reports a relation reference that has no declared quantity', () => {
    const problemWithoutUnitValue = {
      ...totalFromPartsProblem,
      quantities: totalFromPartsProblem.quantities.filter(
        (quantity) => quantity.id !== 'unitValue',
      ),
    };

    expect(validateProblemReferences(problemWithoutUnitValue)).toEqual([
      { kind: 'undefined-quantity', id: 'unitValue' },
    ]);
  });

  test('accepts an answer key that satisfies the relation', () => {
    expect(
      validateProblemSolution(
        totalFromPartsProblem,
        totalFromPartsAnswerKey,
      ),
    ).toEqual([]);
  });

  test('reports a missing hidden answer binding', () => {
    const answerKeyWithoutUnitValue = {
      bindings: {
        base: 30,
        count: 4,
        total: 210,
      },
    };

    expect(
      validateProblemSolution(
        totalFromPartsProblem,
        answerKeyWithoutUnitValue,
      ),
    ).toEqual([{ kind: 'missing-answer-binding', id: 'unitValue' }]);
  });

  test('reports an answer key that does not satisfy the relation', () => {
    const wrongAnswerKey = {
      ...totalFromPartsAnswerKey,
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        total: 211,
      },
    };

    expect(
      validateProblemSolution(totalFromPartsProblem, wrongAnswerKey),
    ).toEqual([{ kind: 'unsatisfied-relation' }]);
  });
});

describe('Phase 1 problem invariants', () => {
  test('reports duplicate quantity IDs', () => {
    const duplicateProblem = {
      ...totalFromPartsProblem,
      quantities: [...totalFromPartsProblem.quantities, totalFromPartsProblem.quantities[0]],
    };

    expect(
      validateProblemInvariants(duplicateProblem, totalFromPartsAnswerKey),
    ).toContainEqual({
      kind: 'duplicate-quantity-id',
      id: 'base',
    });
  });

  test.each([
    {
      hiddenQuantityIds: [] as string[],
      expectedIssue: { kind: 'invalid-hidden-quantity-count' as const, count: 0 },
    },
    {
      hiddenQuantityIds: ['unitValue'] as string[],
      expectedIssue: undefined,
    },
    {
      hiddenQuantityIds: ['base', 'unitValue'] as string[],
      expectedIssue: { kind: 'invalid-hidden-quantity-count' as const, count: 2 },
    },
  ])(
    'enforces exactly one hidden quantity for %j',
    ({ hiddenQuantityIds, expectedIssue }) => {
      const problem = {
        ...totalFromPartsProblem,
        quantities: totalFromPartsProblem.quantities.map((quantity) => ({
          ...quantity,
          given: hiddenQuantityIds.includes(quantity.id)
            ? ({ kind: 'hidden' } as const)
            : ({ kind: 'known', value: 1 } as const),
        })),
      };

      const issues = validateProblemInvariants(problem, totalFromPartsAnswerKey);

      if (expectedIssue === undefined) {
        expect(
          issues.filter((issue) => issue.kind === 'invalid-hidden-quantity-count'),
        ).toEqual([]);
        return;
      }

      expect(issues).toContainEqual(expectedIssue);
    },
  );

  test('reports a known quantity that has no answer-key binding', () => {
    const answerKeyWithoutKnownCount = {
      bindings: {
        base: 30,
        total: 210,
        unitValue: 45,
      },
    };

    expect(
      validateProblemInvariants(totalFromPartsProblem, answerKeyWithoutKnownCount),
    ).toContainEqual({
      kind: 'missing-known-answer-binding',
      id: 'count',
    });
  });

  test('reports disagreement between known values and answer-key bindings', () => {
    const mismatchedAnswerKey = {
      ...totalFromPartsAnswerKey,
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        total: 211,
      },
    };

    expect(
      validateProblemInvariants(totalFromPartsProblem, mismatchedAnswerKey),
    ).toContainEqual({
      kind: 'known-answer-mismatch',
      id: 'total',
      knownValue: 210,
      answerValue: 211,
    });
  });
});
