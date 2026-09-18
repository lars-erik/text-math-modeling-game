import { expect, test } from 'vitest';

import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { printScreen } from './print-screen';
import { submitPuzzle } from './submit-puzzle';

const learnerNames = {
  base: 'base',
  count: 'count',
  total: 'total',
  unitValue: 'unitValue',
} as const satisfies LearnerNameMap;

test('prints the normalized structural-check policy for a typed submission', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    'total = unitValue * count + base',
    learnerNames,
  );

  expect(printScreen(screen)).toContain(
    'check normalized-structure equation-sides=ordered',
  );
});

test('prints structured source-position details for a syntax diagnostic', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    'total = base + * count',
    learnerNames,
  );

  expect(printScreen(screen)).toContain(
    'diagnostic range=1:16-1:16 offsets=15-15 expected="an identifier, an integer, or \\"(\\""',
  );
});
