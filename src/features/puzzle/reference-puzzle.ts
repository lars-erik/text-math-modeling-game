import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts';

export const referencePuzzle = {
  learnerNames: {
    base: 'base',
    count: 'count',
    total: 'total',
    unitValue: 'unitValue',
  } as const satisfies LearnerNameMap,
  problem: totalFromPartsProblem,
};
