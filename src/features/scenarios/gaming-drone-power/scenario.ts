import type { Dimension, Problem } from '../../problem-model/problem';

export type DronePowerFact = {
  id: 'basePower' | 'droneCount' | 'dronePower' | 'totalPower';
  sourceId: string;
  role: 'base' | 'count' | 'unitValue' | 'total';
  visibility: 'known' | 'hidden';
  value?: number;
  dimension: Dimension;
  unitKey: 'count' | 'power' | 'powerPerDrone';
};

export type DronePowerScenarioBinding = {
  facts: readonly DronePowerFact[];
};

export type DronePowerStoryPlan = {
  scenarioId: 'gaming.drone-power';
  seed: number;
  sentences: readonly (
    | {
        fragmentKey: 'baseFact.basicSystems' | 'countFact.activeDrones';
        factId: DronePowerFact['id'];
        nounKey: 'ship' | 'drone';
      }
    | {
        fragmentKey: 'totalFact.combinedDraw';
        factId: DronePowerFact['id'];
      }
  )[];
  question: {
    fragmentKey: 'question.perDronePower';
    factId: DronePowerFact['id'];
    nounKey: 'drone';
  };
};

const roleMap = {
  base: {
    id: 'basePower',
    role: 'base',
    dimension: 'power',
    unitKey: 'power',
  },
  count: {
    id: 'droneCount',
    role: 'count',
    dimension: 'item',
    unitKey: 'count',
  },
  'per-item': {
    id: 'dronePower',
    role: 'unitValue',
    dimension: 'powerPerItem',
    unitKey: 'powerPerDrone',
  },
  total: {
    id: 'totalPower',
    role: 'total',
    dimension: 'power',
    unitKey: 'power',
  },
} as const;

export function bindDronePowerScenario(
  problem: Problem,
): DronePowerScenarioBinding {
  return {
    facts: problem.quantities.map((quantity) => {
      if (quantity.role === undefined) {
        throw new Error(`Quantity ${quantity.id} has no total-from-parts role.`);
      }

      const semantics = roleMap[quantity.role];
      return {
        ...semantics,
        sourceId: quantity.id,
        visibility: quantity.given.kind,
        ...(quantity.given.kind === 'known'
          ? { value: quantity.given.value }
          : {}),
      };
    }),
  };
}

export function planDronePowerStory(
  _binding: DronePowerScenarioBinding,
  seed: number,
): DronePowerStoryPlan {
  return {
    scenarioId: 'gaming.drone-power',
    seed,
    sentences: [
      {
        fragmentKey: 'baseFact.basicSystems',
        factId: 'basePower',
        nounKey: 'ship',
      },
      {
        fragmentKey: 'countFact.activeDrones',
        factId: 'droneCount',
        nounKey: 'drone',
      },
      {
        fragmentKey: 'totalFact.combinedDraw',
        factId: 'totalPower',
      },
    ],
    question: {
      fragmentKey: 'question.perDronePower',
      factId: 'dronePower',
      nounKey: 'drone',
    },
  };
}
