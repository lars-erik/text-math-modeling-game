import type { LearnerNameSource } from '../named-expression';
import type { Problem } from '../problem-model/problem';
import type { NamedEquationChoice } from './learner-answer';

export type PuzzleDefinition = {
  problem: Problem;
  learnerNames: LearnerNameSource;
  choices: readonly NamedEquationChoice[];
};

export type PuzzleRegistry = Readonly<Record<string, PuzzleDefinition>>;

declare global {
  var mathModelingPuzzles: PuzzleRegistry | undefined;
}

export function findPuzzleDefinition(
  puzzleKey: string,
): PuzzleDefinition | undefined {
  return globalThis.mathModelingPuzzles?.[puzzleKey];
}
