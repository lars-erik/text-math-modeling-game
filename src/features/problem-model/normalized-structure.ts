import type { Expression, Relation } from './expression';

export type OperandOrdering = 'ordered' | 'commutative';
export type EquationSideOrdering = 'ordered' | 'swappable';

export type NormalizedStructurePolicy = {
  addition: OperandOrdering;
  multiplication: OperandOrdering;
  equationSides: EquationSideOrdering;
};

export const namedEquationStructurePolicy = {
  addition: 'commutative',
  multiplication: 'commutative',
  equationSides: 'swappable',
} as const satisfies NormalizedStructurePolicy;

export function normalizeExpression(
  expression: Expression,
  policy: NormalizedStructurePolicy,
): Expression {
  switch (expression.kind) {
    case 'literal':
      return { kind: 'literal', value: expression.value };

    case 'quantity':
      return { kind: 'quantity', id: expression.id };

    case 'add':
      return normalizeBinary(
        'add',
        expression.left,
        expression.right,
        policy.addition,
        policy,
      );

    case 'multiply':
      return normalizeBinary(
        'multiply',
        expression.left,
        expression.right,
        policy.multiplication,
        policy,
      );
  }
}

export function relationsHaveNormalizedStructure(
  expected: Relation,
  actual: Relation,
  policy: NormalizedStructurePolicy,
): boolean {
  const expectedLeft = normalizeExpression(expected.left, policy);
  const expectedRight = normalizeExpression(expected.right, policy);
  const actualLeft = normalizeExpression(actual.left, policy);
  const actualRight = normalizeExpression(actual.right, policy);

  const orderedMatch =
    expressionsHaveSameStructure(expectedLeft, actualLeft) &&
    expressionsHaveSameStructure(expectedRight, actualRight);

  if (orderedMatch || policy.equationSides === 'ordered') {
    return orderedMatch;
  }

  return (
    expressionsHaveSameStructure(expectedLeft, actualRight) &&
    expressionsHaveSameStructure(expectedRight, actualLeft)
  );
}

function normalizeBinary(
  kind: 'add' | 'multiply',
  leftExpression: Expression,
  rightExpression: Expression,
  ordering: OperandOrdering,
  policy: NormalizedStructurePolicy,
): Expression {
  const left = normalizeExpression(leftExpression, policy);
  const right = normalizeExpression(rightExpression, policy);

  if (
    ordering === 'commutative' &&
    structuralSortKey(right) < structuralSortKey(left)
  ) {
    return { kind, left: right, right: left };
  }

  return { kind, left, right };
}

function expressionsHaveSameStructure(
  expected: Expression,
  actual: Expression,
): boolean {
  if (expected.kind !== actual.kind) {
    return false;
  }

  switch (expected.kind) {
    case 'literal':
      return actual.kind === 'literal' && expected.value === actual.value;

    case 'quantity':
      return actual.kind === 'quantity' && expected.id === actual.id;

    case 'add':
      return (
        actual.kind === 'add' &&
        expressionsHaveSameStructure(expected.left, actual.left) &&
        expressionsHaveSameStructure(expected.right, actual.right)
      );

    case 'multiply':
      return (
        actual.kind === 'multiply' &&
        expressionsHaveSameStructure(expected.left, actual.left) &&
        expressionsHaveSameStructure(expected.right, actual.right)
      );
  }
}

function structuralSortKey(expression: Expression): string {
  switch (expression.kind) {
    case 'literal':
      return `literal:${expression.value}`;

    case 'quantity':
      return `quantity:${JSON.stringify(expression.id)}`;

    case 'add':
      return `add(${structuralSortKey(expression.left)},${structuralSortKey(expression.right)})`;

    case 'multiply':
      return `multiply(${structuralSortKey(expression.left)},${structuralSortKey(expression.right)})`;
  }
}
