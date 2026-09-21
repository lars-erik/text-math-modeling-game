import type { Expression, Relation } from '../../problem-model/expression';
import type { Problem } from '../../problem-model/problem';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';

export type NamedEquationChoiceSeed = {
  id: string;
  relation: Relation;
};

export function createNamedEquationChoiceSeeds(
  problem: Problem,
): readonly NamedEquationChoiceSeed[] {
  const distractors = [
    {
      id: 'factor-into-group',
      relation: regroupRelation(problem.relation),
    },
    {
      id: 'add-instead-of-multiply',
      relation: flattenMultiplyToAddRelation(problem.relation),
    },
  ];
  const seeds: NamedEquationChoiceSeed[] = [
    { id: 'matching', relation: problem.relation },
  ];
  for (const distractor of distractors) {
    const isEquivalent = seeds.some((seed) =>
      relationsHaveNormalizedStructure(
        seed.relation,
        distractor.relation,
        namedEquationStructurePolicy,
      ),
    );
    if (!isEquivalent) {
      seeds.push(distractor);
    }
  }
  return seeds;
}

function regroupRelation(relation: Relation): Relation {
  return {
    kind: 'equation',
    left: relation.left,
    right: factorMultiplyIntoAddition(relation.right),
  };
}

function factorMultiplyIntoAddition(expression: Expression): Expression {
  if (
    expression.kind !== 'add' ||
    expression.right.kind !== 'multiply' ||
    expression.left.kind === 'multiply'
  ) {
    return expression;
  }
  const multiply = expression.right;
  return {
    kind: 'multiply',
    left: multiply.left,
    right: {
      kind: 'add',
      left: expression.left,
      right: multiply.right,
    },
  };
}

function flattenMultiplyToAddRelation(relation: Relation): Relation {
  return {
    kind: 'equation',
    left: relation.left,
    right: flattenMultiplyToAdd(relation.right),
  };
}

function flattenMultiplyToAdd(expression: Expression): Expression {
  switch (expression.kind) {
    case 'literal':
    case 'quantity':
      return expression;
    case 'add':
      return {
        kind: 'add',
        left: flattenMultiplyToAdd(expression.left),
        right: flattenMultiplyToAdd(expression.right),
      };
    case 'multiply': {
      const left = flattenMultiplyToAdd(expression.left);
      const right = flattenMultiplyToAdd(expression.right);
      if (left.kind === 'add' || right.kind === 'add') {
        return expression;
      }
      return {
        kind: 'add',
        left,
        right,
      };
    }
  }
}
