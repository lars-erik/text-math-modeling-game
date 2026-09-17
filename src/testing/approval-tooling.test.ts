import { test } from 'vitest';

import { verifyApproval } from './approvals';

test('writes and verifies a fixed approval', () => {
  verifyApproval(
    import.meta.url,
    'approval-tooling',
    'Approval tooling spike\nfixed text\n',
  );
});
