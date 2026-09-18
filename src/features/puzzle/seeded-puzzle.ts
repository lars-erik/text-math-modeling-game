import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
  type TotalFromPartsGenerationConfig,
} from '../problem-generation/generate-total-from-parts';
import type { PuzzleDefinition } from './puzzle-definition';
import { referencePuzzle } from './reference-puzzle';

export function createSeededPuzzle({
  seed,
  config = defaultTotalFromPartsGenerationConfig,
}: {
  seed: number;
  config?: TotalFromPartsGenerationConfig;
}): PuzzleDefinition {
  const generated = generateTotalFromPartsCase({ seed, config });

  return {
    problem: generated.problem,
    learnerNames: referencePuzzle.learnerNames,
    choices: referencePuzzle.choices,
  };
}
