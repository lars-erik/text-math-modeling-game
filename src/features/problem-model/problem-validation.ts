import {
  collectLiterals,
  collectReferences,
  evaluateRelation,
  type Expression,
  type QuantityId,
} from './expression';

import {
  type AnswerKey,
  type Dimension,
  type Problem,
  type QuantityRole,
} from './problem';

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
  | { kind: 'unsafe-replay-seed'; value: number }
  | { kind: 'unsafe-literal'; value: number };

export type ProblemDimensionIssue =
  | {
      kind: 'incompatible-addition-dimensions';
      left: Dimension;
      right: Dimension;
    }
  | {
      kind: 'incompatible-multiplication-dimensions';
      left: Dimension;
      right: Dimension;
    }
  | {
      kind: 'incompatible-equation-dimensions';
      left: Dimension;
      right: Dimension;
    };

export type ProblemInvariantIssue =
  | { kind: 'duplicate-quantity-id'; id: QuantityId }
  | { kind: 'invalid-hidden-quantity-count'; count: number }
  | {
      kind: 'replay-hidden-role-mismatch';
      replayHiddenRole: QuantityRole;
      hiddenRole: QuantityRole;
    }
  | { kind: 'missing-known-answer-binding'; id: QuantityId }
  | {
      kind: 'known-answer-mismatch';
      id: QuantityId;
      knownValue: number;
      answerValue: number;
    };

export type ProblemAstIssue =
  | ProblemReferenceIssue
  | ProblemDimensionIssue
  | Extract<
      ProblemNumberIssue,
      { kind: 'unsafe-known-value' | 'unsafe-replay-seed' | 'unsafe-literal' }
    >
  | Extract<
      ProblemInvariantIssue,
      {
        kind:
          | 'duplicate-quantity-id'
          | 'invalid-hidden-quantity-count'
          | 'replay-hidden-role-mismatch';
      }
    >;

export type ProblemConstraintIssue =
  | ProblemSolutionIssue
  | Extract<ProblemNumberIssue, { kind: 'unsafe-answer-value' }>
  | Extract<
      ProblemInvariantIssue,
      { kind: 'missing-known-answer-binding' | 'known-answer-mismatch' }
    >;

export type ProblemConstraintCode =
  | 'relation-satisfaction'
  | 'known-answer-consistency'
  | 'safe-answer-values';

type ProblemAstValidatorCode =
  | 'defined-quantity-references'
  | 'safe-known-values'
  | 'safe-replay-seed'
  | 'safe-literals'
  | 'valid-dimensions'
  | 'unique-quantity-ids'
  | 'single-hidden-quantity'
  | 'replay-hidden-role-consistency';

type ProblemAstValidationContext = {
  problem: Problem;
};

type ProblemConstraintValidationContext = ProblemAstValidationContext & {
  answerKey: AnswerKey;
};

type ProblemValidator<Context, Code extends string, Issue> = {
  code: Code;
  validate: (context: Context) => readonly Issue[];
};

const defaultProblemConstraintCodes = [
  'relation-satisfaction',
] as const satisfies readonly ProblemConstraintCode[];

export const allProblemConstraintCodes = [
  'relation-satisfaction',
  'known-answer-consistency',
  'safe-answer-values',
] as const satisfies readonly ProblemConstraintCode[];


export function validateProblemAst(problem: Problem): readonly ProblemAstIssue[] {
  return runValidators({ problem }, problemAstValidators);
}

export function validateProblemConstraints(
  problem: Problem,
  answerKey: AnswerKey,
): readonly ProblemConstraintIssue[];
export function validateProblemConstraints(
  problem: Problem,
  answerKey: AnswerKey,
  constraints: readonly ProblemConstraintCode[],
): readonly ProblemConstraintIssue[];
export function validateProblemConstraints(
  problem: Problem,
  answerKey: AnswerKey,
  constraints: readonly ProblemConstraintCode[] = defaultProblemConstraintCodes,
): readonly ProblemConstraintIssue[] {
  return runValidators(
    { problem, answerKey },
    problemConstraintValidators,
    constraints,
  );
}

function runValidators<Context, Code extends string, Issue>(
  context: Context,
  validators: readonly ProblemValidator<Context, Code, Issue>[],
  allowedCodes?: readonly Code[],
): readonly Issue[] {
  const allowedCodeSet = allowedCodes ? new Set(allowedCodes) : undefined;

  return validators.flatMap((validator) => {
    if (allowedCodeSet && !allowedCodeSet.has(validator.code)) {
      return [];
    }

    return validator.validate(context);
  });
}

