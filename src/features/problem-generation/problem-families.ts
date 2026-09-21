import type { AnswerKey, Problem, QuantityRole } from '../problem-model/problem';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
  totalFromPartsGeneratorVersion,
  totalFromPartsHiddenRoles,
  type TotalFromPartsGenerationConfig,
} from './generate-total-from-parts';
import {
  defaultGroupsTotalGenerationConfig,
  generateGroupsTotalCase,
  groupsTotalGeneratorVersion,
  groupsTotalHiddenRoles,
  type GroupsTotalGenerationConfig,
} from './generate-groups-total';
import { maximumGenerationSeed } from './random-source';
import { isHiddenRole, type HiddenRole } from './hidden-role';

export const problemFamilyIds = [
  'total-from-parts',
  'groups-total',
] as const;

export type ProblemFamilyId = (typeof problemFamilyIds)[number];

export function isProblemFamilyId(value: string): value is ProblemFamilyId {
  return (problemFamilyIds as readonly string[]).includes(value);
}

export type GeneratedProblemCase = {
  problem: Problem;
  answerKey: AnswerKey;
  replay: {
    seed: number;
    generatorVersion: string;
    hiddenRole: HiddenRole;
    config: unknown;
  };
};

export type ProblemFamily = {
  id: ProblemFamilyId;
  requiredRoles: readonly QuantityRole[];
  hiddenRoles: readonly HiddenRole[];
  generateCase: (options: {
    seed: number;
    hiddenRole?: HiddenRole;
  }) => GeneratedProblemCase;
};

const totalFromPartsFamily: ProblemFamily = {
  id: 'total-from-parts',
  requiredRoles: ['base', 'count', 'per-item', 'total'],
  hiddenRoles: totalFromPartsHiddenRoles,
  generateCase({ seed, hiddenRole }) {
    return generateTotalFromPartsCase({
      seed,
      config: defaultTotalFromPartsGenerationConfig,
      hiddenRole,
    });
  },
};

const groupsTotalFamily: ProblemFamily = {
  id: 'groups-total',
  requiredRoles: ['count', 'per-item', 'total'],
  hiddenRoles: groupsTotalHiddenRoles,
  generateCase({ seed, hiddenRole }) {
    return generateGroupsTotalCase({
      seed,
      config: defaultGroupsTotalGenerationConfig,
      hiddenRole,
    });
  },
};

export const problemFamilies: Readonly<
  Record<ProblemFamilyId, ProblemFamily>
> = {
  'total-from-parts': totalFromPartsFamily,
  'groups-total': groupsTotalFamily,
};

export const defaultProblemFamilyId: ProblemFamilyId = 'total-from-parts';

export function generateFamilyCase(
  familyId: ProblemFamilyId,
  options: { seed: number; hiddenRole?: HiddenRole },
): GeneratedProblemCase {
  if (
    !Number.isSafeInteger(options.seed) ||
    options.seed < 0 ||
    options.seed > maximumGenerationSeed
  ) {
    throw new Error(
      'Generation seed must be a non-negative 32-bit unsigned integer.',
    );
  }
  if (
    options.hiddenRole !== undefined &&
    !isHiddenRole(options.hiddenRole)
  ) {
    throw new Error(
      `Unknown hidden role ${JSON.stringify(options.hiddenRole)}.`,
    );
  }
  const generated = problemFamilies[familyId].generateCase(options);
  assertDeclaredRoles(familyId, generated.problem);
  assertDeclaredHiddenRole(familyId, generated.problem);
  return generated;
}

function assertDeclaredHiddenRole(
  familyId: ProblemFamilyId,
  problem: Problem,
): void {
  const declaredHiddenRoles = problemFamilies[familyId].hiddenRoles;
  const actualHiddenRoles = problem.quantities
    .filter((quantity) => quantity.given.kind === 'hidden')
    .map((quantity) => quantity.role)
    .filter((role): role is QuantityRole => role !== undefined);
  if (
    actualHiddenRoles.length !== 1 ||
    !declaredHiddenRoles.includes(actualHiddenRoles[0])
  ) {
    throw new Error(
      `Family ${familyId} supports hidden roles ${JSON.stringify(
        declaredHiddenRoles,
      )} but generated a problem with hidden roles ${JSON.stringify(
        actualHiddenRoles,
      )}.`,
    );
  }
}

function assertDeclaredRoles(
  familyId: ProblemFamilyId,
  problem: Problem,
): void {
  const declaredRoles = problemFamilies[familyId].requiredRoles;
  const actualRoles = problem.quantities
    .map((quantity) => quantity.role)
    .filter((role): role is QuantityRole => role !== undefined)
    .sort();
  if (
    actualRoles.length !== declaredRoles.length ||
    actualRoles.some((role, index) => role !== [...declaredRoles].sort()[index])
  ) {
    throw new Error(
      `Family ${familyId} declared roles ${JSON.stringify(declaredRoles)} ` +
        `but generated a problem with roles ${JSON.stringify(actualRoles)}.`,
    );
  }
}

export type { TotalFromPartsGenerationConfig, GroupsTotalGenerationConfig };
