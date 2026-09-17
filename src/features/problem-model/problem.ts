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

export type ProblemInvariantIssue =
  | { kind: 'duplicate-quantity-id'; id: QuantityId }
  | { kind: 'invalid-hidden-quantity-count'; count: number }
  | { kind: 'missing-known-answer-binding'; id: QuantityId }
  | {
      kind: 'known-answer-mismatch';
      id: QuantityId;
      knownValue: number;
      answerValue: number;
    };

type ProblemReferenceValidationContext = {
  problem: Problem;
};

type ProblemSolutionValidationContext = {
  problem: Problem;
  answerKey: AnswerKey;
};

type ProblemNumberValidationContext = {
  problem: Problem;
  answerKey: AnswerKey;
};

type ProblemInvariantValidationContext = {
  problem: Problem;
  answerKey: AnswerKey;
};

type ProblemReferenceValidator = (
  context: ProblemReferenceValidationContext,
) => readonly ProblemReferenceIssue[];

type ProblemSolutionValidator = (
  context: ProblemSolutionValidationContext,
) => readonly ProblemSolutionIssue[];

type ProblemNumberValidator = (
  context: ProblemNumberValidationContext,
) => readonly ProblemNumberIssue[];

type ProblemInvariantValidator = (
  context: ProblemInvariantValidationContext,
) => readonly ProblemInvariantIssue[];

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
  const context = { problem } satisfies ProblemReferenceValidationContext;
  return problemReferenceValidators.flatMap((validator) => validator(context));
}

export function validateProblemSolution(
  problem: Problem,
  answerKey: AnswerKey,
): readonly ProblemSolutionIssue[] {
  const context = { problem, answerKey } satisfies ProblemSolutionValidationContext;
  return problemSolutionValidators.flatMap((validator) => validator(context));
}

export function validateProblemNumbers(
  problem: Problem,
  answerKey: AnswerKey,
): readonly ProblemNumberIssue[] {
  const context = { problem, answerKey } satisfies ProblemNumberValidationContext;
  return problemNumberValidators.flatMap((validator) => validator(context));
}

export function validateProblemInvariants(
  problem: Problem,
  answerKey: AnswerKey,
): readonly ProblemInvariantIssue[] {
  const context = { problem, answerKey } satisfies ProblemInvariantValidationContext;
  return problemInvariantValidators.flatMap((validator) => validator(context));
}

function validateSatisfiedRelation({
  problem,
  answerKey,
}: ProblemSolutionValidationContext): readonly ProblemSolutionIssue[] {
  const result = evaluateRelation(problem.relation, answerKey.bindings);

  if (result.kind === 'missing-binding') {
    return [{ kind: 'missing-answer-binding', id: result.id }];
  }

  return result.value ? [] : [{ kind: 'unsatisfied-relation' }];
}

function validateKnownNumberSafety({
  problem,
}: ProblemNumberValidationContext): readonly ProblemNumberIssue[] {
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

  return issues;
}

function validateLiteralNumberSafety({
  problem,
}: ProblemNumberValidationContext): readonly ProblemNumberIssue[] {
  const issues: ProblemNumberIssue[] = [];

  for (const value of collectLiterals(problem.relation)) {
    if (!Number.isSafeInteger(value)) {
      issues.push({ kind: 'unsafe-literal', value });
    }
  }

  return issues;
}

function validateAnswerNumberSafety({
  answerKey,
}: ProblemNumberValidationContext): readonly ProblemNumberIssue[] {
  const issues: ProblemNumberIssue[] = [];

  for (const [id, value] of Object.entries(answerKey.bindings)) {
    if (!Number.isSafeInteger(value)) {
      issues.push({ kind: 'unsafe-answer-value', id, value });
    }
  }

  return issues;
}

function validateUniqueQuantityIds({
  problem,
}: ProblemInvariantValidationContext): readonly ProblemInvariantIssue[] {
  const issues: ProblemInvariantIssue[] = [];
  const quantityIdCounts = new Map<QuantityId, number>();
  for (const quantity of problem.quantities) {
    quantityIdCounts.set(quantity.id, (quantityIdCounts.get(quantity.id) ?? 0) + 1);
  }

  for (const [id, count] of quantityIdCounts) {
    if (count > 1) {
      issues.push({ kind: 'duplicate-quantity-id', id });
    }
  }

  return issues;
}

function validateHiddenQuantityCount({
  problem,
}: ProblemInvariantValidationContext): readonly ProblemInvariantIssue[] {
  const hiddenCount = problem.quantities.filter(
    (quantity) => quantity.given.kind === 'hidden',
  ).length;

  return hiddenCount === 1
    ? []
    : [{ kind: 'invalid-hidden-quantity-count', count: hiddenCount }];
}

function validateKnownAnswerConsistency({
  problem,
  answerKey,
}: ProblemInvariantValidationContext): readonly ProblemInvariantIssue[] {
  const issues: ProblemInvariantIssue[] = [];

  const knownValuesById = new Map<QuantityId, number[]>();
  for (const quantity of problem.quantities) {
    if (quantity.given.kind !== 'known') {
      continue;
    }
    if (!knownValuesById.has(quantity.id)) {
      knownValuesById.set(quantity.id, []);
    }
    knownValuesById.get(quantity.id)?.push(quantity.given.value);
  }

  const missingBindingReportedIds = new Set<QuantityId>();
  const reportedMismatchValuesById = new Map<QuantityId, Set<number>>();
  for (const [id, knownValues] of knownValuesById) {
    const hasBinding = Object.prototype.hasOwnProperty.call(answerKey.bindings, id);
    const answerValue = answerKey.bindings[id];
    if (!hasBinding || answerValue === undefined) {
      if (!missingBindingReportedIds.has(id)) {
        missingBindingReportedIds.add(id);
        issues.push({ kind: 'missing-known-answer-binding', id });
      }
      continue;
    }
    for (const knownValue of knownValues) {
      if (answerValue !== knownValue) {
        if (!reportedMismatchValuesById.has(id)) {
          reportedMismatchValuesById.set(id, new Set<number>());
        }
        const reportedMismatchValues = reportedMismatchValuesById.get(id);
        if (reportedMismatchValues?.has(knownValue)) {
          continue;
        }
        reportedMismatchValues?.add(knownValue);
        issues.push({
          kind: 'known-answer-mismatch',
          id,
          knownValue,
          answerValue,
        });
      }
    }
  }

  return issues;
}

function validateUndefinedQuantityReferences({
  problem,
}: ProblemReferenceValidationContext): readonly ProblemReferenceIssue[] {
  const declaredIds = new Set(problem.quantities.map((quantity) => quantity.id));

  return collectReferences(problem.relation)
    .filter((id) => !declaredIds.has(id))
    .map((id) => ({ kind: 'undefined-quantity', id }));
}

const problemReferenceValidators: readonly ProblemReferenceValidator[] = [
  validateUndefinedQuantityReferences,
];

const problemSolutionValidators: readonly ProblemSolutionValidator[] = [
  validateSatisfiedRelation,
];

const problemNumberValidators: readonly ProblemNumberValidator[] = [
  validateKnownNumberSafety,
  validateLiteralNumberSafety,
  validateAnswerNumberSafety,
];

const problemInvariantValidators: readonly ProblemInvariantValidator[] = [
  validateUniqueQuantityIds,
  validateHiddenQuantityCount,
  validateKnownAnswerConsistency,
];
