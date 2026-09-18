import type { PuzzleRegistry } from './features/puzzle/puzzle-definition';
import {
  puzzleGenerationRequestEvent,
  type PuzzleGenerationRequest,
} from './features/puzzle/puzzle-request';
import { referencePuzzle } from './features/puzzle/reference-puzzle';
import {
  createSeededPuzzle,
  isSupportedScenarioId,
  type SupportedScenarioId,
} from './features/puzzle/seeded-puzzle';
import {
  defaultTotalFromPartsConcepts,
  maximumTotalFromPartsSeed,
} from './features/problem-generation/generate-total-from-parts';

export const generatedPuzzleKey = 'generated';
export const defaultPuzzleSeed = 17;

export function startMathModelingApplication({
  search,
  root,
  replaceSearch,
}: {
  search: string;
  root: ParentNode;
  replaceSearch?: (search: string) => void;
}): void {
  const puzzleElement = root.querySelector('math-modeling-puzzle');
  let puzzleRevision = 0;

  const showPuzzle = (
    request: PuzzleGenerationRequest,
    updateSearch: boolean,
  ) => {
    const registry: Record<string, PuzzleRegistry[string]> = {
      reference: referencePuzzle,
      [generatedPuzzleKey]: createSeededPuzzle({
        ...request,
        concepts: defaultTotalFromPartsConcepts,
      }),
    };
    globalThis.mathModelingPuzzles = registry;
    puzzleElement?.setAttribute('puzzle', generatedPuzzleKey);
    puzzleElement?.setAttribute(
      'puzzle-revision',
      String(++puzzleRevision),
    );

    if (updateSearch) {
      replaceSearch?.(formatSearch(request));
    }
  };

  showPuzzle(parseGenerationRequest(search), false);
  puzzleElement?.addEventListener(puzzleGenerationRequestEvent, (event) => {
    showPuzzle((event as CustomEvent<PuzzleGenerationRequest>).detail, true);
  });
}

function parseGenerationRequest(search: string): PuzzleGenerationRequest {
  const parameters = new URLSearchParams(search);
  const seedText = parameters.get('seed');
  const scenarioText = parameters.get('scenario');

  return {
    seed: seedText === null ? defaultPuzzleSeed : parseSeed(seedText),
    scenarioId: parseScenarioId(scenarioText),
  };
}

function parseSeed(seedText: string): number {
  if (!/^(0|[1-9]\d*)$/.test(seedText)) {
    throw new Error('URL seed must be an unsigned 32-bit decimal integer.');
  }

  const seed = Number(seedText);
  if (!Number.isSafeInteger(seed) || seed > maximumTotalFromPartsSeed) {
    throw new Error('URL seed must be an unsigned 32-bit decimal integer.');
  }
  return seed;
}

function parseScenarioId(value: string | null): SupportedScenarioId {
  if (value === null) {
    return 'gaming.drone-power';
  }
  if (!isSupportedScenarioId(value)) {
    throw new Error(`Unknown scenario ${JSON.stringify(value)}.`);
  }
  return value;
}

function formatSearch(request: PuzzleGenerationRequest): string {
  const parameters = new URLSearchParams({
    seed: String(request.seed),
    scenario: request.scenarioId,
  });
  return `?${parameters.toString()}`;
}
