import { describe, expect, test } from 'vitest';

import {
  validateProblemNumbers,
  type AnswerKey,
  type Problem,
} from '../../domain/problem';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from '../fixtures/total-from-parts';

describe('Phase 1 numeric range validation', () => {
  test('accepts the canonical safe-integer problem and answer key', () => {
    expect(
      validateProblemNumbers(
        totalFromPartsProblem,
        totalFromPartsAnswerKey,
      ),
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

    expect(validateProblemNumbers(problem, totalFromPartsAnswerKey)).toContainEqual(
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

    expect(validateProblemNumbers(totalFromPartsProblem, answerKey)).toContainEqual(
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

    expect(validateProblemNumbers(problem, totalFromPartsAnswerKey)).toContainEqual(
      { kind: 'unsafe-literal', value: Number.POSITIVE_INFINITY },
    );
  });
});