function validateUndefinedQuantityReferences({
  problem,
}: ProblemAstValidationContext): readonly ProblemReferenceIssue[] {
  const declaredIds = new Set(problem.quantities.map((quantity) => quantity.id));

  const relationIssues = collectReferences(problem.relation)
    .filter((id) => !declaredIds.has(id))
    .map((id) => ({ kind: 'undefined-quantity' as const, id }));
  const guidanceIssues = (problem.guidance ?? []).flatMap((entry) =>
    Object.values(entry.quantities)
      .filter((id) => !declaredIds.has(id))
      .map((id) => ({ kind: 'undefined-quantity' as const, id })),
  );
  return [...relationIssues, ...guidanceIssues];
}

function validateKnownNumberSafety({
  problem,
}: ProblemAstValidationContext): readonly Extract<
  ProblemNumberIssue,
  { kind: 'unsafe-known-value' }
>[] {
  const issues: Extract<ProblemNumberIssue, { kind: 'unsafe-known-value' }>[] = [];

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
}: ProblemAstValidationContext): readonly Extract<
  ProblemNumberIssue,
  { kind: 'unsafe-literal' }
>[] {
  const issues: Extract<ProblemNumberIssue, { kind: 'unsafe-literal' }>[] = [];

  for (const value of collectLiterals(problem.relation)) {
    if (!Number.isSafeInteger(value)) {
      issues.push({ kind: 'unsafe-literal', value });
    }
  }

  return issues;
}

function validateReplaySeedNumberSafety({
  problem,
}: ProblemAstValidationContext): readonly Extract<
  ProblemNumberIssue,
  { kind: 'unsafe-replay-seed' }
>[] {
  if (!problem.replay || Number.isSafeInteger(problem.replay.seed)) {
    return [];
  }

  return [{ kind: 'unsafe-replay-seed', value: problem.replay.seed }];
}

function validateUniqueQuantityIds({
  problem,
}: ProblemAstValidationContext): readonly Extract<
  ProblemInvariantIssue,
  { kind: 'duplicate-quantity-id' }
>[] {
  const issues: Extract<
    ProblemInvariantIssue,
    { kind: 'duplicate-quantity-id' }
  >[] = [];
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
}: ProblemAstValidationContext): readonly Extract<
  ProblemInvariantIssue,
  { kind: 'invalid-hidden-quantity-count' }
>[] {
  const hiddenCount = problem.quantities.filter(
    (quantity) => quantity.given.kind === 'hidden',
  ).length;

  return hiddenCount === 1
    ? []
    : [{ kind: 'invalid-hidden-quantity-count', count: hiddenCount }];
}

function validateReplayHiddenRoleConsistency({
  problem,
}: ProblemAstValidationContext): readonly Extract<
  ProblemInvariantIssue,
  { kind: 'replay-hidden-role-mismatch' }
>[] {
  const replayHiddenRole = problem.replay?.hiddenRole;
  if (replayHiddenRole === undefined) {
    return [];
  }
  const hiddenRole = problem.quantities
    .filter((quantity) => quantity.given.kind === 'hidden')
    .map((quantity) => quantity.role)
    .find((role): role is QuantityRole => role !== undefined);
  return hiddenRole === undefined || hiddenRole === replayHiddenRole
    ? []
    : [
        {
          kind: 'replay-hidden-role-mismatch',
          replayHiddenRole,
          hiddenRole,
        },
      ];
}

function validateDimensions({
  problem,
}: ProblemAstValidationContext): readonly ProblemDimensionIssue[] {
  const dimensionsById = new Map(
    problem.quantities.map((quantity) => [quantity.id, quantity.dimension]),
  );
  const left = inferExpressionDimension(
    problem.relation.left,
    dimensionsById,
  );
  const right = inferExpressionDimension(
    problem.relation.right,
    dimensionsById,
  );
  const issues = [...left.issues, ...right.issues];

  if (
    left.dimension !== undefined &&
    right.dimension !== undefined &&
    left.dimension !== right.dimension
  ) {
    issues.push({
      kind: 'incompatible-equation-dimensions',
      left: left.dimension,
      right: right.dimension,
    });
  }

  return issues;
}

type DimensionInference = {
  dimension?: Dimension;
  issues: readonly ProblemDimensionIssue[];
};

