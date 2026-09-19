import fc from 'fast-check';
import { expect, test } from 'vitest';

import { parseProblem } from '../problem-dsl/parse-problem';
import { serializeProblem } from '../problem-dsl/serialize-problem';
import { validateProblemAst, validateProblemConstraints } from '../problem-model/problem-validation';
import { generateTotalFromPartsCase } from './generate-total-from-parts';

const generationConfig = {
  base: { min: 10, max: 40 },
  count: { min: 2, max: 8 },
  unitValue: { min: 3, max: 20 },
  concepts: [
    'arithmetic.addition',
    'arithmetic.multiplication',
    'algebra.variable',
    'algebra.equation',
    'linear.one-unknown',
  ],
} as const;

const generationSeedArbitrary = fc.integer({ min: 0, max: 1_000_000 });

test('generated cases satisfy the Phase 1 invariants across seeds', () => {
  fc.assert(
    fc.property(generationSeedArbitrary, fc.context(), (seed, context) => {
      const generated = generateTotalFromPartsCase({
        seed,
        config: generationConfig,
      });

      context.log(`fast-check appSeed=${seed}`);
      context.log(
        `fast-check replay=${JSON.stringify(generated.replay)}`,
      );

      expect(validateProblemAst(generated.problem)).toEqual([]);
      expect(
        validateProblemConstraints(generated.problem, generated.answerKey, [
          'relation-satisfaction',
          'known-answer-consistency',
          'safe-answer-values',
        ]),
      ).toEqual([]);

      const hiddenQuantities = generated.problem.quantities.filter(
        (quantity) => quantity.given.kind === 'hidden',
      );

      expect(hiddenQuantities).toHaveLength(1);
      expect(hiddenQuantities[0]?.id).toBe('unitValue');
      expect(generated.answerKey.bindings.unitValue).toBeGreaterThanOrEqual(
        generationConfig.unitValue.min,
      );
      expect(generated.answerKey.bindings.unitValue).toBeLessThanOrEqual(
        generationConfig.unitValue.max,
      );
      expect(generated.problem.concepts).toEqual(generationConfig.concepts);
    }),
    { numRuns: 100 },
  );
});

test('generated cases round-trip through canonical DSL serialization', () => {
  fc.assert(
    fc.property(generationSeedArbitrary, fc.context(), (seed, context) => {
      const generated = generateTotalFromPartsCase({
        seed,
        config: generationConfig,
      });
      const dsl = serializeProblem(generated.problem);

      context.log(`fast-check appSeed=${seed}`);
      context.log(`fast-check replay=${JSON.stringify(generated.replay)}`);
      context.log(`fast-check dsl=${JSON.stringify(dsl)}`);

      const parsed = parseProblem(dsl);
      expect(parsed.kind).toBe('success');
      if (parsed.kind !== 'success') {
        throw new Error(`Expected parse success, received ${parsed.kind}`);
      }

      expect(parsed.problem).toEqual(generated.problem);
    }),
    { numRuns: 100 },
  );
});

test('different seeds produce meaningful variation across a sample', () => {
  const generatedCases = Array.from({ length: 20 }, (_, seed) =>
    serializeProblem(
      generateTotalFromPartsCase({
        seed,
        config: generationConfig,
      }).problem,
    ),
  );

  expect(new Set(generatedCases).size).toBeGreaterThanOrEqual(5);
});
