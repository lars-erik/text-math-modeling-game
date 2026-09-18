import type { AnswerKey, Dimension, Problem } from '../../problem-model/problem';
import type { Expression, QuantityId, Relation } from '../../problem-model/expression';

export type CreatorFollowersFact = {
  id:
    | 'startingFollowers'
    | 'promotedPostCount'
    | 'followersPerPost'
    | 'finalFollowers';
  sourceId: string;
  role: 'base' | 'count' | 'unitValue' | 'total';
  visibility: 'known' | 'hidden';
  value?: number;
  dimension: Dimension;
  unitKey: 'followers' | 'posts' | 'followersPerPost';
};

export type CreatorFollowersScenarioBinding = {
  facts: readonly CreatorFollowersFact[];
  problem: Problem;
};

const roleMap = {
  base: {
    id: 'startingFollowers',
    role: 'base',
    dimension: 'scalar',
    unitKey: 'followers',
  },
  count: {
    id: 'promotedPostCount',
    role: 'count',
    dimension: 'item',
    unitKey: 'posts',
  },
  'per-item': {
    id: 'followersPerPost',
    role: 'unitValue',
    dimension: 'scalar',
    unitKey: 'followersPerPost',
  },
  total: {
    id: 'finalFollowers',
    role: 'total',
    dimension: 'scalar',
    unitKey: 'followers',
  },
} as const;

export function bindCreatorFollowersScenario(
  problem: Problem,
): CreatorFollowersScenarioBinding {
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
      scenarioId: 'creator.followers',
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

export function bindCreatorFollowersAnswerKey(
  answerKey: AnswerKey,
  binding: CreatorFollowersScenarioBinding,
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
