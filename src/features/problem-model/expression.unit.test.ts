import { describe, expect, test } from 'vitest';

import {
  evaluateExpression,
  evaluateRelation,
} from './expression';
import { totalFromParts } from './total-from-parts.fixture';

describe('semantic expression evaluation', () => {
  test.each([
    { expected: true, total: 210 },
    { expected: false, total: 211 },
  ])(
    'reports total = base + count * unitValue as $expected for total $total',
    ({ expected, total }) => {
      const result = evaluateRelation(totalFromParts, {
        base: 30,
        count: 4,
        total,
        unitValue: 45,
      });

      expect(result).toEqual({ kind: 'value', value: expected });
    },
  );

  test('evaluates a numeric literal without bindings', () => {
    expect(evaluateExpression({ kind: 'literal', value: 7 }, {})).toEqual({
      kind: 'value',
      value: 7,
    });
  });

  test('reports a missing quantity binding explicitly', () => {
    expect(
      evaluateExpression({ kind: 'quantity', id: 'unitValue' }, {}),
    ).toEqual({
      kind: 'missing-binding',
      id: 'unitValue',
    });
  });
});
