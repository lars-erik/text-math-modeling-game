import { expect, test } from 'vitest';

import { parseProblem } from './parse-problem';
import { referenceProblemDsl } from './reference-problem.fixture';

test('parses the complete reference problem DSL into the domain model', () => {
  expect(parseProblem(referenceProblemDsl)).toEqual({
    kind: 'success',
    problem: {
      id: 'drone-power',
      concepts: [
        'arithmetic.addition',
        'arithmetic.multiplication',
        'algebra.variable',
        'linear.one-unknown',
      ],
      quantities: [
        {
          id: 'basePower',
          dimension: 'power',
          given: { kind: 'known', value: 30 },
        },
        {
          id: 'droneCount',
          dimension: 'item',
          given: { kind: 'known', value: 4 },
        },
        {
          id: 'dronePower',
          dimension: 'powerPerItem',
          given: { kind: 'hidden' },
        },
        {
          id: 'totalPower',
          dimension: 'power',
          given: { kind: 'known', value: 210 },
        },
      ],
      relation: {
        kind: 'equation',
        left: { kind: 'quantity', id: 'totalPower' },
        right: {
          kind: 'add',
          left: { kind: 'quantity', id: 'basePower' },
          right: {
            kind: 'multiply',
            left: { kind: 'quantity', id: 'droneCount' },
            right: { kind: 'quantity', id: 'dronePower' },
          },
        },
      },
      scenarioId: 'gaming.drone-power',
      academicSymbols: { dronePower: 'p' },
    },
  });
});

test('returns the domain validation issue for a duplicate quantity ID', () => {
  const duplicateQuantityDsl = referenceProblemDsl.replace(
    '    quantity basePower: power = 30\n',
    '    quantity basePower: power = 30\n    quantity basePower: power = 31\n',
  );

  expect(parseProblem(duplicateQuantityDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [{ kind: 'duplicate-quantity-id', id: 'basePower' }],
  });
});

test('returns the domain validation issue for an undefined equation identifier', () => {
  const undefinedIdentifierDsl = referenceProblemDsl.replace(
    'droneCount * dronePower',
    'droneCount * missingPower',
  );

  expect(parseProblem(undefinedIdentifierDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [{ kind: 'undefined-quantity', id: 'missingPower' }],
  });
});

test('returns a typed deterministic diagnostic for malformed DSL', () => {
  const malformedDsl = referenceProblemDsl.replace(
    'quantity droneCount: item',
    'quantity droneCount item',
  );

  expect(parseProblem(malformedDsl)).toEqual({
    kind: 'syntax-error',
    message: 'Expected ":" at line 10, column 25.',
    expected: '":"',
    range: {
      start: { offset: 217, line: 10, column: 25 },
      end: { offset: 217, line: 10, column: 25 },
    },
  });
});

test('reports malformed equation syntax in complete DSL source coordinates', () => {
  const malformedEquationDsl = referenceProblemDsl.replace(
    'droneCount * dronePower',
    'droneCount + * dronePower',
  );
  const invalidOffset = malformedEquationDsl.indexOf('* dronePower');

  expect(parseProblem(malformedEquationDsl)).toEqual({
    kind: 'syntax-error',
    message: 'Expected an identifier, an integer, or "(" at line 15, column 47.',
    expected: 'an identifier, an integer, or "("',
    range: {
      start: { offset: invalidOffset, line: 15, column: 47 },
      end: { offset: invalidOffset, line: 15, column: 47 },
    },
  });
});

test('rejects an academic symbol mapping for an undefined quantity', () => {
  const undefinedSymbolDsl = referenceProblemDsl.replace(
    'symbol dronePower = p',
    'symbol missingPower = p',
  );

  expect(parseProblem(undefinedSymbolDsl)).toEqual({
    kind: 'invalid-problem',
    issues: [
      { kind: 'undefined-academic-symbol-quantity', id: 'missingPower' },
    ],
  });
});

test('returns a typed diagnostic instead of discarding a duplicate symbol mapping', () => {
  const duplicateSymbolDsl = referenceProblemDsl.replace(
    '    symbol dronePower = p\n',
    '    symbol dronePower = p\n    symbol dronePower = q\n',
  );

  expect(parseProblem(duplicateSymbolDsl)).toEqual({
    kind: 'duplicate-symbol-mapping',
    quantityId: 'dronePower',
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
