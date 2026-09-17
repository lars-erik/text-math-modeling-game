import { describe, expect, test } from 'vitest';

import { collectReferences, evaluateRelation } from './expression';
import {
  getVisibleBindings,
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
