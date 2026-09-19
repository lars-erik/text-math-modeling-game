import type {
  Expression,
  QuantityId,
  Relation,
} from '../problem-model/expression';

export type QuantityNameMap = Readonly<Record<QuantityId, string>>;

export function formatNamedRelation(
  relation: Relation,
  names: QuantityNameMap,
): string {
  return `${formatExpression(relation.left, names, 0)} = ${formatExpression(
    relation.right,
    names,
    0,
  )}`;
}

function formatExpression(
  expression: Expression,
  names: QuantityNameMap,
  parentPrecedence: number,
): string {
  const precedence = precedenceOf(expression);
  let formatted: string;
  switch (expression.kind) {
    case 'literal':
      formatted = String(expression.value);
      break;
    case 'quantity':
      formatted = requireName(names, expression.id);
      break;
    case 'add':
      formatted = `${formatExpression(expression.left, names, precedence)} + ${formatExpression(
        expression.right,
        names,
        precedence,
      )}`;
      break;
    case 'multiply':
      formatted = `${formatExpression(expression.left, names, precedence)} * ${formatExpression(
        expression.right,
        names,
        precedence,
      )}`;
      break;
  }
  return precedence < parentPrecedence ? `(${formatted})` : formatted;
}

function precedenceOf(expression: Expression): number {
  return expression.kind === 'add'
    ? 1
    : expression.kind === 'multiply'
      ? 2
      : 3;
}

function requireName(names: QuantityNameMap, id: QuantityId): string {
  const name = names[id];
  if (name === undefined) {
    throw new Error(`No learner-facing name for canonical quantity ${id}.`);
  }
  return name;
}
