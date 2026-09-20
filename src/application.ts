import {
  type PuzzleLocale,
} from './features/localization/locale';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from './features/puzzle/puzzle-request';
import { navigateHomeRequestEvent } from './features/navigation/navigation-request';
import { parseAppRoute as _parseAppRoute, formatAppRoute as _formatAppRoute, type AppRoute } from './features/app-routes/app-route-types';
import { type ThemeId } from './features/themes';
import { type ModeId } from './features/puzzle/modes';

export const defaultPuzzleSeed = 17;
export const defaultSessionSeed = 918273;

export type HomeApplicationState = {
  kind: 'home';
  locale: PuzzleLocale;
}

  export type PuzzleApplicationState = PuzzleSelectionRequest & {
  kind: 'puzzle';
};

export type SessionApplicationState = SessionSelectionRequest & {
  kind: 'session';
};

export type ApplicationState = PuzzleApplicationState | SessionApplicationState | HomeApplicationState;

// Internal routing helpers
function parseAppRoute(search: string): AppRoute {
  return _parseAppRoute(search);
}

function formatAppRoute(route: AppRoute): string {
  return _formatAppRoute(route);
}

// Helper to convert ApplicationState to AppRoute for URL formatting
export function toAppRoute(state: ApplicationState): AppRoute {
  if (state.kind === 'puzzle') {
    const argumentsMap = new Map<string, any>();
    argumentsMap.set('seed', state.seed.toString());
    argumentsMap.set('themeId', state.themeId);
    argumentsMap.set('modeId', state.modeId);
    return { kind: 'puzzle' as const, arguments: argumentsMap, locale: state.locale };
  } else if (state.kind === 'session') {
    const argumentsMap = new Map<string, any>();
    argumentsMap.set('seed', state.seed.toString());
    argumentsMap.set('themeId', state.themeId);
    return { kind: 'session' as const, arguments: argumentsMap, locale: state.locale };
  }
  // Fallback for home case
  return { kind: 'home' as const, arguments: new Map<string, any>(), locale: 'en' };
}

// Exported URL parsing/formatting functions for unit tests
export function parseApplicationState(search: string): ApplicationState {
  const route = parseAppRoute(search);
  
   if (route.kind === 'home') {
    return {
      kind: 'home',
      locale: route.locale,
    };
  }

  const seed = parseInt(route.arguments.get('seed')!, 10);
  if (isNaN(seed) || seed < 1) {
    throw new Error('Invalid seed: must be an unsigned 32-bit integer greater than 0');
  }

  if (route.kind === 'session') {
    return {
      kind: 'session',
      seed: seed,
      themeId: route.arguments.get('themeId') as ThemeId,
      locale: route.locale,
    };
  } else if (route.kind === 'puzzle') {
    return {
      kind: 'puzzle',
      seed: seed,
      themeId: route.arguments.get('themeId') as ThemeId,
      locale: route.locale,
      modeId: route.arguments.get('modeId') as ModeId,
    };
  }
  
  // Fallback to puzzle with defaults for empty/non-conforming URLs
  return {
    kind: 'puzzle',
    seed: defaultPuzzleSeed,
    themeId: 'gaming.drone-power' as ThemeId,
    locale: 'en',
    modeId: 'story-to-quantities',
  };
}

export function formatSearch(state: ApplicationState): string {
  if (state.kind === 'puzzle') {
    const argumentsMap = new Map<string, any>();
    argumentsMap.set('seed', state.seed.toString());
    argumentsMap.set('themeId', state.themeId);
    argumentsMap.set('modeId', state.modeId);
    argumentsMap.set('locale', state.locale);
    return formatAppRoute({ kind: 'puzzle' as const, arguments: argumentsMap, locale: state.locale });
  } else if (state.kind === 'session') {
    const argumentsMap = new Map<string, any>();
    argumentsMap.set('seed', state.seed.toString());
    argumentsMap.set('themeId', state.themeId);
    argumentsMap.set('locale', state.locale);
    return formatAppRoute({ kind: 'session' as const, arguments: argumentsMap, locale: state.locale });
  }
  // Default to session format for home case
  const homeArguments = new Map<string, any>();
  homeArguments.set('locale', 'en');
  return formatAppRoute({ kind: 'home' as const, arguments: homeArguments, locale: state.locale });
}

