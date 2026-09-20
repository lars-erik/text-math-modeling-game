import type { Expression, Relation } from '../problem-model/expression';
import type { Problem } from '../problem-model/problem';
import { getVisibleBindings } from '../problem-model/problem';

export function substituteVisibleValues(problem: Problem): Relation {
  const visibleBindings = getVisibleBindings(problem);
  return {
    kind: 'equation',
    left: substituteExpression(problem.relation.left, visibleBindings),
    right: substituteExpression(problem.relation.right, visibleBindings),
  };
}

function substituteExpression(
  expression: Expression,
  visibleBindings: Readonly<Record<string, number>>,
): Expression {
  switch (expression.kind) {
    case 'literal':
      return { ...expression };
    case 'quantity':
      return Object.hasOwn(visibleBindings, expression.id)
        ? { kind: 'literal', value: visibleBindings[expression.id] }
        : { ...expression };
    case 'add':
    case 'multiply':
      return {
        kind: expression.kind,
        left: substituteExpression(expression.left, visibleBindings),
        right: substituteExpression(expression.right, visibleBindings),
      };
  }
}
