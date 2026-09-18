import { describe, expect, test } from 'vitest';

import type { Expression, Relation } from './expression';
import {
  namedEquationStructurePolicy,
  normalizeExpression,
  relationsHaveNormalizedStructure,
  type NormalizedStructurePolicy,
} from './normalized-structure';
import { totalFromParts } from './total-from-parts.fixture';

const quantity = (id: string): Expression => ({ kind: 'quantity', id });

describe('normalized expression structure', () => {
  test('normalizes commutative addition and multiplication recursively', () => {
    const expected: Expression = {
      kind: 'add',
      left: quantity('base'),
      right: {
        kind: 'multiply',
        left: quantity('count'),
        right: quantity('unitValue'),
      },
    };
    const reordered: Expression = {
      kind: 'add',
      left: {
        kind: 'multiply',
        left: quantity('unitValue'),
        right: quantity('count'),
      },
      right: quantity('base'),
    };

    expect(normalizeExpression(reordered, namedEquationStructurePolicy)).toEqual(
      normalizeExpression(expected, namedEquationStructurePolicy),
    );
  });

  test('preserves grouping while normalizing operands', () => {
    const expected = totalFromParts.right;
    const baseAppliedPerItem: Expression = {
      kind: 'multiply',
      left: quantity('count'),
      right: {
        kind: 'add',
        left: quantity('base'),
        right: quantity('unitValue'),
      },
    };

    expect(normalizeExpression(baseAppliedPerItem, namedEquationStructurePolicy)).not.toEqual(
      normalizeExpression(expected, namedEquationStructurePolicy),
    );
  });
});

describe('normalized relation structure', () => {
  const swappedSides: Relation = {
    kind: 'equation',
    left: totalFromParts.right,
    right: totalFromParts.left,
  };

  test('keeps equation sides ordered for named modelling puzzles', () => {
    expect(namedEquationStructurePolicy.equationSides).toBe('ordered');
    expect(
      relationsHaveNormalizedStructure(
        totalFromParts,
        swappedSides,
        namedEquationStructurePolicy,
      ),
    ).toBe(false);
  });

  test('can explicitly allow swapped equation sides under a different policy', () => {
    const swappableSidesPolicy: NormalizedStructurePolicy = {
      ...namedEquationStructurePolicy,
      equationSides: 'swappable',
    };

    expect(
      relationsHaveNormalizedStructure(
        totalFromParts,
        swappedSides,
        swappableSidesPolicy,
      ),
    ).toBe(true);
  });

  test('accepts commutative reordering without accepting changed grouping', () => {
    const reordered: Relation = {
      kind: 'equation',
      left: quantity('total'),
      right: {
        kind: 'add',
        left: {
          kind: 'multiply',
          left: quantity('unitValue'),
          right: quantity('count'),
        },
        right: quantity('base'),
      },
    };
    const changedGrouping: Relation = {
      kind: 'equation',
      left: quantity('total'),
      right: {
        kind: 'multiply',
        left: quantity('count'),
        right: {
          kind: 'add',
          left: quantity('base'),
          right: quantity('unitValue'),
        },
      },
    };

    expect(
      relationsHaveNormalizedStructure(
        totalFromParts,
        reordered,
        namedEquationStructurePolicy,
      ),
    ).toBe(true);
    expect(
      relationsHaveNormalizedStructure(
        totalFromParts,
        changedGrouping,
        namedEquationStructurePolicy,
      ),
    ).toBe(false);
  });
});
