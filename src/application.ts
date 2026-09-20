import {
  isPuzzleLocale,
  type PuzzleLocale,
} from './features/localization/locale';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from './features/puzzle/puzzle-request';
import { navigateHomeRequestEvent } from './features/navigation/navigation-request';
import { parseAppRoute, formatAppRoute, isSessionRoute, type AppRoute } from './features/app-routes/app-route-types';
import { isThemeId, type ThemeId } from './features/themes';
import { isModeId, type ModeId } from './features/puzzle/modes';
import { maximumTotalFromPartsSeed } from './features/problem-generation/generate-total-from-parts';

export const defaultPuzzleSeed = 17;
export const defaultSessionSeed = 918273;

export type PuzzleApplicationState = PuzzleSelectionRequest & {
  kind: 'puzzle';
};

export type SessionApplicationState = SessionSelectionRequest & {
  kind: 'session';
};

export type ApplicationState = PuzzleApplicationState | SessionApplicationState;

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
  
  // Render home screen - clear all attributes and show menu placeholder
  const showHome = (locale?: PuzzleLocale, updateSearch: boolean = true) => {
    if (!locale) locale = 'en';
    
    puzzleElement?.removeAttribute('seed');
    puzzleElement?.removeAttribute('theme');
    puzzleElement?.removeAttribute('mode');
    puzzleElement?.removeAttribute('session');
    puzzleElement?.setAttribute('locale', locale);
    
    if (updateSearch) {
      replaceSearch?.(`?home=true&locale=${locale}`);
    }
  };
  
  const showPuzzle = (
    request: PuzzleSelectionRequest,
    updateSearch: boolean,
  ) => {
    puzzleElement?.setAttribute('seed', String(request.seed));
    puzzleElement?.setAttribute('theme', request.themeId);
    puzzleElement?.setAttribute('mode', request.modeId);
    puzzleElement?.setAttribute('locale', request.locale);
    puzzleElement?.removeAttribute('session');
    if (updateSearch) {
      replaceSearch?.(formatPuzzleSearch(request));
    }
  };
  const showSession = (
    request: SessionSelectionRequest,
    updateSearch: boolean,
  ) => {
    puzzleElement?.setAttribute('session', String(request.seed));
    puzzleElement?.setAttribute('theme', request.themeId);
    puzzleElement?.setAttribute('locale', request.locale);
    puzzleElement?.removeAttribute('mode');
    if (updateSearch) {
      replaceSearch?.(formatSessionSearch(request));
    }
  };
  const state = parseApplicationState(search);
  if (state.kind === 'session') {
    showSession(state, false);
  } else {
    showPuzzle(state, false);
  }
  puzzleElement?.addEventListener(puzzleSelectionRequestEvent, (event) => {
    showPuzzle((event as CustomEvent<PuzzleSelectionRequest>).detail, true);
  });
  puzzleElement?.addEventListener(sessionSelectionRequestEvent, (event) => {
    showSession((event as CustomEvent<SessionSelectionRequest>).detail, true);
  });
  puzzleElement?.addEventListener(navigateHomeRequestEvent, () => {
    // Parse current route to preserve locale when going home
    const appRoute = parseAppRoute(search);
    showHome(appRoute.locale);
  });
  
  // Check initial state - if URL indicates home, render home screen immediately
  const paramSearch = new URLSearchParams(search);
  const localeParam = paramSearch.get('locale');
  const hasSeed = paramSearch.has('seed');
  
  // Home route is: ?home=true&locale=X OR just locale without seed (not puzzle)
  if ((paramSearch.get('home') === 'true' || (!hasSeed && localeParam)) && localeParam !== null) {
    showHome(localeParam as PuzzleLocale);
  } else if (localeParam === null) {
    // No locale in URL - use default
    const defaultLocale: PuzzleLocale = 'en';
    showHome(defaultLocale, false);
  }
}

export function parseApplicationState(search: string): ApplicationState {
  const parameters = new URLSearchParams(search);
  const sessionText = parameters.get('session');
  if (sessionText !== null) {
    return {
      kind: 'session',
      seed: parseSeed(sessionText),
      themeId: parseThemeId(parameters.get('scenario')),
      locale: parseLocale(parameters.get('locale')),
    };
  }
  return {
    kind: 'puzzle',
    seed: parseOptionalSeed(parameters.get('seed')),
    themeId: parseThemeId(parameters.get('scenario')),
    modeId: parseModeId(parameters.get('task')),
    locale: parseLocale(parameters.get('locale')),
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

function parseOptionalSeed(seedText: string | null): number {
  if (seedText === null) {
    return defaultPuzzleSeed;
  }
  return parseSeed(seedText);
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

export function formatSearch(request: ApplicationState): string {
  return request.kind === 'session'
    ? formatSessionSearch(request)
    : formatPuzzleSearch(request);
}

export function formatPuzzleSearch(request: PuzzleSelectionRequest): string {
  const parameters = new URLSearchParams({
    seed: String(request.seed),
    scenario: request.themeId,
    task: request.modeId,
    locale: request.locale,
  });
  return `?${parameters.toString()}`;
}

export function formatSessionSearch(request: SessionSelectionRequest): string {
  const parameters = new URLSearchParams({
    session: String(request.seed),
    scenario: request.themeId,
    locale: request.locale,
  });
  return `?${parameters.toString()}`;
}
