import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts';
import {
  createPuzzle,
  type ModelingCase,
} from './puzzle-definition';

export const referenceModelingCase = {
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
} as const satisfies ModelingCase;

export const referencePuzzle = createPuzzle(
  referenceModelingCase,
  'quantities-to-named-equation',
);
