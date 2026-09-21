import type { ThemeFact } from '../theme';

export type DronePowerStoryPlan = {
  scenarioId: 'gaming.drone-power';
  seed: number;
  structure: 'base-and-parts' | 'groups-only';
  sentences: readonly (
    | {
        fragmentKey:
          | 'baseFact.basicSystems'
          | 'countFact.activeDrones'
          | 'totalFact.combinedDraw'
          | 'totalFact.droneDraw';
        factId: ThemeFact['themeQuantityId'];
        nounKey: 'ship' | 'drone';
      }
  )[];
  question: {
    fragmentKey:
      | 'question.perDronePower'
      | 'question.basePower'
      | 'question.droneCount'
      | 'question.totalPower';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'ship' | 'drone';
  };
};

const statementFragmentsByRole = {
  base: 'baseFact.basicSystems',
  count: 'countFact.activeDrones',
  total: 'totalFact.combinedDraw',
} as const satisfies Record<
  string,
  'baseFact.basicSystems' | 'countFact.activeDrones' | 'totalFact.combinedDraw'
>;

const questionFragmentsByRole = {
  'per-item': 'question.perDronePower',
  base: 'question.basePower',
  count: 'question.droneCount',
  total: 'question.totalPower',
} as const satisfies Record<string, DronePowerStoryPlan['question']['fragmentKey']>;

const nounsByRole = {
  base: 'ship',
  count: 'drone',
  'per-item': 'drone',
  total: 'drone',
} as const satisfies Record<string, 'ship' | 'drone'>;

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
  return {
    scenarioId: 'gaming.drone-power',
    seed,
    structure: hasBase ? 'base-and-parts' : 'groups-only',
    sentences: facts
      .filter(
        (fact): fact is ThemeFact & {
          visibility: 'known';
          role: 'base' | 'count' | 'total';
        } =>
          fact.visibility === 'known' &&
          (fact.role === 'base' ||
            fact.role === 'count' ||
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
      fragmentKey: questionFragmentsByRole[hiddenFact.role],
      factId: hiddenFact.themeQuantityId,
      nounKey: nounsByRole[hiddenFact.role],
    },
  };
}
