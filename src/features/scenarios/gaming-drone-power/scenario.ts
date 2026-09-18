import type { AnswerKey, Dimension, Problem } from '../../problem-model/problem';
import type { Expression, QuantityId, Relation } from '../../problem-model/expression';

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
  problem: Problem;
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
  const facts = problem.quantities.map((quantity) => {
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
  });
  const ids = new Map(facts.map((fact) => [fact.sourceId, fact.id]));

  return {
    facts,
    problem: {
      ...problem,
      quantities: problem.quantities.map((quantity, index) => ({
        ...quantity,
        id: facts[index].id,
        dimension: facts[index].dimension,
      })),
      relation: renameRelation(problem.relation, ids),
      academicSymbols: Object.fromEntries(
        Object.entries(problem.academicSymbols).map(([id, symbol]) => [
          requireMappedId(ids, id),
          symbol,
        ]),
      ),
    },
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

export function bindDronePowerAnswerKey(
  answerKey: AnswerKey,
  binding: DronePowerScenarioBinding,
): AnswerKey {
  return {
    bindings: Object.fromEntries(
      binding.facts.map((fact) => {
        const value = answerKey.bindings[fact.sourceId];
        if (value === undefined) {
          throw new Error(`Answer key has no binding for ${fact.sourceId}.`);
        }
        return [fact.id, value];
      }),
    ),
  };
}

function renameRelation(
  relation: Relation,
  ids: ReadonlyMap<QuantityId, QuantityId>,
): Relation {
  return {
    kind: 'equation',
    left: renameExpression(relation.left, ids),
    right: renameExpression(relation.right, ids),
  };
}

function renameExpression(
  expression: Expression,
  ids: ReadonlyMap<QuantityId, QuantityId>,
): Expression {
  switch (expression.kind) {
    case 'literal':
      return expression;
    case 'quantity':
      return { kind: 'quantity', id: requireMappedId(ids, expression.id) };
    case 'add':
    case 'multiply':
      return {
        kind: expression.kind,
        left: renameExpression(expression.left, ids),
        right: renameExpression(expression.right, ids),
      };
  }
}

function requireMappedId(
  ids: ReadonlyMap<QuantityId, QuantityId>,
  id: QuantityId,
): QuantityId {
  const mapped = ids.get(id);
  if (mapped === undefined) {
    throw new Error(`Scenario has no role mapping for quantity ${id}.`);
  }
  return mapped;
}
