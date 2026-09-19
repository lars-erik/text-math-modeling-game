import {
  createPuzzle,
  isPuzzleTask,
  type ModelingCase,
  type PuzzleRegistry,
  type PuzzleTask,
} from './features/puzzle/puzzle-definition';
import {
  isPuzzleLocale,
  type PuzzleLocale,
} from './features/puzzle/lang';
import {
  puzzleSelectionRequestEvent,
  type PuzzleSelectionRequest,
} from './features/puzzle/puzzle-request';
import { referencePuzzle } from './features/puzzle/reference-puzzle';
import {
  createSeededModelingCase,
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
  let modelingCase: ModelingCase | undefined;
  let modelingCaseKey = '';

  const showPuzzle = (
    request: PuzzleSelectionRequest,
    updateSearch: boolean,
  ) => {
    const requestedCaseKey = `${request.seed}:${request.scenarioId}`;
    if (modelingCase === undefined || modelingCaseKey !== requestedCaseKey) {
      modelingCase = createSeededModelingCase({
        seed: request.seed,
        scenarioId: request.scenarioId,
        concepts: defaultTotalFromPartsConcepts,
      });
      modelingCaseKey = requestedCaseKey;
    }

    const registry: Record<string, PuzzleRegistry[string]> = {
      reference: referencePuzzle,
      [generatedPuzzleKey]: createPuzzle(modelingCase, request.task),
    };
    globalThis.mathModelingPuzzles = registry;
    puzzleElement?.setAttribute('puzzle', generatedPuzzleKey);
    puzzleElement?.setAttribute('locale', request.locale);
    puzzleElement?.setAttribute(
      'puzzle-revision',
      String(++puzzleRevision),
    );

    if (updateSearch) {
      replaceSearch?.(formatSearch(request));
    }
  };

  showPuzzle(parseApplicationState(search), false);
  puzzleElement?.addEventListener(puzzleSelectionRequestEvent, (event) => {
    showPuzzle((event as CustomEvent<PuzzleSelectionRequest>).detail, true);
  });
}

export type ApplicationState = PuzzleSelectionRequest;

export function parseApplicationState(search: string): ApplicationState {
  const parameters = new URLSearchParams(search);
  const seedText = parameters.get('seed');
  const scenarioText = parameters.get('scenario');
  const taskText = parameters.get('task');
  const localeText = parameters.get('locale');

  return {
    seed: seedText === null ? defaultPuzzleSeed : parseSeed(seedText),
    scenarioId: parseScenarioId(scenarioText),
    task: parseTask(taskText),
    locale: parseLocale(localeText),
  };
}

function parseTask(value: string | null): PuzzleTask {
  if (value === null) {
    return 'story-to-quantities';
  }
  if (!isPuzzleTask(value)) {
    throw new Error(`Unknown puzzle task ${JSON.stringify(value)}.`);
  }
  return value;
}

function parseLocale(value: string | null): PuzzleLocale {
  if (value === null) {
    return 'en';
  }
  if (!isPuzzleLocale(value)) {
    throw new Error(`Unknown locale ${JSON.stringify(value)}.`);
  }
  return value;
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

function formatSearch(request: PuzzleSelectionRequest): string {
  const parameters = new URLSearchParams({
    seed: String(request.seed),
    scenario: request.scenarioId,
    task: request.task,
    locale: request.locale,
  });
  return `?${parameters.toString()}`;
}
