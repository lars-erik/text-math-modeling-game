import type { LearnerNameSource } from '../named-expression';
import type { Problem } from '../problem-model/problem';
import type { NamedEquationChoice } from './learner-answer';
import type { PuzzleLocale } from './lang';
import type { StoryQuantitiesPuzzleDefinition } from './story-quantities';

export type ModelingCase = {
  problem: Problem;
  learnerNames: LearnerNameSource;
  choices: readonly NamedEquationChoice[];
  storySeed?: number;
  storyQuantities?: {
    createDefinition: (locale: PuzzleLocale) => StoryQuantitiesPuzzleDefinition;
  };
  namedEquation?: {
    createDefinition: (locale: PuzzleLocale) => NamedEquationLocaleDefinition;
  };
};

export const puzzleTasks = [
  'story-to-quantities',
  'quantities-to-named-equation',
] as const;

export type PuzzleTask = (typeof puzzleTasks)[number];

export function isPuzzleTask(value: string): value is PuzzleTask {
  return puzzleTasks.some((task) => task === value);
}

export type PuzzleDefinition = {
  task: PuzzleTask;
  modelingCase: ModelingCase;
};

export function createPuzzle(
  modelingCase: ModelingCase,
  task: PuzzleTask,
): PuzzleDefinition {
  return { task, modelingCase };
}

export type NamedEquationLocaleDefinition = {
  learnerNames: LearnerNameSource;
  quantityNames: Readonly<Record<string, string>>;
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
