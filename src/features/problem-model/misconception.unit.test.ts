import { expect, test } from 'vitest';
import type { Relation } from './expression';
import { totalFromParts } from './total-from-parts';
import {
  classifyMisconception,
  type Misconception,
} from './misconception';

const totalFromPartsMisconception: Relation = {
  kind: 'equation',
  left: { kind: 'quantity', id: 'total' },
  right: {
    kind: 'multiply',
    left: { kind: 'quantity', id: 'count' },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'base' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  },
};

test('classifies the base moved inside the per-item multiplication', () => {
  expect(
    classifyMisconception(totalFromParts, totalFromPartsMisconception),
  ).toEqual({
    kind: 'base-applied-per-item',
    baseQuantityId: 'base',
    countQuantityId: 'count',
  } satisfies Misconception);
});

test('does not classify the correct relation', () => {
  expect(classifyMisconception(totalFromParts, totalFromParts)).toBeUndefined();
});

test('does not classify an unrelated wrong grouping', () => {
  const unrelated: Relation = {
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'base' },
      right: {
        kind: 'multiply',
        left: { kind: 'quantity', id: 'unitValue' },
        right: { kind: 'quantity', id: 'count' },
      },
    },
  };
  expect(
    classifyMisconception(totalFromParts, unrelated),
  ).toBeUndefined();
});

test('does not classify the misconception with a different total side', () => {
  const wrongTotal: Relation = {
    kind: 'equation',
    left: { kind: 'quantity', id: 'base' },
    right: totalFromPartsMisconception.right,
  };
  expect(classifyMisconception(totalFromParts, wrongTotal)).toBeUndefined();
});

test('classification is independent of operand order inside the regrouped sum', () => {
  const reordered: Relation = {
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'unitValue' },
        right: { kind: 'quantity', id: 'base' },
      },
    },
  };
  expect(classifyMisconception(totalFromParts, reordered)).toEqual({
    kind: 'base-applied-per-item',
    baseQuantityId: 'base',
    countQuantityId: 'count',
  } satisfies Misconception);
});

test('classification does not rely on the canonical quantity identifiers being the expected strings', () => {
  const expected: Relation = {
    kind: 'equation',
    left: { kind: 'quantity', id: 'x' },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'a' },
      right: {
        kind: 'multiply',
        left: { kind: 'quantity', id: 'n' },
        right: { kind: 'quantity', id: 'p' },
      },
    },
  };
  const submitted: Relation = {
    kind: 'equation',
    left: { kind: 'quantity', id: 'x' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'n' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'a' },
        right: { kind: 'quantity', id: 'p' },
      },
    },
  };
  expect(classifyMisconception(expected, submitted)).toEqual({
    kind: 'base-applied-per-item',
    baseQuantityId: 'a',
    countQuantityId: 'n',
  } satisfies Misconception);
});

test('does not classify when expected and submitted differ but no base moves into the count product', () => {
  const swappedAddends: Relation = {
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'add',
      left: {
        kind: 'multiply',
        left: { kind: 'quantity', id: 'count' },
        right: { kind: 'quantity', id: 'unitValue' },
      },
      right: { kind: 'quantity', id: 'base' },
    },
  };
  expect(
    classifyMisconception(totalFromParts, swappedAddends),
  ).toBeUndefined();
});
