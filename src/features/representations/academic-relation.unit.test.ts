import { expect, test } from 'vitest';
import type { Relation } from '../problem-model/expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { createAcademicSymbolMap } from './academic-symbol-map';
import {
  formatAcademicInput,
  renderToString,
} from './academic-relation';
import { substituteVisibleValues } from './substitute-visible-values';

test('formats the substituted relation for parseable input and renderer-independent display', () => {
  const relation = substituteVisibleValues(totalFromPartsProblem);
  const symbols = createAcademicSymbolMap(totalFromPartsProblem);

  expect(formatAcademicInput(relation, symbols)).toBe('210 = 30 + 4*p');
  expect(renderToString(relation, symbols)).toBe('210 = 30 + 4p');
});

test('preserves grouping while omitting unnecessary precedence parentheses', () => {
  const symbols = { a: 'a', b: 'b', c: 'c' };
  const grouped: Relation = {
    kind: 'equation',
    left: { kind: 'literal', value: 1 },
    right: {
      kind: 'multiply',
      left: {
        kind: 'add',
        left: { kind: 'quantity', id: 'a' },
        right: { kind: 'quantity', id: 'b' },
      },
      right: { kind: 'quantity', id: 'c' },
    },
  };
  const precedenceOnly: Relation = {
    kind: 'equation',
    left: { kind: 'literal', value: 1 },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'a' },
      right: {
        kind: 'multiply',
        left: { kind: 'quantity', id: 'b' },
        right: { kind: 'quantity', id: 'c' },
      },
    },
  };

  expect(formatAcademicInput(grouped, symbols)).toBe('1 = (a + b)*c');
  expect(formatAcademicInput(precedenceOnly, symbols)).toBe('1 = a + b*c');
});
