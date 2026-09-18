import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts';
import type { PuzzleDefinition } from './puzzle-definition';

export const referencePuzzle = {
  choices: [
    {
      id: 'matching',
      label: 'total = base + count * unitValue',
      relation: totalFromPartsProblem.relation,
    },
    {
      id: 'base-per-item',
      label: 'total = count * (base + unitValue)',
      relation: {
        kind: 'equation',
        left: { kind: 'quantity', id: 'total' },
        right: {
          kind: 'multiply',
          left: { kind: 'quantity', id: 'count' },
          right: {
            kind: 'add',
            left: { kind: 'quantity', id: 'base' },
            right: { kind: 'quantity', id: 'unitValue' },
          },
        },
      },
    },
  ],
  learnerNames: {
    base: 'base',
    count: 'count',
    total: 'total',
    unitValue: 'unitValue',
  } as const satisfies LearnerNameMap,
  problem: totalFromPartsProblem,
} as const satisfies PuzzleDefinition;
