import { totalFromParts } from '../problem-model/total-from-parts';
import type { AnswerKey, ConceptId, Problem, ScenarioId } from '../problem-model/problem';

export const totalFromPartsGeneratorVersion = 'total-from-parts-v1';

export type RandomSource = {
  nextFloat(): number;
};

export type PositiveIntegerRange = {
  min: number;
  max: number;
};

export type TotalFromPartsGenerationConfig = {
  base: PositiveIntegerRange;
  count: PositiveIntegerRange;
  unitValue: PositiveIntegerRange;
  scenarioId: ScenarioId;
  concepts: readonly ConceptId[];
};

export type GeneratedProblemCase = {
  problem: Problem;
  answerKey: AnswerKey;
};

export function generateTotalFromPartsCase({
  seed,
  config,
  randomSource = createMulberry32Random(seed),
}: {
  seed: number;
  config: TotalFromPartsGenerationConfig;
  randomSource?: RandomSource;
}): GeneratedProblemCase {
  const base = nextInteger(randomSource, config.base);
  const count = nextInteger(randomSource, config.count);
  const unitValue = nextInteger(randomSource, config.unitValue);
  const total = base + count * unitValue;

  return {
    problem: {
      id: `total-from-parts-seed-${seed}`,
      concepts: config.concepts,
      quantities: [
        {
          id: 'base',
          dimension: 'scalar',
          role: 'base',
          given: { kind: 'known', value: base },
        },
        {
          id: 'count',
          dimension: 'item',
          role: 'count',
          given: { kind: 'known', value: count },
        },
        {
          id: 'unitValue',
          dimension: 'scalar',
          role: 'per-item',
          given: { kind: 'hidden' },
        },
        {
          id: 'total',
          dimension: 'scalar',
          role: 'total',
          given: { kind: 'known', value: total },
        },
      ],
      relation: totalFromParts,
      scenarioId: config.scenarioId,
      academicSymbols: { unitValue: 'p' },
      replay: {
        seed,
        generatorVersion: totalFromPartsGeneratorVersion,
      },
    },
    answerKey: {
      bindings: {
        base,
        count,
        unitValue,
        total,
      },
    },
  };
}

function createMulberry32Random(seed: number): RandomSource {
  let state = seed >>> 0;

  return {
    nextFloat() {
      state += 0x6d2b79f5;
      let next = state;
      next = Math.imul(next ^ (next >>> 15), next | 1);
      next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
      return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    },
  };
}

function nextInteger(
  randomSource: RandomSource,
  range: PositiveIntegerRange,
): number {
  return Math.floor(randomSource.nextFloat() * (range.max - range.min + 1)) + range.min;
}
