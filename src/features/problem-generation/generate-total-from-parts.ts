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

export const defaultTotalFromPartsConcepts = [
  'arithmetic.addition',
  'arithmetic.multiplication',
  'algebra.variable',
  'algebra.equation',
  'linear.one-unknown',
] as const satisfies readonly ConceptId[];

export const defaultTotalFromPartsGenerationConfig = {
  base: { min: 10, max: 40 },
  count: { min: 2, max: 8 },
  unitValue: { min: 3, max: 20 },
  scenarioId: 'gaming.drone-power',
  concepts: defaultTotalFromPartsConcepts,
} as const satisfies TotalFromPartsGenerationConfig;

export type GeneratedProblemCase = {
  problem: Problem;
  answerKey: AnswerKey;
  replay: {
    seed: number;
    generatorVersion: string;
    config: TotalFromPartsGenerationConfig;
  };
};

const invalidSeedError = 'Generation seed must be a non-negative safe integer.';
const invalidRangeError = 'Generation config range bounds must be positive safe integers with min <= max.';
const unsafeTotalError =
  'Generation config must guarantee a positive safe integer result.';

export function generateTotalFromPartsCase({
  seed,
  config,
  randomSource,
}: {
  seed: number;
  config: TotalFromPartsGenerationConfig;
  randomSource?: RandomSource;
}): GeneratedProblemCase {
  validateGenerationRequest(seed, config);
  const resolvedRandomSource = randomSource ?? createMulberry32Random(seed);

  const base = nextInteger(resolvedRandomSource, config.base);
  const count = nextInteger(resolvedRandomSource, config.count);
  const unitValue = nextInteger(resolvedRandomSource, config.unitValue);
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
    replay: {
      seed,
      generatorVersion: totalFromPartsGeneratorVersion,
      config: cloneConfig(config),
    },
  };
}

function validateGenerationRequest(
  seed: number,
  config: TotalFromPartsGenerationConfig,
): void {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(invalidSeedError);
  }

  for (const range of [config.base, config.count, config.unitValue]) {
    validatePositiveIntegerRange(range);
  }

  const maxTotal =
    config.base.max + config.count.max * config.unitValue.max;
  if (!Number.isSafeInteger(maxTotal)) {
    throw new Error(unsafeTotalError);
  }
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
  const nextFloat = randomSource.nextFloat();
  if (nextFloat < 0 || nextFloat >= 1 || !Number.isFinite(nextFloat)) {
    throw new Error('Random sources must return values in [0, 1).');
  }

  return Math.floor(nextFloat * (range.max - range.min + 1)) + range.min;
}

function validatePositiveIntegerRange(range: PositiveIntegerRange): void {
  if (
    !Number.isSafeInteger(range.min) ||
    !Number.isSafeInteger(range.max) ||
    range.min <= 0 ||
    range.max <= 0 ||
    range.min > range.max
  ) {
    throw new Error(invalidRangeError);
  }
}

function cloneConfig(
  config: TotalFromPartsGenerationConfig,
): TotalFromPartsGenerationConfig {
  return {
    base: { ...config.base },
    count: { ...config.count },
    unitValue: { ...config.unitValue },
    scenarioId: config.scenarioId,
    concepts: [...config.concepts],
  };
}
