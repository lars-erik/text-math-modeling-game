import { expect, test } from 'vitest';

import type { Problem } from './problem';
import { validateProblemAst } from './problem-validation';
import { totalFromPartsProblem } from './total-from-parts.fixture';

test('reports addition of incompatible quantity dimensions', () => {
  const problem = {
    ...totalFromPartsProblem,
    quantities: totalFromPartsProblem.quantities.map((quantity) => {
      switch (quantity.id) {
        case 'base':
        case 'total':
          return { ...quantity, dimension: 'amount' as const };
        case 'unitValue':
          return { ...quantity, dimension: 'amountPerItem' as const };
        default:
          return quantity;
      }
    }),
    relation: {
      kind: 'equation',
      left: { kind: 'quantity', id: 'total' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'base' },
        right: { kind: 'quantity', id: 'count' },
      },
    },
  } satisfies Problem;

  expect(validateProblemAst(problem)).toContainEqual({
    kind: 'incompatible-addition-dimensions',
    left: 'amount',
    right: 'item',
  });
});

test('reports multiplication of dimensions with no Phase 1 product rule', () => {
  const problem = {
    ...totalFromPartsProblem,
    quantities: totalFromPartsProblem.quantities.map((quantity) => {
      switch (quantity.id) {
        case 'base':
        case 'total':
          return { ...quantity, dimension: 'amount' as const };
        case 'unitValue':
          return { ...quantity, dimension: 'amountPerItem' as const };
        default:
          return quantity;
      }
    }),
    relation: {
      kind: 'equation',
      left: { kind: 'quantity', id: 'total' },
      right: {
        kind: 'multiply',
        left: { kind: 'quantity', id: 'count' },
        right: { kind: 'quantity', id: 'base' },
      },
    },
  } satisfies Problem;

  expect(validateProblemAst(problem)).toContainEqual({
    kind: 'incompatible-multiplication-dimensions',
    left: 'item',
    right: 'amount',
  });
});

test('reports an equation whose two sides have different dimensions', () => {
  const problem = {
    ...totalFromPartsProblem,
    quantities: totalFromPartsProblem.quantities.map((quantity) => {
      switch (quantity.id) {
        case 'total':
          return { ...quantity, dimension: 'amount' as const };
        case 'unitValue':
          return { ...quantity, dimension: 'amountPerItem' as const };
        default:
          return quantity;
      }
    }),
    relation: {
      kind: 'equation',
      left: { kind: 'quantity', id: 'total' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  } satisfies Problem;

  expect(validateProblemAst(problem)).toContainEqual({
    kind: 'incompatible-equation-dimensions',
    left: 'amount',
    right: 'amountPerItem',
  });
});

test('accepts count times power-per-item as power', () => {
  const problem = {
    ...totalFromPartsProblem,
    quantities: totalFromPartsProblem.quantities.map((quantity) => {
      switch (quantity.id) {
        case 'base':
        case 'total':
          return { ...quantity, dimension: 'amount' as const };
        case 'unitValue':
          return { ...quantity, dimension: 'amountPerItem' as const };
        default:
          return quantity;
      }
    }),
  } satisfies Problem;

  expect(
    validateProblemAst(problem).filter((issue) =>
      issue.kind.includes('dimension'),
    ),
  ).toEqual([]);
});
