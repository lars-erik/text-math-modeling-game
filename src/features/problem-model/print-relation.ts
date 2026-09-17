import type { Expression, Relation } from './expression';

const indentation = '  ';

export function printRelation(relation: Relation): string {
  const lines = [
    'equation',
    ...printExpression(relation.left, 1),
    ...printExpression(relation.right, 1),
  ];

  return `${lines.join('\n')}\n`;
}

function printExpression(expression: Expression, depth: number): string[] {
  const prefix = indentation.repeat(depth);

  switch (expression.kind) {
    case 'literal':
      return [`${prefix}literal ${expression.value}`];

    case 'quantity':
      return [`${prefix}quantity ${expression.id}`];

    case 'add':
      return [
        `${prefix}add`,
        ...printExpression(expression.left, depth + 1),
        ...printExpression(expression.right, depth + 1),
      ];

    case 'multiply':
      return [
        `${prefix}multiply`,
        ...printExpression(expression.left, depth + 1),
        ...printExpression(expression.right, depth + 1),
      ];
  }
}
