import type { AnswerKey, Problem } from './problem';
import {
  totalFromParts,
  totalFromPartsProblem,
} from './total-from-parts';

export { totalFromParts, totalFromPartsProblem };

export const totalFromPartsAnswerKey = {
  bindings: {
    base: 30,
    count: 4,
    total: 210,
    unitValue: 45,
  },
} satisfies AnswerKey;

export const totalFromPartsProblemSeed1 = {
  id: 'total-from-parts-seed-1',
  concepts: [
    'arithmetic.addition',
    'arithmetic.multiplication',
    'algebra.variable',
    'linear.one-unknown',
  ],
  quantities: [
    {
      dimension: 'scalar',
      given: { kind: 'known', value: 18 },
      id: 'base',
      role: 'base',
    },
    {
      dimension: 'item',
      given: { kind: 'known', value: 6 },
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
      given: { kind: 'known', value: 60 },
      id: 'total',
      role: 'total',
    },
  ],
  relation: totalFromParts,
  scenarioId: 'gaming.drone-power',
  academicSymbols: { unitValue: 'p' },
  replay: {
    seed: 1,
    generatorVersion: 'hand-built-v1',
  },
} satisfies Problem;

export const totalFromPartsAnswerKeySeed1 = {
  bindings: {
    base: 18,
    count: 6,
    total: 60,
    unitValue: 7,
  },
} satisfies AnswerKey;
