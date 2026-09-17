import { expect, test } from 'vitest';

import { evaluateRelation } from '../problem-model/expression';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from '../problem-model/total-from-parts.fixture';
import { parseNamedRelation } from '.';

test('parses the reference named equation with multiplication precedence', () => {
  const result = parseNamedRelation('total = base + count * unitValue');

  expect(result).toEqual({
    kind: 'success',
    relation: {
      kind: 'equation',
      left: { kind: 'quantity', id: 'total' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'base' },
        right: {
          kind: 'multiply',
          left: { kind: 'quantity', id: 'count' },
          right: { kind: 'quantity', id: 'unitValue' },
        },
      },
    },
  });

  if (result.kind !== 'success') {
    throw new Error(`Expected parse success, received ${result.kind}`);
  }

  expect(evaluateRelation(result.relation, totalFromPartsAnswerKey.bindings)).toEqual({
    kind: 'value',
    value: true,
  });
});
