import { expect, test } from 'vitest';

import { getVisibleBindings } from '../problem-model/problem';
import {
  validateProblemAst,
  validateProblemConstraints,
} from '../problem-model/problem-validation';
import {
  generateTotalFromPartsCase,
  totalFromPartsGeneratorVersion,
} from './generate-total-from-parts';

const generationConfig = {
  base: { min: 10, max: 40 },
  count: { min: 2, max: 8 },
  unitValue: { min: 3, max: 20 },
  scenarioId: 'gaming.drone-power',
  concepts: [
    'arithmetic.addition',
    'arithmetic.multiplication',
    'algebra.variable',
    'algebra.equation',
    'linear.one-unknown',
  ],
} as const;

test('generates a valid learner-visible problem and separate answer key', () => {
  const generated = generateTotalFromPartsCase({
    seed: 1234,
    config: generationConfig,
  });

  expect(generated.problem.replay).toEqual({
    seed: 1234,
    generatorVersion: totalFromPartsGeneratorVersion,
  });
  expect(
    generated.problem.quantities.filter((quantity) => quantity.given.kind === 'hidden'),
  ).toEqual([
    expect.objectContaining({
      id: 'unitValue',
      given: { kind: 'hidden' },
    }),
  ]);
  expect(getVisibleBindings(generated.problem)).not.toHaveProperty('unitValue');
  expect(generated.answerKey.bindings.unitValue).toBeGreaterThanOrEqual(3);
  expect(generated.answerKey.bindings.unitValue).toBeLessThanOrEqual(20);
  expect(validateProblemAst(generated.problem)).toEqual([]);
  expect(
    validateProblemConstraints(generated.problem, generated.answerKey, [
      'relation-satisfaction',
      'known-answer-consistency',
      'safe-answer-values',
    ]),
  ).toEqual([]);
});
