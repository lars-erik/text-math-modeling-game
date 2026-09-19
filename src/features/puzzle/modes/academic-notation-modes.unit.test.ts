import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { substituteVisibleValues } from '../../representations/substitute-visible-values';
import { createAcademicSymbolMap } from '../../representations/academic-symbol-map';
import { namedEquationToAcademicNotationMode } from './named-equation-to-academic-notation';
import { academicNotationToNamedEquationMode } from './academic-notation-to-named-equation';

test('named equation to academic notation starts from the canonical substituted relation', () => {
  expect(
    namedEquationToAcademicNotationMode.start({
      problem: totalFromPartsProblem,
      locale: 'en',
    }).state,
  ).toEqual({
    modeId: 'named-equation-to-academic-notation',
    source: {
      kind: 'named-equation',
      relation: substituteVisibleValues(totalFromPartsProblem),
    },
    target: {
      kind: 'academic-notation',
      prompt: 'Write the relationship using the academic symbols.',
      symbols: createAcademicSymbolMap(totalFromPartsProblem),
    },
    input: { kind: 'expression', value: '' },
  });
});

test('both academic representation directions check parsed canonical relations', () => {
  const forward = namedEquationToAcademicNotationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: {},
    answer: { kind: 'text', input: '210 = 30 + 4*p' },
  });
  expect(forward.feedback?.kind).toBe('accepted');
  expect(forward.submission).toMatchObject({
    kind: 'academic-notation',
    relation: substituteVisibleValues(totalFromPartsProblem),
  });

  const reverse = academicNotationToNamedEquationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: {
      totalPower: 'total',
      basePower: 'base',
      droneCount: 'count',
      dronePower: 'unitValue',
    },
    answer: {
      kind: 'text',
      input: 'totalPower = basePower + droneCount * dronePower',
    },
  });
  expect(reverse.feedback?.kind).toBe('accepted');
  expect(reverse.submission).toMatchObject({
    kind: 'named-equation',
    relation: totalFromPartsProblem.relation,
  });
});
