import { expect, test } from 'vitest';

import { verifyApproval } from '../../testing/approvals';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from './total-from-parts.fixture';
import { printProblemDebug } from './print-problem-debug';

test('prints deterministic problem debug output with optional private answer details', () => {
  const learnerVisible = printProblemDebug(totalFromPartsProblem);
  const privileged = printProblemDebug(totalFromPartsProblem, {
    answerKey: totalFromPartsAnswerKey,
  });

  expect(learnerVisible).toContain('answer-key none');
  expect(learnerVisible).not.toContain('unitValue = 45');
  expect(privileged).toContain('answer-key');
  expect(privileged).toContain('  unitValue = 45');

  verifyApproval(
    import.meta.url,
    'print-problem-debug',
    `${learnerVisible}\n${privileged}`,
  );
});
