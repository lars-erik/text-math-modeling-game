import { test } from 'vitest';

import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { verifyApproval } from '../../testing/approvals';
import { printScreen } from './print-screen';
import { startPuzzle } from './start-puzzle';
import { submitPuzzle } from './submit-puzzle';

const learnerNames = {
  base: 'base',
  count: 'count',
  total: 'total',
  unitValue: 'unitValue',
} as const satisfies LearnerNameMap;

test('prints representative typed-submission outcomes', () => {
  const screens = [
    startPuzzle(totalFromPartsProblem),
    submitPuzzle(
      totalFromPartsProblem,
      'total = unitValue * count + base',
      learnerNames,
    ),
    submitPuzzle(
      totalFromPartsProblem,
      'total = count * (base + unitValue)',
      learnerNames,
    ),
    submitPuzzle(
      totalFromPartsProblem,
      'total = base + * count',
      learnerNames,
    ),
    submitPuzzle(
      totalFromPartsProblem,
      'total = base + mystery',
      learnerNames,
    ),
  ];

  verifyApproval(
    import.meta.url,
    'submit-puzzle',
    screens.map(printScreen).join('\n'),
  );
});
