import { isPuzzleLocale, type PuzzleLocale } from './features/puzzle/lang';
import {
  puzzleSelectionRequestEvent,
  type PuzzleSelectionRequest,
} from './features/puzzle/puzzle-request';
import { isThemeId, type ThemeId } from './features/themes';
import { isModeId, type ModeId } from './features/puzzle/modes';
import { maximumTotalFromPartsSeed } from './features/problem-generation/generate-total-from-parts';

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
  const showPuzzle = (request: PuzzleSelectionRequest, updateSearch: boolean) => {
    puzzleElement?.setAttribute('seed', String(request.seed));
    puzzleElement?.setAttribute('theme', request.themeId);
    puzzleElement?.setAttribute('mode', request.modeId);
    puzzleElement?.setAttribute('locale', request.locale);
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
  const themeText = parameters.get('scenario');
  const modeText = parameters.get('task');
  const localeText = parameters.get('locale');
  return {
    seed: seedText === null ? defaultPuzzleSeed : parseSeed(seedText),
    themeId: parseThemeId(themeText),
    modeId: parseModeId(modeText),
    locale: parseLocale(localeText),
  };
}

function parseModeId(value: string | null): ModeId {
  if (value === null) {
    return 'story-to-quantities';
  }
  if (!isModeId(value)) {
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

function parseThemeId(value: string | null): ThemeId {
  if (value === null) {
    return 'gaming.drone-power';
  }
  if (!isThemeId(value)) {
    throw new Error(`Unknown scenario ${JSON.stringify(value)}.`);
  }
  return value;
}

export function formatSearch(request: PuzzleSelectionRequest): string {
  const parameters = new URLSearchParams({
    seed: String(request.seed),
    scenario: request.themeId,
    task: request.modeId,
    locale: request.locale,
  });
  return `?${parameters.toString()}`;
}
