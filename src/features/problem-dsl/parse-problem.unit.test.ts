import { expect, test } from 'vitest';

import { parseProblem } from './parse-problem';
import { referenceProblemDsl } from './reference-problem.fixture';

test('parses the complete reference problem DSL into the domain model', () => {
  expect(parseProblem(referenceProblemDsl)).toEqual({
    kind: 'success',
    problem: {
      id: 'total-from-parts',
      concepts: [
        'arithmetic.addition',
        'arithmetic.multiplication',
        'algebra.variable',
        'linear.one-unknown',
      ],
      quantities: [
        {
          id: 'base',
          dimension: 'amount',
          given: { kind: 'known', value: 30 },
        },
        {
          id: 'count',
          dimension: 'item',
          given: { kind: 'known', value: 4 },
        },
        {
          id: 'unitValue',
          dimension: 'amountPerItem',
          given: { kind: 'hidden' },
        },
        {
          id: 'total',
          dimension: 'amount',
          given: { kind: 'known', value: 210 },
        },
      ],
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
      academicSymbols: { unitValue: 'p' },
    },
  });
});

test('returns the domain validation issue for a duplicate quantity ID', () => {
  const duplicateQuantityDsl = referenceProblemDsl.replace(
    '    quantity base: amount = 30\n',
    '    quantity base: amount = 30\n    quantity base: amount = 31\n',
  );

  expect(parseProblem(duplicateQuantityDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [{ kind: 'duplicate-quantity-id', id: 'base' }],
  });
});

test('returns the domain validation issue for an undefined equation identifier', () => {
  const undefinedIdentifierDsl = referenceProblemDsl.replace(
    'count * unitValue',
    'count * missingValue',
  );

  expect(parseProblem(undefinedIdentifierDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [{ kind: 'undefined-quantity', id: 'missingValue' }],
  });
});

test('returns a typed deterministic diagnostic for malformed DSL', () => {
  const malformedDsl = referenceProblemDsl.replace(
    'quantity count: item',
    'quantity count item',
  );

  expect(parseProblem(malformedDsl)).toEqual({
    kind: 'syntax-error',
    message: 'Expected ":" at line 10, column 20.',
    expected: '":"',
    range: {
      start: { offset: 213, line: 10, column: 20 },
      end: { offset: 213, line: 10, column: 20 },
    },
  });
});

test('reports malformed equation syntax in complete DSL source coordinates', () => {
  const malformedEquationDsl = referenceProblemDsl.replace(
    'count * unitValue',
    'count + * unitValue',
  );
  const invalidOffset = malformedEquationDsl.indexOf('* unitValue');

  expect(parseProblem(malformedEquationDsl)).toEqual({
    kind: 'syntax-error',
    message: 'Expected an identifier, an integer, or "(" at line 15, column 32.',
    expected: 'an identifier, an integer, or "("',
    range: {
      start: { offset: invalidOffset, line: 15, column: 32 },
      end: { offset: invalidOffset, line: 15, column: 32 },
    },
  });
});

test('rejects an academic symbol mapping for an undefined quantity', () => {
  const undefinedSymbolDsl = referenceProblemDsl.replace(
    'symbol unitValue = p',
    'symbol missingValue = p',
  );

  expect(parseProblem(undefinedSymbolDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [
      { kind: 'undefined-academic-symbol-quantity', id: 'missingValue' },
    ],
  });
});

test('returns a typed diagnostic instead of discarding a duplicate symbol mapping', () => {
  const duplicateSymbolDsl = referenceProblemDsl.replace(
    '    symbol unitValue = p\n',
    '    symbol unitValue = p\n    symbol unitValue = q\n',
  );

  expect(parseProblem(duplicateSymbolDsl)).toEqual({
    kind: 'duplicate-symbol-mapping',
    quantityId: 'unitValue',
    symbols: ['p', 'q'],
  });
});

test('reports an unsafe replay seed as a typed invalid-problem issue', () => {
  const unsafeReplaySeedDsl = `${referenceProblemDsl.slice(0, -2)}

    replay {
        seed 999999999999999999999999999999
        generator hand-built-v1
    }
}
`;

  expect(parseProblem(unsafeReplaySeedDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [
      {
        kind: 'unsafe-replay-seed',
        value: 1e30,
      },
    ],
  });
});
