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

test('replays the same generated case for the same seed and configuration', () => {
  const first = generateTotalFromPartsCase({
    seed: 99,
    config: generationConfig,
  });
  const second = generateTotalFromPartsCase({
    seed: 99,
    config: generationConfig,
  });

  expect(second).toEqual(first);
});

test('preserves generator replay details outside the canonical problem DSL', () => {
  const generated = generateTotalFromPartsCase({
    seed: 7,
    config: generationConfig,
  });

  expect(generated.replay).toEqual({
    seed: 7,
    generatorVersion: totalFromPartsGeneratorVersion,
    config: generationConfig,
  });
});

test('rejects generation bounds that cannot guarantee safe integers', () => {
  expect(() =>
    generateTotalFromPartsCase({
      seed: 1,
      config: {
        ...generationConfig,
        base: { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
      },
    }),
  ).toThrow('safe integer');
});

test('rejects an unsafe replay seed with a seed-specific error', () => {
  expect(() =>
    generateTotalFromPartsCase({
      seed: Number.MAX_SAFE_INTEGER + 1,
      config: generationConfig,
    }),
  ).toThrow('seed');
});

test('rejects negative seeds so replayed inputs stay exact', () => {
  expect(() =>
    generateTotalFromPartsCase({
      seed: -1,
      config: generationConfig,
    }),
  ).toThrow('non-negative');
});

test('rejects reversed ranges with a range-specific error', () => {
  expect(() =>
    generateTotalFromPartsCase({
      seed: 1,
      config: {
        ...generationConfig,
        count: { min: 8, max: 2 },
      },
    }),
  ).toThrow('range');
});

test('accepts an injected random source for reproducible value selection', () => {
  const nextFloat = [
    0,
    0.5,
    0.999999999,
  ];
  const generated = generateTotalFromPartsCase({
    seed: 123,
    config: generationConfig,
    randomSource: {
      nextFloat: () => nextFloat.shift() ?? 0,
    },
  });

  expect(generated.answerKey.bindings).toEqual({
    base: 10,
    count: 5,
    unitValue: 20,
    total: 110,
  });
});

test('rejects injected random values outside the supported range', () => {
  expect(() =>
    generateTotalFromPartsCase({
      seed: 123,
      config: generationConfig,
      randomSource: {
        nextFloat: () => 1,
      },
    }),
  ).toThrow('[0, 1)');
});
