import { expect, test } from 'vitest';

import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { verifyApproval } from '../../testing/approvals';
import { printScreen } from './print-screen';
import { startPuzzle } from './start-puzzle';

test('starts the fixed quantities-to-equation puzzle', () => {
  const screen = startPuzzle(totalFromPartsProblem);

  expect(screen.source.quantities).toContainEqual({
    given: { kind: 'hidden' },
    id: 'unitValue',
    role: 'per-item',
  });
  expect(JSON.stringify(screen)).not.toContain('45');

  verifyApproval(import.meta.url, 'start-puzzle', printScreen(screen));
});
