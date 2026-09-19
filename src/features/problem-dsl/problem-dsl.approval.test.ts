import { expect, test } from 'vitest';

import { verifyApproval } from '../../testing/approvals';
import { parseProblem } from './parse-problem';
import { referenceProblemDsl } from './reference-problem.fixture';
import { serializeProblem } from './serialize-problem';

test('prints canonical problem DSL from the parsed reference problem', () => {
  const parsed = parseProblem(referenceProblemDsl);
  expect(parsed.kind).toBe('success');
  if (parsed.kind !== 'success') {
    throw new Error(`Expected parse success, received ${parsed.kind}`);
  }

  expect(parsed.problem.quantities).toContainEqual({
    id: 'unitValue',
    dimension: 'amountPerItem',
    given: { kind: 'hidden' },
  });
  expect(parsed.problem.relation.right).toEqual({
    kind: 'add',
    left: { kind: 'quantity', id: 'base' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  });

  verifyApproval(
    import.meta.url,
    'problem-dsl',
    serializeProblem(parsed.problem),
  );
});
