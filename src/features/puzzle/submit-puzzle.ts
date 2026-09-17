import type { Expression, Relation } from '../problem-model/expression';
import type { Problem } from '../problem-model/problem';
import { startPuzzle, type PuzzleScreen } from './start-puzzle';

export function submitPuzzle(
  problem: Problem,
  answer: Relation,
): PuzzleScreen {
  const screen = startPuzzle(problem);
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
        }
      : {
          kind: 'structural-mismatch',
          message: 'The equation does not match the quantity model.',
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
