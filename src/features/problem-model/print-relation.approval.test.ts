import { test } from 'vitest';

import { verifyApproval } from '../../testing/approvals';
import { printRelation } from './print-relation';
import { totalFromParts } from './total-from-parts.fixture';

test('prints the initial relation tree', () => {
  verifyApproval(import.meta.url, 'print-relation', printRelation(totalFromParts));
});
