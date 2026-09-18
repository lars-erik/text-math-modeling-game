import { expect, test } from 'vitest';

import type { LearnerNameMap } from '../named-expression';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import type { TextEquationAnswer } from './learner-answer';
import { submitPuzzle } from './submit-puzzle';

const learnerNames = {
  base: 'base',
  count: 'count',
  total: 'total',
  unitValue: 'unitValue',
} as const satisfies LearnerNameMap;

const textAnswer = (input: string): TextEquationAnswer => ({
  kind: 'text',
  input,
});

test('accepts a typed named equation after parsing it', () => {
  const input = 'total = base + count * unitValue';
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer(input),
    learnerNames,
  );

  expect(screen.input.value).toBe(input);
  expect(screen.feedback?.kind).toBe('accepted');
});

test('accepts a structured relation selected by an input provider', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    {
      kind: 'relation-choice',
      choiceId: 'matching',
      label: 'total = base + count * unitValue',
      relation: totalFromPartsProblem.relation,
    },
    learnerNames,
  );

  expect(screen.input.value).toBe('total = base + count * unitValue');
  expect(screen.submission).toMatchObject({
    answerKind: 'relation-choice',
    choiceId: 'matching',
  });
  expect(screen.feedback?.kind).toBe('accepted');
});

test('accepts commutative reordering under normalized structural checking', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer('total = unitValue * count + base'),
    learnerNames,
  );

  expect(screen.feedback?.kind).toBe('accepted');
});

test('preserves a differently grouped equation as a structural mismatch', () => {
  const input = 'total = count * (base + unitValue)';
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer(input),
    learnerNames,
  );

  expect(screen.input.value).toBe(input);
  expect(screen.feedback).toEqual({
    kind: 'structural-mismatch',
    checkPolicy: 'normalized-structure',
    equationSides: 'ordered',
    message: 'The equation grouping does not match the quantity model.',
  });
});

test('rejects reversed equation sides with side-order feedback', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer('base + count * unitValue = total'),
    learnerNames,
  );

  expect(screen.feedback).toEqual({
    kind: 'structural-mismatch',
    checkPolicy: 'normalized-structure',
    equationSides: 'ordered',
    message: 'The equation sides are reversed; keep them in the requested order.',
  });
});

test('returns a structured syntax error and preserves the learner input', () => {
  const input = 'total = base + * count';
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer(input),
    learnerNames,
  );

  expect(screen.input.value).toBe(input);
  expect(screen.submission).toEqual({
    kind: 'named-equation',
    answerKind: 'text',
    input,
  });
  expect(screen.feedback).toEqual({
    kind: 'syntax-error',
    expected: 'an identifier, an integer, or "("',
    message:
      'Expected an identifier, an integer, or "(" at line 1, column 16.',
    range: {
      start: { offset: 15, line: 1, column: 16 },
      end: { offset: 15, line: 1, column: 16 },
    },
  });
});

test('returns an unknown-identifier diagnostic with the available names', () => {
  const input = 'total = base + mystery';
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer(input),
    learnerNames,
  );

  expect(screen.input.value).toBe(input);
  expect(screen.feedback).toEqual({
    kind: 'unknown-identifier',
    identifier: 'mystery',
    availableIdentifiers: ['base', 'count', 'total', 'unitValue'],
    message:
      'Unknown identifier "mystery". Available identifiers: base, count, total, unitValue.',
    range: {
      start: { offset: 15, line: 1, column: 16 },
      end: { offset: 22, line: 1, column: 23 },
    },
  });
});

test('returns an ambiguous-identifier diagnostic without structural checking', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer('total = rate'),
    {
      rate: ['base', 'unitValue'],
      total: 'total',
    },
  );

  expect(screen.feedback).toMatchObject({
    kind: 'ambiguous-identifier',
    identifier: 'rate',
    candidateIds: ['base', 'unitValue'],
    message: 'Identifier "rate" is ambiguous.',
  });
});

test('returns an invalid-integer diagnostic without structural checking', () => {
  const screen = submitPuzzle(
    totalFromPartsProblem,
    textAnswer('total = 999999999999999999999999999999'),
    learnerNames,
  );

  expect(screen.feedback).toMatchObject({
    kind: 'invalid-integer-literal',
    literal: '999999999999999999999999999999',
    message:
      'Integer literal "999999999999999999999999999999" is outside the safe integer range.',
  });
});
