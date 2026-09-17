import {
  type Bindings,
  type QuantityId,
  type Relation,
} from './expression';

export type QuantityRole = 'base' | 'count' | 'per-item' | 'total';

export type QuantityGiven =
  | { kind: 'known'; value: number }
  | { kind: 'hidden' };

export type Quantity = {
  id: QuantityId;
  role: QuantityRole;
  given: QuantityGiven;
};

export type Problem = {
  quantities: readonly Quantity[];
  relation: Relation;
};

export type AnswerKey = {
  bindings: Bindings;
};

export function getVisibleBindings(problem: Problem): Bindings {
  const entries = problem.quantities.flatMap((quantity) =>
    quantity.given.kind === 'known'
      ? ([[quantity.id, quantity.given.value]] as const)
      : [],
  );

  return Object.fromEntries(entries);
}
