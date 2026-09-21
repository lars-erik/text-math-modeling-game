import {
  totalFromParts,
  totalFromPartsGuidance,
} from '../problem-model/total-from-parts';
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
import { resolveHiddenRole, type HiddenRole } from './hidden-role';

export const totalFromPartsGeneratorVersion = 'total-from-parts-v1';
export const maximumTotalFromPartsSeed = maximumGenerationSeed;
export { createMulberry32Random };
export type { RandomSource, PositiveIntegerRange };

export const totalFromPartsHiddenRoles = [
  'per-item',
  'base',
  'count',
  'total',
] as const satisfies readonly HiddenRole[];

export type TotalFromPartsGenerationConfig = {
  base: PositiveIntegerRange;
  count: PositiveIntegerRange;
  unitValue: PositiveIntegerRange;
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
  concepts: defaultTotalFromPartsConcepts,
} as const satisfies TotalFromPartsGenerationConfig;

export type GeneratedProblemCase = {
  problem: Problem;
  answerKey: AnswerKey;
  replay: {
    seed: number;
    generatorVersion: string;
    hiddenRole: HiddenRole;
    config: TotalFromPartsGenerationConfig;
  };
};

const unsafeTotalError =
  'Generation config must guarantee a positive safe integer result.';

const quantityDeclarations = [
  {
    id: 'base',
    dimension: 'amount',
    role: 'base',
  },
  {
    id: 'count',
    dimension: 'item',
    role: 'count',
  },
  {
    id: 'unitValue',
    dimension: 'amountPerItem',
    role: 'per-item',
  },
  {
    id: 'total',
    dimension: 'amount',
    role: 'total',
  },
] as const;

export function generateTotalFromPartsCase({
  seed,
  config,
  hiddenRole,
  randomSource,
}: {
  seed: number;
  config: TotalFromPartsGenerationConfig;
  hiddenRole?: HiddenRole;
  randomSource?: RandomSource;
}): GeneratedProblemCase {
  validateGenerationRequest(seed, config);
  const resolvedHiddenRole = resolveHiddenRole(
    hiddenRole,
    totalFromPartsHiddenRoles,
  );
  const resolvedRandomSource =
    randomSource ?? createMulberry32Random(seed);
  const base = nextInteger(resolvedRandomSource, config.base);
  const count = nextInteger(resolvedRandomSource, config.count);
  const unitValue = nextInteger(resolvedRandomSource, config.unitValue);
  const total = base + count * unitValue;
  const values = { base, count, unitValue, total };
  return {
    problem: {
      id: `total-from-parts-seed-${seed}`,
      concepts: config.concepts,
      quantities: quantityDeclarations.map((declaration) => ({
        id: declaration.id,
        dimension: declaration.dimension,
        role: declaration.role,
        given:
          declaration.role === resolvedHiddenRole
            ? { kind: 'hidden' as const }
            : { kind: 'known' as const, value: values[declaration.id] },
      })),
      relation: totalFromParts,
      guidance: totalFromPartsGuidance,
      replay: {
        seed,
        generatorVersion: totalFromPartsGeneratorVersion,
        hiddenRole: resolvedHiddenRole,
      },
    },
    answerKey: {
      bindings: values,
    },
    replay: {
      seed,
      generatorVersion: totalFromPartsGeneratorVersion,
      hiddenRole: resolvedHiddenRole,
      config: cloneConfig(config),
    },
  };
}

function validateGenerationRequest(
  seed: number,
  config: TotalFromPartsGenerationConfig,
): void {
  validateSeed(seed);

  for (const range of [config.base, config.count, config.unitValue]) {
    validatePositiveIntegerRange(range);
  }

  const supportedConcepts = new Set<ConceptId>(defaultTotalFromPartsConcepts);
  const unsupportedConcepts = config.concepts.filter(
    (concept) => !supportedConcepts.has(concept),
  );
  if (unsupportedConcepts.length > 0) {
    throw new Error(
      `Total-from-parts generation does not represent requested concepts: ${unsupportedConcepts.join(', ')}.`,
    );
  }

  const maxTotal =
    config.base.max + config.count.max * config.unitValue.max;
  if (!Number.isSafeInteger(maxTotal)) {
    throw new Error(unsafeTotalError);
  }
}

function cloneConfig(
  config: TotalFromPartsGenerationConfig,
): TotalFromPartsGenerationConfig {
  return {
    base: { ...config.base },
    count: { ...config.count },
    unitValue: { ...config.unitValue },
    concepts: [...config.concepts],
  };
}
