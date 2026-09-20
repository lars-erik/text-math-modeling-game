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
import { parseAppRoute, formatAppRoute, isSessionRoute } from './features/app-routes/app-route-types';
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
  const showHome = (locale: PuzzleLocale, updateSearch: boolean = true) => {
    puzzleElement?.removeAttribute('seed');
    puzzleElement?.removeAttribute('theme');
    puzzleElement?.removeAttribute('mode');
    puzzleElement?.setAttribute('session', String(defaultSessionSeed)); // Default session seed for home
    puzzleElement?.setAttribute('locale', locale);
    
    if (updateSearch) {
      replaceSearch?.(formatAppRoute({ kind: 'home', locale }));
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
      replaceSearch?.(formatAppRoute(request));
    }
  };
  
  const showSession = (
    request: SessionSelectionRequest,
    updateSearch: boolean,
  ) => {
    puzzleElement?.setAttribute('session', String(request.seed));
    puzzleElement?.setAttribute('theme', request.themeId);
    puzzleElement?.setAttribute('locale', request.locale);
    puzzleElement?.setAttribute('mode', 'academic-notation'); // academic notation for sessions
    if (updateSearch) {
      replaceSearch?.(formatAppRoute(request as unknown as AppRoute));
    }
  };
  
  const state = parsePuzzleApplicationState(search);
  if (state.kind === 'session') {
    showSession(state, false);
  } else {
    showPuzzle(state, false);
  }
  
  puzzleElement?.addEventListener(navigateHomeRequestEvent, () => {
    // Navigate to home preserving locale from current app state
    const paramSearch = new URLSearchParams(search);
    const localeParam = paramSearch.get('locale');
    if (localeParam) {
      showHome(localeParam as PuzzleLocale);
    } else {
      showHome('en');
    }
  });
  
  puzzleElement?.addEventListener(puzzleSelectionRequestEvent, (event) => {
    const request = event.detail;
    if (isSessionRoute(request)) {
      showSession(request, true);
    } else {
      showPuzzle(request, true);
    }
  });
  
  puzzleElement?.addEventListener(sessionSelectionRequestEvent, (event) => {
    const request = event.detail;
    showSession(<SessionSelectionRequest>request, true);
  });
}

function parsePuzzleApplicationState(search: string): ApplicationState {
  const params = new URLSearchParams(search);
  
  // Check for existing session URLs (backward compatible)
  const sessionText = params.get('session');
  if (sessionText !== null) {
    return {
      kind: 'session',
      seed: parseInt(sessionText, 10),
      themeId: <ThemeId>(params.get('scenario') || 'gaming.drone-power'),
      locale: <PuzzleLocale>(params.get('locale') ?? 'en'),
    };
  }
  
  // Check for home route
  if (params.has('home')) {
    return {
      kind: 'session', // Home is treated as a valid state (though technically it's not in Problem)
      seed: -1, // Placeholder value
      themeId: 'gaming.drone-power',
      locale: <PuzzleLocale>(params.get('locale')),
    };
  }
  
  return parsePuzzleSelectionRequest(params);
}

function parsePuzzleSelectionRequest(params: URLSearchParams): PuzzleSelectionRequest {
  const seed = params.has('seed') 
    ? parseInt(params.get('seed'), 10) || defaultPuzzleSeed
    : defaultPuzzleSeed;
  
  return {
    kind: 'puzzle',
    seed,
    themeId: <ThemeId>params.get('scenario') ?? 'gaming.drone-power',
    locale: params.has('locale') ? <PuzzleLocale>params.get('locale') : 'en' as PuzzleLocale,
    modeId: <ModeId>params.get('task') || 'story-to-quantities',
  };
}
