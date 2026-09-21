import type { Expression, Relation } from './expression';

export function regroupRelation(relation: Relation): Relation {
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

export function flattenMultiplyToAddRelation(relation: Relation): Relation {
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
