import { test } from 'vitest';

import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { verifyApproval } from '../../testing/approvals';
import type { TextEquationAnswer } from './learner-answer';
import { printScreen } from './print-screen';
import { startPuzzle } from './start-puzzle';
import { submitPuzzle } from './submit-puzzle';

const learnerNames = {
  base: 'base',
  count: 'count',
  total: 'total',
  unitValue: 'unitValue',
} as const satisfies LearnerNameMap;

const textAnswer = (input: string): TextEquationAnswer => ({
  kind: 'text',
  input,
});

test('prints representative typed-submission outcomes', () => {
  const screens = [
    startPuzzle(totalFromPartsProblem),
    submitPuzzle(
      totalFromPartsProblem,
      textAnswer('total = unitValue * count + base'),
      learnerNames,
    ),
    submitPuzzle(
      totalFromPartsProblem,
      textAnswer('total = count * (base + unitValue)'),
      learnerNames,
    ),
    submitPuzzle(
      totalFromPartsProblem,
      textAnswer('total = base + * count'),
      learnerNames,
    ),
    submitPuzzle(
      totalFromPartsProblem,
      textAnswer('total = base + mystery'),
      learnerNames,
    ),
  ];

  verifyApproval(
    import.meta.url,
    'submit-puzzle',
    screens.map(printScreen).join('\n'),
  );
});
