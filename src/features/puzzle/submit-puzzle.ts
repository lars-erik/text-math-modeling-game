import type { Expression, Relation } from '../problem-model/expression';
import {
  parseNamedRelation,
  type LearnerNameSource,
} from '../named-expression';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../problem-model/normalized-structure';
import type { Problem } from '../problem-model/problem';
import { startPuzzle, type PuzzleScreen } from './start-puzzle';

export function submitPuzzle(
  problem: Problem,
  input: string,
  names: LearnerNameSource,
): PuzzleScreen;
export function submitPuzzle(problem: Problem, answer: Relation): PuzzleScreen;
export function submitPuzzle(
  problem: Problem,
  answer: Relation | string,
  _names?: LearnerNameSource,
): PuzzleScreen {
  const screen = startPuzzle(problem);
  if (typeof answer === 'string') {
    const parsed = parseNamedRelation(answer, _names ?? {});
    if (parsed.kind === 'syntax-error') {
      return {
        ...screen,
        input: { kind: 'expression', value: answer },
        submission: { kind: 'named-equation', input: answer },
        feedback: parsed,
      };
    }

    if (parsed.kind === 'unknown-identifier') {
      const available = parsed.availableIdentifiers.join(', ');
      return {
        ...screen,
        input: { kind: 'expression', value: answer },
        submission: { kind: 'named-equation', input: answer },
        feedback: {
          ...parsed,
          message: `${parsed.message} Available identifiers: ${available}.`,
        },
      };
    }

    if (parsed.kind === 'ambiguous-identifier') {
      return {
        ...screen,
        input: { kind: 'expression', value: answer },
        submission: { kind: 'named-equation', input: answer },
        feedback: parsed,
      };
    }

    if (parsed.kind === 'invalid-integer-literal') {
      return {
        ...screen,
        input: { kind: 'expression', value: answer },
        submission: { kind: 'named-equation', input: answer },
        feedback: parsed,
      };
    }

    const accepted =
      parsed.kind === 'success' &&
      relationsHaveNormalizedStructure(
        problem.relation,
        parsed.relation,
        namedEquationStructurePolicy,
      );

    return {
      ...screen,
      input: { kind: 'expression', value: answer },
      ...(parsed.kind === 'success'
        ? {
            submission: {
              kind: 'named-equation' as const,
              input: answer,
              relation: parsed.relation,
            },
          }
        : {
            submission: {
              kind: 'named-equation' as const,
              input: answer,
            },
          }),
      feedback: accepted
        ? {
            kind: 'accepted',
            message: 'The equation matches the quantity model.',
            checkPolicy: 'normalized-structure',
            equationSides: namedEquationStructurePolicy.equationSides,
          }
        : {
            kind: 'structural-mismatch',
            message: 'The equation grouping does not match the quantity model.',
            checkPolicy: 'normalized-structure',
            equationSides: namedEquationStructurePolicy.equationSides,
          },
    };
  }

  const accepted = relationsHaveSameStructure(problem.relation, answer);

  return {
    ...screen,
    submission: {
      kind: 'named-equation',
      relation: answer,
    },
    feedback: accepted
      ? {
          kind: 'accepted',
          message: 'The equation matches the quantity model.',
          checkPolicy: 'exact-structure',
          equationSides: 'ordered',
        }
      : {
          kind: 'structural-mismatch',
          message: 'The equation does not match the quantity model.',
          checkPolicy: 'exact-structure',
          equationSides: 'ordered',
        },
  };
}

function relationsHaveSameStructure(
  expected: Relation,
  actual: Relation,
): boolean {
  return (
    expressionsHaveSameStructure(expected.left, actual.left) &&
    expressionsHaveSameStructure(expected.right, actual.right)
  );
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
