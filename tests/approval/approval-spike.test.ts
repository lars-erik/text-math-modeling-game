import { test } from 'vitest';

import { verifyApproval } from '../support/approvals';

test('writes and verifies a fixed approval', () => {
  verifyApproval('fixed-text', 'Approval tooling spike\nfixed text\n');
});
