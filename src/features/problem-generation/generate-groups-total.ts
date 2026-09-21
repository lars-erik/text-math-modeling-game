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
import { resolveHiddenRole, type HiddenRole } from './hidden-role';

export const groupsTotalGeneratorVersion = 'groups-total-v1';
export { maximumGenerationSeed };

export const groupsTotalHiddenRoles = [
  'per-item',
  'count',
  'total',
] as const satisfies readonly HiddenRole[];

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
    hiddenRole: HiddenRole;
    config: GroupsTotalGenerationConfig;
  };
};

const unsafeTotalError =
  'Generation config must guarantee a positive safe integer result.';

const quantityDeclarations = [
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

export function generateGroupsTotalCase({
  seed,
  config,
  hiddenRole,
  randomSource,
}: {
  seed: number;
  config: GroupsTotalGenerationConfig;
  hiddenRole?: HiddenRole;
  randomSource?: RandomSource;
}): GeneratedGroupsTotalCase {
  validateGenerationRequest(seed, config);
  const resolvedHiddenRole = resolveHiddenRole(
    hiddenRole,
    groupsTotalHiddenRoles,
  );
  const resolvedRandomSource =
    randomSource ?? createMulberry32Random(seed);
  const count = nextInteger(resolvedRandomSource, config.count);
  const unitValue = nextInteger(resolvedRandomSource, config.unitValue);
  const total = count * unitValue;
  const values = { count, unitValue, total };
  return {
    problem: {
      id: `groups-total-seed-${seed}`,
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
      relation: groupsTotal,
      guidance: groupsTotalGuidance,
      replay: {
        seed,
        generatorVersion: groupsTotalGeneratorVersion,
        hiddenRole: resolvedHiddenRole,
      },
    },
    answerKey: {
      bindings: values,
    },
    replay: {
      seed,
      generatorVersion: groupsTotalGeneratorVersion,
      hiddenRole: resolvedHiddenRole,
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
