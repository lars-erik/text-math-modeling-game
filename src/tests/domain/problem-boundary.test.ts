import { describe, expect, test } from 'vitest';

import { collectReferences, evaluateRelation } from '../../domain/expression';
import {
  getVisibleBindings,
  validateProblemReferences,
} from '../../domain/problem';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from '../fixtures/total-from-parts';

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
});
