import {
  groupsTotal,
  groupsTotalGuidance,
} from '../problem-model/groups-total';
import type { AnswerKey, ConceptId, Problem } from '../problem-model/problem';
import {
  createMulberry32Random,
  maximumGenerationSeed,
  nextInteger,
  validatePositiveIntegerRange,
  validateSeed,
  type PositiveIntegerRange,
  type RandomSource,
} from './random-source';

export const groupsTotalGeneratorVersion = 'groups-total-v1';
export { maximumGenerationSeed };

export type GroupsTotalGenerationConfig = {
  count: PositiveIntegerRange;
  unitValue: PositiveIntegerRange;
  concepts: readonly ConceptId[];
};

export const defaultGroupsTotalConcepts = [
  'arithmetic.multiplication',
  'algebra.variable',
  'algebra.equation',
  'linear.one-unknown',
] as const satisfies readonly ConceptId[];

export const defaultGroupsTotalGenerationConfig = {
  count: { min: 2, max: 12 },
  unitValue: { min: 3, max: 25 },
  concepts: defaultGroupsTotalConcepts,
} as const satisfies GroupsTotalGenerationConfig;

export type GeneratedGroupsTotalCase = {
  problem: Problem;
  answerKey: AnswerKey;
  replay: {
    seed: number;
    generatorVersion: string;
    config: GroupsTotalGenerationConfig;
  };
};

const unsafeTotalError =
  'Generation config must guarantee a positive safe integer result.';

export function generateGroupsTotalCase({
  seed,
  config,
  randomSource,
}: {
  seed: number;
  config: GroupsTotalGenerationConfig;
  randomSource?: RandomSource;
}): GeneratedGroupsTotalCase {
  validateGenerationRequest(seed, config);
  const resolvedRandomSource =
    randomSource ?? createMulberry32Random(seed);

  const count = nextInteger(resolvedRandomSource, config.count);
  const unitValue = nextInteger(resolvedRandomSource, config.unitValue);
  const total = count * unitValue;

  return {
    problem: {
      id: `groups-total-seed-${seed}`,
      concepts: config.concepts,
      quantities: [
        {
          id: 'count',
          dimension: 'item',
          role: 'count',
          given: { kind: 'known', value: count },
        },
        {
          id: 'unitValue',
          dimension: 'amountPerItem',
          role: 'per-item',
          given: { kind: 'hidden' },
        },
        {
          id: 'total',
          dimension: 'amount',
          role: 'total',
          given: { kind: 'known', value: total },
        },
      ],
      relation: groupsTotal,
      guidance: groupsTotalGuidance,
      replay: {
        seed,
        generatorVersion: groupsTotalGeneratorVersion,
      },
    },
    answerKey: {
      bindings: {
        count,
        unitValue,
        total,
      },
    },
    replay: {
      seed,
      generatorVersion: groupsTotalGeneratorVersion,
      config: cloneConfig(config),
    },
  };
}

function validateGenerationRequest(
  seed: number,
  config: GroupsTotalGenerationConfig,
): void {
  validateSeed(seed);

  for (const range of [config.count, config.unitValue]) {
    validatePositiveIntegerRange(range);
  }

  const supportedConcepts = new Set<ConceptId>(defaultGroupsTotalConcepts);
  const unsupportedConcepts = config.concepts.filter(
    (concept) => !supportedConcepts.has(concept),
  );
  if (unsupportedConcepts.length > 0) {
    throw new Error(
      `Groups-total generation does not represent requested concepts: ${unsupportedConcepts.join(', ')}.`,
    );
  }

  const maxTotal = config.count.max * config.unitValue.max;
  if (!Number.isSafeInteger(maxTotal)) {
    throw new Error(unsafeTotalError);
  }
}

function cloneConfig(
  config: GroupsTotalGenerationConfig,
): GroupsTotalGenerationConfig {
  return {
    count: { ...config.count },
    unitValue: { ...config.unitValue },
    concepts: [...config.concepts],
  };
}
