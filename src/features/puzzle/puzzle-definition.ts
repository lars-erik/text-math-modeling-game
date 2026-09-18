import type { LearnerNameSource } from '../named-expression';
import type { Problem } from '../problem-model/problem';
import type { NamedEquationChoice } from './learner-answer';
import type { PuzzleLocale } from './lang';
import type { StoryQuantitiesPuzzleDefinition } from './story-quantities';

export type PuzzleDefinition = {
  kind: 'quantities-to-named-equation' | 'story-to-quantities';
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
