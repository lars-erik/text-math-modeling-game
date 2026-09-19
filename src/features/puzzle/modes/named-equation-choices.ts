import type { Expression, Relation } from '../../problem-model/expression';
import type { Problem } from '../../problem-model/problem';

export type NamedEquationChoiceSeed = {
  id: string;
  relation: Relation;
};

export function createNamedEquationChoiceSeeds(
  problem: Problem,
): readonly NamedEquationChoiceSeed[] {
  return [
    { id: 'matching', relation: problem.relation },
    {
      id: 'factor-into-group',
      relation: regroupRelation(problem.relation),
    },
  ];
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
