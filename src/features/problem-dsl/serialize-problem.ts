import type { Expression } from '../problem-model/expression';
import type { Problem, Quantity } from '../problem-model/problem';

const indentation = '    ';

export function serializeProblem(problem: Problem): string {
  const lines = [
    `problem ${problem.id} {`,
    `${indentation}concepts {`,
    ...problem.concepts.map((concept) => `${indentation.repeat(2)}${concept}`),
    `${indentation}}`,
    '',
    ...problem.quantities.map(serializeQuantity),
    '',
    `${indentation}equation {`,
    `${indentation.repeat(2)}${serializeExpression(problem.relation.left)} = ${serializeExpression(problem.relation.right)}`,
    `${indentation}}`,
    '',
    `${indentation}scenario ${problem.scenarioId}`,
    ...Object.entries(problem.academicSymbols)
      .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
      .map(([quantityId, symbol]) =>
        `${indentation}symbol ${quantityId} = ${symbol}`,
      ),
    ...(problem.replay
      ? [
          '',
          `${indentation}replay {`,
          `${indentation.repeat(2)}seed ${problem.replay.seed}`,
          `${indentation.repeat(2)}generator ${problem.replay.generatorVersion}`,
          `${indentation}}`,
        ]
      : []),
    '}',
  ];

  return `${lines.join('\n')}\n`;
}

function serializeQuantity(quantity: Quantity): string {
  const role = quantity.role ? ` role ${quantity.role}` : '';
  const value = quantity.given.kind === 'known'
    ? String(quantity.given.value)
    : '?';

  return `${indentation}quantity ${quantity.id}: ${quantity.dimension}${role} = ${value}`;
}

function serializeExpression(
  expression: Expression,
  parentPrecedence = 0,
  isRightChild = false,
): string {
  const precedence = expressionPrecedence(expression);
  let content: string;

  switch (expression.kind) {
    case 'literal':
      content = String(expression.value);
      break;

    case 'quantity':
      content = expression.id;
      break;

    case 'add':
      content = `${serializeExpression(expression.left, precedence)} + ${serializeExpression(expression.right, precedence, true)}`;
      break;

    case 'multiply':
      content = `${serializeExpression(expression.left, precedence)} * ${serializeExpression(expression.right, precedence, true)}`;
      break;
  }

  return precedence < parentPrecedence || (isRightChild && precedence === parentPrecedence)
    ? `(${content})`
    : content;
}

function expressionPrecedence(expression: Expression): number {
  switch (expression.kind) {
    case 'add':
      return 1;
    case 'multiply':
      return 2;
    case 'literal':
    case 'quantity':
      return 3;
  }
}
