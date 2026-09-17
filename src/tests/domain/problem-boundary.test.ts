import { describe, expect, test } from 'vitest';

import { evaluateRelation } from '../../domain/expression';
import { getVisibleBindings } from '../../domain/problem';
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
});
