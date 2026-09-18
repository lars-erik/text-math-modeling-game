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
      dimension: 'scalar',
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
      dimension: 'scalar',
      given: { kind: 'hidden' },
      id: 'unitValue',
      role: 'per-item',
    },
    {
      dimension: 'scalar',
      given: { kind: 'known', value: 210 },
      id: 'total',
      role: 'total',
    },
  ],
  relation: totalFromParts,
  scenarioId: 'gaming.drone-power',
  academicSymbols: { unitValue: 'p' },
  replay: {
    seed: 0,
    generatorVersion: 'hand-built-v1',
  },
} satisfies Problem;
