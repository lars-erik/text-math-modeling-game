import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { substituteVisibleValues } from './substitute-visible-values';

test('substitutes every visible given and retains the hidden quantity without mutating the Problem', () => {
  const problemBefore = structuredClone(totalFromPartsProblem);

  expect(substituteVisibleValues(totalFromPartsProblem)).toEqual({
    kind: 'equation',
    left: { kind: 'literal', value: 210 },
    right: {
      kind: 'add',
      left: { kind: 'literal', value: 30 },
      right: {
        kind: 'multiply',
        left: { kind: 'literal', value: 4 },
        right: { kind: 'quantity', id: 'unitValue' },
      },
    },
  });
  expect(totalFromPartsProblem).toEqual(problemBefore);
});