function inferExpressionDimension(
  expression: Expression,
  dimensionsById: ReadonlyMap<QuantityId, Dimension>,
): DimensionInference {
  switch (expression.kind) {
    case 'literal':
      return { dimension: 'scalar', issues: [] };

    case 'quantity':
      return { dimension: dimensionsById.get(expression.id), issues: [] };

    case 'multiply': {
      const left = inferExpressionDimension(expression.left, dimensionsById);
      const right = inferExpressionDimension(expression.right, dimensionsById);
      const issues = [...left.issues, ...right.issues];

      if (left.dimension === undefined || right.dimension === undefined) {
        return { issues };
      }

      const productDimension = multiplyDimensions(
        left.dimension,
        right.dimension,
      );
      if (productDimension === undefined) {
        issues.push({
          kind: 'incompatible-multiplication-dimensions',
          left: left.dimension,
          right: right.dimension,
        });
        return { issues };
      }

      return { dimension: productDimension, issues };
    }

    case 'add': {
      const left = inferExpressionDimension(expression.left, dimensionsById);
      const right = inferExpressionDimension(expression.right, dimensionsById);
      const issues = [...left.issues, ...right.issues];

      if (
        left.dimension !== undefined &&
        right.dimension !== undefined &&
        left.dimension !== right.dimension
      ) {
        issues.push({
          kind: 'incompatible-addition-dimensions',
          left: left.dimension,
          right: right.dimension,
        });
        return { issues };
      }

      return {
        dimension: left.dimension ?? right.dimension,
        issues,
      };
    }
  }
}

function multiplyDimensions(
  left: Dimension,
  right: Dimension,
): Dimension | undefined {
  if (left === 'scalar' && right === 'scalar') {
    return 'scalar';
  }

  if (
    (left === 'item' && right === 'scalar') ||
    (left === 'scalar' && right === 'item')
  ) {
    return 'scalar';
  }

  if (
    (left === 'item' && right === 'amountPerItem') ||
    (left === 'amountPerItem' && right === 'item')
  ) {
    return 'amount';
  }


  if (left === 'scalar') {
    return right;
  }

  if (right === 'scalar') {
    return left;
  }

  return undefined;
}

function validateSatisfiedRelation(
  context: ProblemConstraintValidationContext,
): readonly ProblemSolutionIssue[] {
  const { problem, answerKey } = context;
  const result = evaluateRelation(problem.relation, answerKey.bindings);

  if (result.kind === 'missing-binding') {
    return [{ kind: 'missing-answer-binding', id: result.id }];
  }

  return result.value ? [] : [{ kind: 'unsatisfied-relation' }];
}

function validateKnownAnswerConsistency(
  context: ProblemConstraintValidationContext,
): readonly Extract<
  ProblemInvariantIssue,
  { kind: 'missing-known-answer-binding' | 'known-answer-mismatch' }
>[] {
  const { problem, answerKey } = context;
  const issues: Extract<
    ProblemInvariantIssue,
    { kind: 'missing-known-answer-binding' | 'known-answer-mismatch' }
  >[] = [];

  const missingBindingReportedIds = new Set<QuantityId>();
  const reportedMismatchValuesById = new Map<QuantityId, Set<number>>();
  for (const quantity of problem.quantities) {
    if (quantity.given.kind !== 'known') {
      continue;
    }

    const id = quantity.id;
    const knownValue = quantity.given.value;
    const hasBinding = Object.prototype.hasOwnProperty.call(answerKey.bindings, id);
    const answerValue = answerKey.bindings[id];
    if (!hasBinding || answerValue === undefined) {
      if (!missingBindingReportedIds.has(id)) {
        missingBindingReportedIds.add(id);
        issues.push({ kind: 'missing-known-answer-binding', id });
      }
      continue;
    }

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

  return issues;
}

function validateAnswerNumberSafety(
  { answerKey }: ProblemConstraintValidationContext,
): readonly Extract<ProblemNumberIssue, { kind: 'unsafe-answer-value' }>[] {
  const issues: Extract<ProblemNumberIssue, { kind: 'unsafe-answer-value' }>[] = [];

  for (const [id, value] of Object.entries(answerKey.bindings)) {
    if (!Number.isSafeInteger(value)) {
      issues.push({ kind: 'unsafe-answer-value', id, value });
    }
  }

  return issues;
}

const problemAstValidators: readonly ProblemValidator<
  ProblemAstValidationContext,
  ProblemAstValidatorCode,
  ProblemAstIssue
>[] = [
  { code: 'defined-quantity-references', validate: validateUndefinedQuantityReferences },
  { code: 'safe-known-values', validate: validateKnownNumberSafety },
  { code: 'safe-replay-seed', validate: validateReplaySeedNumberSafety },
  { code: 'safe-literals', validate: validateLiteralNumberSafety },
  { code: 'valid-dimensions', validate: validateDimensions },
  { code: 'unique-quantity-ids', validate: validateUniqueQuantityIds },
  { code: 'single-hidden-quantity', validate: validateHiddenQuantityCount },
  {
    code: 'replay-hidden-role-consistency',
    validate: validateReplayHiddenRoleConsistency,
  },
];

const problemConstraintValidators: readonly ProblemValidator<
  ProblemConstraintValidationContext,
  ProblemConstraintCode,
  ProblemConstraintIssue
>[] = [
  { code: 'relation-satisfaction', validate: validateSatisfiedRelation },
  { code: 'known-answer-consistency', validate: validateKnownAnswerConsistency },
  { code: 'safe-answer-values', validate: validateAnswerNumberSafety },
];
