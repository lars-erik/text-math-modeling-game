import { describe, expect, test } from 'vitest';

import { collectReferences, evaluateRelation } from './expression';
import {
  getVisibleBindings,
} from './problem';
import {
  allProblemConstraintCodes,
  validateProblemAst,
  validateProblemConstraints,
} from './problem-validation';
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

    expect(validateProblemAst(problemWithoutUnitValue)).toContainEqual({
      kind: 'undefined-quantity',
      id: 'unitValue',
    });
  });

  test('accepts an answer key that satisfies the relation', () => {
    expect(
      validateProblemConstraints(
        totalFromPartsProblem,
        totalFromPartsAnswerKey,
        ['relation-satisfaction'],
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
      validateProblemConstraints(
        totalFromPartsProblem,
        answerKeyWithoutUnitValue,
        ['relation-satisfaction'],
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
      validateProblemConstraints(totalFromPartsProblem, wrongAnswerKey, [
        'relation-satisfaction',
      ]),
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
      validateProblemAst(duplicateProblem),
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

      const issues = validateProblemAst(problem);

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
      validateProblemConstraints(
        totalFromPartsProblem,
        answerKeyWithoutKnownCount,
        ['known-answer-consistency'],
      ),
    ).toContainEqual({
      kind: 'missing-known-answer-binding',
      id: 'count',
    });
  });

  test('treats undefined known binding as missing', () => {
    const answerKeyWithUndefinedKnownBinding = {
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        count: undefined,
      },
    } as unknown as typeof totalFromPartsAnswerKey;

    expect(
      validateProblemConstraints(
        totalFromPartsProblem,
        answerKeyWithUndefinedKnownBinding,
        ['known-answer-consistency'],
      ),
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
      validateProblemConstraints(totalFromPartsProblem, mismatchedAnswerKey, [
        'known-answer-consistency',
      ]),
    ).toContainEqual({
      kind: 'known-answer-mismatch',
      id: 'total',
      knownValue: 210,
      answerValue: 211,
    });
  });

  test('reports mismatch when duplicate known IDs disagree with answer key', () => {
    const duplicateProblem = {
      ...totalFromPartsProblem,
      quantities: [
        ...totalFromPartsProblem.quantities,
        {
          ...totalFromPartsProblem.quantities[0],
          given: { kind: 'known' as const, value: 31 },
        },
      ],
    };

    expect(
      validateProblemConstraints(duplicateProblem, totalFromPartsAnswerKey, [
        'known-answer-consistency',
      ]),
    ).toContainEqual({
      kind: 'known-answer-mismatch',
      id: 'base',
      knownValue: 31,
      answerValue: 30,
    });
  });

  test('reports multiple invariant failures together', () => {
    const invalidProblem = {
      ...totalFromPartsProblem,
      quantities: [
        ...totalFromPartsProblem.quantities.map((quantity) =>
          quantity.id === 'unitValue'
            ? { ...quantity, given: { kind: 'known' as const, value: 45 } }
            : quantity,
        ),
        {
          ...totalFromPartsProblem.quantities[0],
          given: { kind: 'known' as const, value: 31 },
        },
      ],
    };
    const inconsistentAnswerKey = {
      ...totalFromPartsAnswerKey,
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        total: 211,
      },
    };

    expect(validateProblemAst(invalidProblem)).toEqual(
      expect.arrayContaining([
        { kind: 'duplicate-quantity-id', id: 'base' },
        { kind: 'invalid-hidden-quantity-count', count: 0 },
      ]),
    );

    expect(
      validateProblemConstraints(invalidProblem, inconsistentAnswerKey, [
        'known-answer-consistency',
      ]),
    ).toEqual(
      expect.arrayContaining([
        {
          kind: 'known-answer-mismatch',
          id: 'total',
          knownValue: 210,
          answerValue: 211,
        },
      ]),
    );
  });
});

describe('unified problem validation APIs', () => {
  test('defaults to relation satisfaction constraint', () => {
    const inconsistentAnswerKey = {
      ...totalFromPartsAnswerKey,
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        total: 211,
      },
    };

    expect(validateProblemConstraints(totalFromPartsProblem, inconsistentAnswerKey)).toEqual(
      [{ kind: 'unsatisfied-relation' }],
    );
  });

  test('supports full custom constraint set', () => {
    const inconsistentAnswerKey = {
      ...totalFromPartsAnswerKey,
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        total: 211,
      },
    };

    expect(
      validateProblemConstraints(
        totalFromPartsProblem,
        inconsistentAnswerKey,
        allProblemConstraintCodes,
      ),
    ).toEqual(
      expect.arrayContaining([
        { kind: 'unsatisfied-relation' },
        {
          kind: 'known-answer-mismatch',
          id: 'total',
          knownValue: 210,
          answerValue: 211,
        },
      ]),
    );
  });
});
