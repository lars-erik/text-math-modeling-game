import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { formatNamedRelation } from './named-relation';
import { substituteVisibleValues } from './substitute-visible-values';

test('renders a substituted relation through an injected Theme name map', () => {
  expect(
    formatNamedRelation(substituteVisibleValues(totalFromPartsProblem), {
      base: 'basePower',
      count: 'droneCount',
      unitValue: 'dronePower',
      total: 'totalPower',
    }),
  ).toBe('210 = 30 + 4 * dronePower');
});
