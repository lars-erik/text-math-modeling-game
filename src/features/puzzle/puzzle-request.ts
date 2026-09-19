import type { PuzzleLocale } from './lang';
import type { PuzzleTask } from './puzzle-definition';
import type { SupportedScenarioId } from './seeded-puzzle';

export const puzzleSelectionRequestEvent = 'puzzle-selection-request';

export type PuzzleSelectionRequest = {
  seed: number;
  scenarioId: SupportedScenarioId;
  task: PuzzleTask;
  locale: PuzzleLocale;
};
