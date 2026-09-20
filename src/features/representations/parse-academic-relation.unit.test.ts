import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { createAcademicSymbolMap } from './academic-symbol-map';
import { parseAcademicRelation } from './parse-academic-relation';
import { substituteVisibleValues } from './substitute-visible-values';

test('uses the shared expression grammar to parse academic symbols into canonical IDs', () => {
  expect(
    parseAcademicRelation(
      '210 = 30 + 4*p',
      createAcademicSymbolMap(totalFromPartsProblem),
    ),
  ).toEqual({
    kind: 'success',
    relation: substituteVisibleValues(totalFromPartsProblem),
  });
});

test('reports unknown academic symbols with deterministic available identifiers', () => {
  expect(
    parseAcademicRelation(
      '210 = 30 + 4*x',
      createAcademicSymbolMap(totalFromPartsProblem),
    ),
  ).toMatchObject({
    kind: 'unknown-identifier',
    identifier: 'x',
    availableIdentifiers: ['T', 'b', 'n', 'p'],
  });
});

test('parses the academic display juxtaposition without a trailing newline', () => {
  expect(
    parseAcademicRelation(
      '210 = 30 + 4p',
      createAcademicSymbolMap(totalFromPartsProblem),
    ),
  ).toEqual({
    kind: 'success',
    relation: substituteVisibleValues(totalFromPartsProblem),
  });
});


test('academic symbols remain case-sensitive', () => {
  expect(
    parseAcademicRelation(
      't = b + n*p',
      createAcademicSymbolMap(totalFromPartsProblem),
    ),
  ).toMatchObject({
    kind: 'unknown-identifier',
    identifier: 't',
  });
});