function parsePuzzleApplicationState(search: string): ApplicationState {
  return parseApplicationState(search);
}

export function startMathModelingApplication({
  search,
  root,
  replaceSearch,
}: {
  search: string;
  root: ParentNode;
  replaceSearch?: (search: string) => void;
}): void {
  // Convert parsed state to ApplicationState if needed
  const state = parseApplicationState(search);
  
  const puzzleElement = root.querySelector('math-modeling-puzzle');
  
  if(!puzzleElement) { throw new Error("No puzzle element" )};

  // Render home screen - clear all attributes and show menu placeholder
  const showHome = (locale: PuzzleLocale, updateSearch: boolean = true) => {
    puzzleElement?.removeAttribute('seed');
    puzzleElement?.removeAttribute('theme');
    puzzleElement?.removeAttribute('mode');
    puzzleElement?.setAttribute('session', String(defaultSessionSeed)); // Default session seed for home
    puzzleElement?.setAttribute('locale', locale);
    
    const searchStr = formatSearch(state);
    
    if (updateSearch) {
      replaceSearch?.(searchStr);
    }
  };
  
  const showPuzzle = (request: PuzzleSelectionRequest, updateSearch: boolean) => {
    puzzleElement?.setAttribute('seed', String(request.seed));
    puzzleElement?.setAttribute('theme', request.themeId);
    puzzleElement?.setAttribute('mode', request.modeId);
    puzzleElement?.setAttribute('locale', request.locale);
    
    if (updateSearch) {
      const argumentsMap = new Map<string, any>();
      argumentsMap.set('seed', request.seed.toString());
      argumentsMap.set('themeId', request.themeId);
      argumentsMap.set('modeId', request.modeId);
      argumentsMap.set('locale', request.locale);
      replaceSearch?.(formatAppRoute({ kind: 'puzzle' as const, arguments: argumentsMap, locale: request.locale }));
    }
  };
  
  const showSession = (request: SessionSelectionRequest, updateSearch: boolean) => {
    // Inline implementation: set attributes and update URL
    puzzleElement?.setAttribute('seed', String(request.seed));
    puzzleElement?.setAttribute('theme', request.themeId);
    puzzleElement?.setAttribute('locale', request.locale);
    puzzleElement?.setAttribute('mode', 'academic-notation');
    
    if (updateSearch) {
      const argumentsMap = new Map<string, any>();
      argumentsMap.set('seed', request.seed.toString());
      argumentsMap.set('themeId', request.themeId);
      argumentsMap.set('locale', request.locale);
      replaceSearch?.(formatAppRoute({ kind: 'session' as const, arguments: argumentsMap, locale: request.locale }));
    }
  };
  
  if (state.kind === 'session') {
    showSession(state, false);
  } else {
    if (state.kind === 'home') {
      // TODO: Swap out when we actually have a home view.
      showPuzzle({ seed: defaultPuzzleSeed, themeId: 'gaming.drone-power', modeId: 'story-to-quantities', locale: state.locale }, false);
    } else {
      showPuzzle(state, false);
    }
  }
  
  puzzleElement?.addEventListener(puzzleSelectionRequestEvent, (ev: Event) => showPuzzle((ev as CustomEvent<PuzzleSelectionRequest>).detail, true));
  puzzleElement?.addEventListener(sessionSelectionRequestEvent, (ev: Event) => showSession((ev as CustomEvent<SessionSelectionRequest>).detail, true));

  puzzleElement?.addEventListener(navigateHomeRequestEvent, () => {
    // Navigate to home with default locale
    showHome('en', true);
  });
}
