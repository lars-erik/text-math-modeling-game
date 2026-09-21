import type { Relation } from './expression';
import type { Problem } from './problem';

export const groupsTotal: Relation = {
  kind: 'equation',
  left: { kind: 'quantity', id: 'total' },
  right: {
    kind: 'multiply',
    left: { kind: 'quantity', id: 'count' },
    right: { kind: 'quantity', id: 'unitValue' },
  },
};

export const groupsTotalGuidance = [
  {
    id: 'per-item-scaled-by-count',
    quantities: { count: 'count', unit: 'unitValue' },
  },
] as const;

export const groupsTotalProblem = {
  id: 'groups-total',
  concepts: [
    'arithmetic.multiplication',
    'algebra.variable',
    'linear.one-unknown',
  ],
  quantities: [
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
      given: { kind: 'known', value: 24 },
      id: 'total',
      role: 'total',
    },
  ],
  relation: groupsTotal,
  guidance: groupsTotalGuidance,
  replay: {
    seed: 0,
    generatorVersion: 'hand-built-v1',
  },
} satisfies Problem;
