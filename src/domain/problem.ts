import {
  collectLiterals,
  collectReferences,
  evaluateRelation,
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

export type ProblemReferenceIssue = {
  kind: 'undefined-quantity';
  id: QuantityId;
};

export type ProblemSolutionIssue =
  | { kind: 'missing-answer-binding'; id: QuantityId }
  | { kind: 'unsatisfied-relation' };

export type ProblemNumberIssue =
  | { kind: 'unsafe-known-value'; id: QuantityId; value: number }
  | { kind: 'unsafe-answer-value'; id: QuantityId; value: number }
  | { kind: 'unsafe-literal'; value: number };

export function getVisibleBindings(problem: Problem): Bindings {
  const entries = problem.quantities.flatMap((quantity) =>
    quantity.given.kind === 'known'
      ? ([[quantity.id, quantity.given.value]] as const)
      : [],
  );

  return Object.fromEntries(entries);
}

export function validateProblemReferences(
  problem: Problem,
): readonly ProblemReferenceIssue[] {
  const declaredIds = new Set(problem.quantities.map((quantity) => quantity.id));

  return collectReferences(problem.relation)
    .filter((id) => !declaredIds.has(id))
    .map((id) => ({ kind: 'undefined-quantity', id }));
}

export function validateProblemSolution(
  problem: Problem,
  answerKey: AnswerKey,
): readonly ProblemSolutionIssue[] {
  const result = evaluateRelation(problem.relation, answerKey.bindings);

  if (result.kind === 'missing-binding') {
    return [{ kind: 'missing-answer-binding', id: result.id }];
  }

  return result.value ? [] : [{ kind: 'unsatisfied-relation' }];
}

export function validateProblemNumbers(
  problem: Problem,
  answerKey: AnswerKey,
): readonly ProblemNumberIssue[] {
  const issues: ProblemNumberIssue[] = [];

  for (const quantity of problem.quantities) {
    if (
      quantity.given.kind === 'known' &&
      !Number.isSafeInteger(quantity.given.value)
    ) {
      issues.push({
        kind: 'unsafe-known-value',
        id: quantity.id,
        value: quantity.given.value,
      });
    }
  }

  for (const value of collectLiterals(problem.relation)) {
    if (!Number.isSafeInteger(value)) {
      issues.push({ kind: 'unsafe-literal', value });
    }
  }

  for (const [id, value] of Object.entries(answerKey.bindings)) {
    if (!Number.isSafeInteger(value)) {
      issues.push({ kind: 'unsafe-answer-value', id, value });
    }
  }

  return issues;
}
