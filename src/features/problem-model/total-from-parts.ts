import type { Relation } from './expression';
import type { Problem } from './problem';

export const totalFromParts: Relation = {
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
};

export const totalFromPartsGuidance = [
  {
    id: 'base-applied-once',
    quantities: { quantity: 'base' },
  },
  {
    id: 'per-item-scaled-by-count',
    quantities: { count: 'count', unit: 'unitValue' },
  },
] as const;

export const totalFromPartsProblem = {
  id: 'total-from-parts',
  concepts: [
    'arithmetic.addition',
    'arithmetic.multiplication',
    'algebra.variable',
    'linear.one-unknown',
  ],
  quantities: [
    {
      dimension: 'amount',
      given: { kind: 'known', value: 30 },
      id: 'base',
      role: 'base',
    },
    {
      dimension: 'item',
      given: { kind: 'known', value: 4 },
      id: 'count',
      role: 'count',
    },
    {
      dimension: 'amountPerItem',
      given: { kind: 'hidden' },
      id: 'unitValue',
      role: 'per-item',
    },
    {
      dimension: 'amount',
      given: { kind: 'known', value: 210 },
      id: 'total',
      role: 'total',
    },
  ],
  relation: totalFromParts,
  guidance: totalFromPartsGuidance,
  replay: {
    seed: 0,
    generatorVersion: 'hand-built-v1',
  },
} satisfies Problem;
