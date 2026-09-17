import type { Relation } from '../problem-model/expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts';

export type NamedEquationChoice = {
  id: string;
  label: string;
  relation: Relation;
};

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
  ] satisfies readonly NamedEquationChoice[],
  problem: totalFromPartsProblem,
};
