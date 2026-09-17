import type { Relation } from './expression';
import type { AnswerKey, Problem } from './problem';

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
  quantities: [
    {
      given: { kind: 'known', value: 30 },
      id: 'base',
      role: 'base',
    },
    {
      given: { kind: 'known', value: 4 },
      id: 'count',
      role: 'count',
    },
    {
      given: { kind: 'hidden' },
      id: 'unitValue',
      role: 'per-item',
    },
    {
      given: { kind: 'known', value: 210 },
      id: 'total',
      role: 'total',
    },
  ],
  relation: totalFromParts,
  replay: {
    seed: 0,
    generatorVersion: 'hand-built-v1',
  },
} satisfies Problem;

export const totalFromPartsAnswerKey = {
  bindings: {
    base: 30,
    count: 4,
    total: 210,
    unitValue: 45,
  },
} satisfies AnswerKey;

export const totalFromPartsProblemSeed1 = {
  quantities: [
    {
      given: { kind: 'known', value: 18 },
      id: 'base',
      role: 'base',
    },
    {
      given: { kind: 'known', value: 6 },
      id: 'count',
      role: 'count',
    },
    {
      given: { kind: 'hidden' },
      id: 'unitValue',
      role: 'per-item',
    },
    {
      given: { kind: 'known', value: 60 },
      id: 'total',
      role: 'total',
    },
  ],
  relation: totalFromParts,
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
