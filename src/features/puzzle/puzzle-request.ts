import type { SupportedScenarioId } from './seeded-puzzle';

export const puzzleGenerationRequestEvent = 'puzzle-generation-request';

export type PuzzleGenerationRequest = {
  seed: number;
  scenarioId: SupportedScenarioId;
};
