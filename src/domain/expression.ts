export type QuantityId = string;

export type Expression =
  | { kind: 'literal'; value: number }
  | { kind: 'quantity'; id: QuantityId }
  | { kind: 'add'; left: Expression; right: Expression }
  | { kind: 'multiply'; left: Expression; right: Expression };

export type Relation = {
  kind: 'equation';
  left: Expression;
  right: Expression;
};

export type Bindings = Readonly<Record<QuantityId, number>>;

export type EvaluationResult<T> =
  | { kind: 'value'; value: T }
  | { kind: 'missing-binding'; id: QuantityId };

export function collectReferences(relation: Relation): readonly QuantityId[] {
  const references: QuantityId[] = [];
  const seen = new Set<QuantityId>();

  collectExpressionReferences(relation.left, references, seen);
  collectExpressionReferences(relation.right, references, seen);

  return references;
}

export function evaluateExpression(
  expression: Expression,
  bindings: Bindings,
): EvaluationResult<number> {
  switch (expression.kind) {
    case 'literal':
      return { kind: 'value', value: expression.value };

    case 'quantity':
      return Object.hasOwn(bindings, expression.id)
        ? { kind: 'value', value: bindings[expression.id] }
        : { kind: 'missing-binding', id: expression.id };

    case 'add':
      return evaluateBinary(expression.left, expression.right, bindings, (a, b) => a + b);

    case 'multiply':
      return evaluateBinary(expression.left, expression.right, bindings, (a, b) => a * b);
  }
}

export function evaluateRelation(
  relation: Relation,
  bindings: Bindings,
): EvaluationResult<boolean> {
  const left = evaluateExpression(relation.left, bindings);
  if (left.kind === 'missing-binding') {
    return left;
  }

  const right = evaluateExpression(relation.right, bindings);
  if (right.kind === 'missing-binding') {
    return right;
  }

  return { kind: 'value', value: left.value === right.value };
}

function evaluateBinary(
  leftExpression: Expression,
  rightExpression: Expression,
  bindings: Bindings,
  operation: (left: number, right: number) => number,
): EvaluationResult<number> {
  const left = evaluateExpression(leftExpression, bindings);
  if (left.kind === 'missing-binding') {
    return left;
  }

  const right = evaluateExpression(rightExpression, bindings);
  if (right.kind === 'missing-binding') {
    return right;
  }

  return { kind: 'value', value: operation(left.value, right.value) };
}

function collectExpressionReferences(
  expression: Expression,
  references: QuantityId[],
  seen: Set<QuantityId>,
): void {
  switch (expression.kind) {
    case 'literal':
      return;

    case 'quantity':
      if (!seen.has(expression.id)) {
        seen.add(expression.id);
        references.push(expression.id);
      }
      return;

    case 'add':
    case 'multiply':
      collectExpressionReferences(expression.left, references, seen);
      collectExpressionReferences(expression.right, references, seen);
  }
}
