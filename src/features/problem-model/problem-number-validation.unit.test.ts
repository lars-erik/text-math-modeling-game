import { describe, expect, test } from 'vitest';

import {
  type AnswerKey,
  type Problem,
} from './problem';
import {
  validateProblemAst,
  validateProblemConstraints,
} from './problem-validation';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from './total-from-parts.fixture';

describe('Phase 1 numeric range validation', () => {
  test('accepts the canonical safe-integer problem and answer key', () => {
    expect(validateProblemAst(totalFromPartsProblem)).toEqual([]);
    expect(
      validateProblemConstraints(totalFromPartsProblem, totalFromPartsAnswerKey, [
        'safe-answer-values',
      ]),
    ).toEqual([]);
  });

  test('reports a fractional known value', () => {
    const problem = {
      ...totalFromPartsProblem,
      quantities: totalFromPartsProblem.quantities.map((quantity) =>
        quantity.id === 'base'
          ? { ...quantity, given: { kind: 'known' as const, value: 30.5 } }
          : quantity,
      ),
    } satisfies Problem;

    expect(validateProblemAst(problem)).toContainEqual(
      { kind: 'unsafe-known-value', id: 'base', value: 30.5 },
    );
  });

  test('reports an answer binding outside the safe-integer range', () => {
    const unsafeValue = Number.MAX_SAFE_INTEGER + 1;
    const answerKey = {
      bindings: {
        ...totalFromPartsAnswerKey.bindings,
        unitValue: unsafeValue,
      },
    } satisfies AnswerKey;

    expect(
      validateProblemConstraints(totalFromPartsProblem, answerKey, [
        'safe-answer-values',
      ]),
    ).toContainEqual(
      {
        kind: 'unsafe-answer-value',
        id: 'unitValue',
        value: unsafeValue,
      },
    );
  });

  test('reports a non-finite AST literal', () => {
    const problem = {
      ...totalFromPartsProblem,
      relation: {
        kind: 'equation',
        left: { kind: 'literal', value: Number.POSITIVE_INFINITY },
        right: { kind: 'literal', value: 0 },
      },
    } satisfies Problem;

    expect(validateProblemAst(problem)).toContainEqual(
      { kind: 'unsafe-literal', value: Number.POSITIVE_INFINITY },
    );
  });
});
