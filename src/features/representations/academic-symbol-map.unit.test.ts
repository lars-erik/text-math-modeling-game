import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import {
  createAcademicSymbolMap,
  validateAcademicSymbolMap,
} from './academic-symbol-map';

test('creates deterministic Theme-independent symbols for the canonical quantity roles', () => {
  expect(createAcademicSymbolMap(totalFromPartsProblem)).toEqual({
    base: 'b',
    count: 'n',
    unitValue: 'p',
    total: 'T',
  });
});

test('rejects duplicate academic identifiers deterministically', () => {
  expect(() =>
    validateAcademicSymbolMap(totalFromPartsProblem, {
      base: 'b',
      count: 'n',
      unitValue: 'p',
      total: 'p',
    }),
  ).toThrowError('Academic symbol "p" is ambiguous for unitValue and total.');
});
