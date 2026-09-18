import { describe, expect, test } from 'vitest';

import { evaluateRelation } from '../problem-model/expression';
import {
  totalFromPartsAnswerKey,
} from '../problem-model/total-from-parts.fixture';
import {
  englishLearnerNames,
  norwegianLearnerNames,
} from './learner-name-maps.fixture';
import { parseNamedRelation } from '.';

const canonicalNames = {
  a: 'a',
  b: 'b',
  base: 'base',
  c: 'c',
  count: 'count',
  total: 'total',
  unitValue: 'unitValue',
} as const;

test('parses the reference named equation with multiplication precedence', () => {
  const result = parseNamedRelation(
    'total = base + count * unitValue',
    canonicalNames,
  );

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

test('parses integer literals, whitespace, and left-associative addition', () => {
  expect(parseNamedRelation(' total = 10 + 2 + 3 ', canonicalNames)).toEqual({
    kind: 'success',
    relation: {
      kind: 'equation',
      left: { kind: 'quantity', id: 'total' },
      right: {
        kind: 'add',
        left: {
          kind: 'add',
          left: { kind: 'literal', value: 10 },
          right: { kind: 'literal', value: 2 },
        },
        right: { kind: 'literal', value: 3 },
      },
    },
  });
});

test('parentheses produce a different AST from multiplication precedence', () => {
  const grouped = parseNamedRelation('total = (a+b)*c', canonicalNames);
  const precedence = parseNamedRelation('total = a+b*c', canonicalNames);

  expect(grouped.kind).toBe('success');
  expect(precedence.kind).toBe('success');
  if (grouped.kind !== 'success' || precedence.kind !== 'success') {
    throw new Error('Expected both equations to parse');
  }

  expect(grouped.relation).not.toEqual(precedence.relation);
  expect(grouped.relation.right).toEqual({
    kind: 'multiply',
    left: {
      kind: 'add',
      left: { kind: 'quantity', id: 'a' },
      right: { kind: 'quantity', id: 'b' },
    },
    right: { kind: 'quantity', id: 'c' },
  });
  expect(precedence.relation.right).toEqual({
    kind: 'add',
    left: { kind: 'quantity', id: 'a' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'b' },
      right: { kind: 'quantity', id: 'c' },
    },
  });
});

describe('identifier resolution', () => {
  test('English and Norwegian learner names resolve to the same canonical AST', () => {
    const english = parseNamedRelation(
      'totalPower = basePower + droneCount * dronePower',
      englishLearnerNames,
    );
    const norwegian = parseNamedRelation(
      'totalEffekt = grunnEffekt + droneAntall * droneEffekt',
      norwegianLearnerNames,
    );

    expect(english).toEqual(norwegian);
    expect(english).toMatchObject({
      kind: 'success',
      relation: {
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
  });

  test('returns a typed unknown-identifier diagnostic with its source position', () => {
    expect(
      parseNamedRelation('total = base + mystery', canonicalNames),
    ).toEqual({
      kind: 'unknown-identifier',
      identifier: 'mystery',
      message: 'Unknown identifier "mystery".',
      range: {
        start: { offset: 15, line: 1, column: 16 },
        end: { offset: 22, line: 1, column: 23 },
      },
      availableIdentifiers: [
        'a',
        'b',
        'base',
        'c',
        'count',
        'total',
        'unitValue',
      ],
    });
  });

  test('returns a typed ambiguous-identifier diagnostic', () => {
    expect(
      parseNamedRelation('total = rate', {
        rate: ['base', 'unitValue'],
        total: 'total',
      }),
    ).toEqual({
      kind: 'ambiguous-identifier',
      identifier: 'rate',
      message: 'Identifier "rate" is ambiguous.',
      range: {
        start: { offset: 8, line: 1, column: 9 },
        end: { offset: 12, line: 1, column: 13 },
      },
      candidateIds: ['base', 'unitValue'],
    });
  });

  test('accepts an injected resolver independently of a name map', () => {
    const result = parseNamedRelation('result = x', {
      availableIdentifiers: ['result', 'x'],
      resolve(identifier) {
        return identifier === 'result'
          ? { kind: 'resolved', quantityId: 'total' }
          : { kind: 'resolved', quantityId: 'unitValue' };
      },
    });

    expect(result).toEqual({
      kind: 'success',
      relation: {
        kind: 'equation',
        left: { kind: 'quantity', id: 'total' },
        right: { kind: 'quantity', id: 'unitValue' },
      },
    });
  });
});

test('returns a deterministic syntax diagnostic at the unexpected token', () => {
  expect(parseNamedRelation('total = base + * count', canonicalNames)).toEqual({
    kind: 'syntax-error',
    message: 'Expected an identifier, an integer, or "(" at line 1, column 16.',
    expected: 'an identifier, an integer, or "("',
    range: {
      start: { offset: 15, line: 1, column: 16 },
      end: { offset: 15, line: 1, column: 16 },
    },
  });
});

test('rejects an integer that cannot be represented safely', () => {
  expect(
    parseNamedRelation(
      'total = 999999999999999999999999999999',
      canonicalNames,
    ),
  ).toMatchObject({
    kind: 'invalid-integer-literal',
    literal: '999999999999999999999999999999',
    message:
      'Integer literal "999999999999999999999999999999" is outside the safe integer range.',
  });
});
