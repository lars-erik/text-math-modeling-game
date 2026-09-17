import { test } from 'vitest';

import { printRelation } from '../../domain/print-relation';
import { totalFromParts } from '../fixtures/total-from-parts';
import { verifyApproval } from '../support/approvals';

test('prints the initial relation tree', () => {
  verifyApproval('initial-relation-tree', printRelation(totalFromParts));
});
