import type { Expression, Relation } from './expression';

export type Misconception = {
  kind: 'base-applied-per-item';
  baseQuantityId: string;
  countQuantityId: string;
};

export function classifyMisconception(
  expected: Relation,
  submitted: Relation,
): Misconception | undefined {
  const movedBase = findBaseMovedIntoCountProduct(
    expected.right,
    submitted.right,
  );
  if (movedBase === undefined) {
    return undefined;
  }
  if (!expressionsEqual(expected.left, submitted.left)) {
    return undefined;
  }
  return {
    kind: 'base-applied-per-item',
    baseQuantityId: movedBase.baseQuantityId,
    countQuantityId: movedBase.countQuantityId,
  };
}

type MovedBase = {
  baseQuantityId: string;
  countQuantityId: string;
};

function findBaseMovedIntoCountProduct(
  expected: Expression,
  submitted: Expression,
): MovedBase | undefined {
  if (
    expected.kind !== 'add' ||
    submitted.kind !== 'multiply' ||
    submitted.left.kind !== 'quantity' ||
    submitted.right.kind !== 'add'
  ) {
    return undefined;
  }
  const expectedBase = expected.left;
  const expectedProduct = expected.right;
  if (
    expectedBase.kind !== 'quantity' ||
    expectedProduct.kind !== 'multiply' ||
    expectedProduct.left.kind !== 'quantity'
  ) {
    return undefined;
  }
  const countQuantityId = expectedProduct.left.id;
  const expectedUnitValue = expectedProduct.right;
  const submittedSum = submitted.right;
  const baseInSubmittedSum = [submittedSum.left, submittedSum.right].find(
    (operand) => expressionsEqual(operand, expectedBase),
  );
  const unitValueInSubmittedSum = [submittedSum.left, submittedSum.right].find(
    (operand) => expressionsEqual(operand, expectedUnitValue),
  );
  if (
    baseInSubmittedSum === undefined ||
    unitValueInSubmittedSum === undefined ||
    baseInSubmittedSum === unitValueInSubmittedSum
  ) {
    return undefined;
  }
  if (!expressionsEqual(submitted.left, expectedProduct.left)) {
    return undefined;
  }
  return { baseQuantityId: expectedBase.id, countQuantityId };
}

function expressionsEqual(left: Expression, right: Expression): boolean {
  if (left.kind !== right.kind) {
    return false;
  }
  switch (left.kind) {
    case 'literal':
      return right.kind === 'literal' && left.value === right.value;
    case 'quantity':
      return right.kind === 'quantity' && left.id === right.id;
    case 'add':
    case 'multiply':
      return (
        (right.kind === 'add' || right.kind === 'multiply') &&
        right.kind === left.kind &&
        expressionsEqual(left.left, right.left) &&
        expressionsEqual(left.right, right.right)
      );
  }
}
