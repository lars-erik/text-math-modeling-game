import type { ThemeFact } from '../theme';

export type DronePowerStoryPlan = {
  scenarioId: 'gaming.drone-power';
  seed: number;
  structure: 'base-and-parts' | 'groups-only';
  sentences: readonly {
    fragmentKey:
      | 'baseFact.basicSystems'
      | 'countFact.activeDrones'
      | 'perItemFact.droneDraw'
      | 'totalFact.combinedDraw'
      | 'totalFact.droneDraw';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'ship' | 'drone';
  }[];
  question: {
    fragmentKey:
      | 'question.perDronePower'
      | 'question.basePower'
      | 'question.droneCount'
      | 'question.totalPower'
      | 'question.totalDronePower';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'ship' | 'drone';
  };
};

const statementFragmentsByRole = {
  base: 'baseFact.basicSystems',
  count: 'countFact.activeDrones',
  'per-item': 'perItemFact.droneDraw',
  total: 'totalFact.combinedDraw',
} as const satisfies Record<
  string,
  | 'baseFact.basicSystems'
  | 'countFact.activeDrones'
  | 'perItemFact.droneDraw'
  | 'totalFact.combinedDraw'
>;

const nounsByRole = {
  base: 'ship',
  count: 'drone',
  'per-item': 'drone',
  total: 'drone',
} as const satisfies Record<string, 'ship' | 'drone'>;

const questionFragmentsByRole = {
  'per-item': 'question.perDronePower',
  base: 'question.basePower',
  count: 'question.droneCount',
  total: {
    'base-and-parts': 'question.totalPower',
    'groups-only': 'question.totalDronePower',
  },
} as const satisfies Record<
  string,
  | DronePowerStoryPlan['question']['fragmentKey']
  | {
      'base-and-parts': DronePowerStoryPlan['question']['fragmentKey'];
      'groups-only': DronePowerStoryPlan['question']['fragmentKey'];
    }
>;

export function planDronePowerStory(
  facts: readonly ThemeFact[],
  seed: number,
): DronePowerStoryPlan {
  const factByRole = new Map(facts.map((fact) => [fact.role, fact]));
  const hasBase = factByRole.has('base');
  const hiddenFact = facts.find((fact) => fact.visibility === 'hidden');
  if (hiddenFact === undefined || hiddenFact.role === undefined) {
    throw new Error('Drone-power story needs exactly one hidden fact.');
  }
  const structure = hasBase ? 'base-and-parts' : 'groups-only';
  const totalQuestionFragment =
    questionFragmentsByRole.total[structure];
  return {
    scenarioId: 'gaming.drone-power',
    seed,
    structure,
    sentences: facts
      .filter(
        (fact): fact is ThemeFact & {
          visibility: 'known';
          role: 'base' | 'count' | 'per-item' | 'total';
        } =>
          fact.visibility === 'known' &&
          (fact.role === 'base' ||
            fact.role === 'count' ||
            fact.role === 'per-item' ||
            fact.role === 'total'),
      )
      .map((fact) => ({
        fragmentKey:
          fact.role === 'total' && !hasBase
            ? ('totalFact.droneDraw' as const)
            : statementFragmentsByRole[fact.role],
        factId: fact.themeQuantityId,
        nounKey: nounsByRole[fact.role],
      })),
    question: {
      fragmentKey:
        hiddenFact.role === 'total'
          ? totalQuestionFragment
          : questionFragmentsByRole[hiddenFact.role],
      factId: hiddenFact.themeQuantityId,
      nounKey: nounsByRole[hiddenFact.role],
    },
  };
}
