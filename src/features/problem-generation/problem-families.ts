import type { AnswerKey, Problem, QuantityRole } from '../problem-model/problem';
import type { ModeId } from '../puzzle/modes';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
  totalFromPartsGeneratorVersion,
  type TotalFromPartsGenerationConfig,
} from './generate-total-from-parts';
import {
  defaultGroupsTotalGenerationConfig,
  generateGroupsTotalCase,
  groupsTotalGeneratorVersion,
  type GroupsTotalGenerationConfig,
} from './generate-groups-total';
import { maximumGenerationSeed } from './random-source';

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
  replay: { seed: number; generatorVersion: string; config: unknown };
};

export type ProblemFamily = {
  id: ProblemFamilyId;
  requiredRoles: readonly QuantityRole[];
  supportedModeIds: readonly ModeId[];
  generateCase: (options: {
    seed: number;
  }) => GeneratedProblemCase;
};

const totalFromPartsFamily: ProblemFamily = {
  id: 'total-from-parts',
  requiredRoles: ['base', 'count', 'per-item', 'total'],
  supportedModeIds: [
    'story-to-quantities',
    'quantities-to-named-equation',
    'named-equation-to-academic-notation',
    'academic-notation-to-named-equation',
  ],
  generateCase({ seed }) {
    return generateTotalFromPartsCase({
      seed,
      config: defaultTotalFromPartsGenerationConfig,
    });
  },
};

const groupsTotalFamily: ProblemFamily = {
  id: 'groups-total',
  requiredRoles: ['count', 'per-item', 'total'],
  supportedModeIds: [
    'story-to-quantities',
    'quantities-to-named-equation',
    'named-equation-to-academic-notation',
    'academic-notation-to-named-equation',
  ],
  generateCase({ seed }) {
    return generateGroupsTotalCase({
      seed,
      config: defaultGroupsTotalGenerationConfig,
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

export function familySupportsMode(
  familyId: ProblemFamilyId,
  modeId: ModeId,
): boolean {
  return problemFamilies[familyId].supportedModeIds.includes(modeId);
}

export function generateFamilyCase(
  familyId: ProblemFamilyId,
  options: { seed: number },
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
  return problemFamilies[familyId].generateCase(options);
}

export type { TotalFromPartsGenerationConfig, GroupsTotalGenerationConfig };
