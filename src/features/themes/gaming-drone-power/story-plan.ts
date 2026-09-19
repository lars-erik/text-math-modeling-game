import type { ThemeFact } from '../theme';

export type DronePowerStoryPlan = {
  scenarioId: 'gaming.drone-power';
  seed: number;
  sentences: readonly (
    | {
        fragmentKey: 'baseFact.basicSystems' | 'countFact.activeDrones';
        factId: ThemeFact['themeQuantityId'];
        nounKey: 'ship' | 'drone';
      }
    | {
        fragmentKey: 'totalFact.combinedDraw';
        factId: ThemeFact['themeQuantityId'];
      }
  )[];
  question: {
    fragmentKey: 'question.perDronePower';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'drone';
  };
};

export function planDronePowerStory(
  facts: readonly ThemeFact[],
  seed: number,
): DronePowerStoryPlan {
  const factIdByRole = new Map(facts.map((fact) => [fact.role, fact.themeQuantityId]));
  return {
    scenarioId: 'gaming.drone-power',
    seed,
    sentences: [
      {
        fragmentKey: 'baseFact.basicSystems',
        factId: requireRole(factIdByRole, 'base'),
        nounKey: 'ship',
      },
      {
        fragmentKey: 'countFact.activeDrones',
        factId: requireRole(factIdByRole, 'count'),
        nounKey: 'drone',
      },
      {
        fragmentKey: 'totalFact.combinedDraw',
        factId: requireRole(factIdByRole, 'total'),
      },
    ],
    question: {
      fragmentKey: 'question.perDronePower',
      factId: requireRole(factIdByRole, 'per-item'),
      nounKey: 'drone',
    },
  };
}

function requireRole(
  factIdByRole: ReadonlyMap<string, string>,
  role: string,
): string {
  const factId = factIdByRole.get(role);
  if (factId === undefined) {
    throw new Error(`Drone-power story needs a fact with role ${role}.`);
  }
  return factId;
}
