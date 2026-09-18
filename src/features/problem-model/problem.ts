import {
  type Bindings,
  type QuantityId,
  type Relation,
} from './expression';

export type QuantityRole = 'base' | 'count' | 'per-item' | 'total';

export type ConceptId = string;
export type Dimension =
  | 'followers'
  | 'followersPerItem'
  | 'item'
  | 'power'
  | 'powerPerItem'
  | 'scalar';
export type ProblemId = string;
export type ScenarioId = string;

export type QuantityGiven =
  | { kind: 'known'; value: number }
  | { kind: 'hidden' };

export type Quantity = {
  id: QuantityId;
  dimension: Dimension;
  role?: QuantityRole;
  given: QuantityGiven;
};

export type AnswerKey = {
  bindings: Bindings;
};

export type ProblemReplay = {
  seed: number;
  generatorVersion: string;
};

export type Problem = {
  id: ProblemId;
  concepts: readonly ConceptId[];
  quantities: readonly Quantity[];
  relation: Relation;
  scenarioId: ScenarioId;
  academicSymbols: Readonly<Record<QuantityId, string>>;
  replay?: ProblemReplay;
};

export function getVisibleBindings(problem: Problem): Bindings {
  const entries = problem.quantities.flatMap((quantity) =>
    quantity.given.kind === 'known'
      ? ([[quantity.id, quantity.given.value]] as const)
      : [],
  );

  return Object.fromEntries(entries);
}
