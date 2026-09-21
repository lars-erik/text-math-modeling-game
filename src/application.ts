import { startAppController, type AppController } from './features/navigation/app-controller';
import { browserHistoryAdapter, type HistoryAdapter } from './features/navigation/history-adapter';
import type { Route } from './features/navigation/hash-route';
import {
  homeSelectionFromRoute,
  puzzleSelectionFromRoute,
  routeFromHomeSelection,
  routeFromPuzzleSelection,
  routeFromSessionSelection,
  sessionSelectionFromRoute,
} from './features/navigation/app-destinations';
import {
  navigateHomeRequestEvent,
  navigatePuzzleRequestEvent,
  navigateSessionRequestEvent,
  type NavigatePuzzleRequest,
  type NavigateSessionRequest,
} from './features/navigation/navigation-request';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from './features/puzzle/puzzle-request';
import { isThemeId, type ThemeId } from './features/themes';
import { isModeId, type ModeId } from './features/puzzle/modes';
import type { PuzzleLocale } from './features/localization/locale';

export const defaultPuzzleSeed = 17;
export const defaultSessionSeed = 918273;
export const defaultThemeId: ThemeId = 'gaming.drone-power';
export const defaultModeId: ModeId = 'story-to-quantities';

export const appViews = {
  home: {
    tagName: 'home-screen',
    attributeByParam: { language: 'locale' },
  },
  puzzle: {
    tagName: 'math-modeling-puzzle',
    attributeByParam: {
      seed: 'seed',
      scenario: 'theme',
      task: 'mode',
      language: 'locale',
    },
  },
  session: {
    tagName: 'math-modeling-puzzle',
    attributeByParam: {
      seed: 'session',
      scenario: 'theme',
      language: 'locale',
    },
  },
} as const;

export type ApplicationOptions = {
  hash: string;
  root: ParentNode;
  getHash?: () => string;
  basePath?: string;
  history?: HistoryAdapter;
};

export function validateAppRoute(route: Route): void {
  if (route.name === 'home') {
    homeSelectionFromRoute(route);
  } else if (route.name === 'puzzle') {
    puzzleSelectionFromRoute(route);
  } else if (route.name === 'session') {
    sessionSelectionFromRoute(route);
  }
}

export function startMathModelingApplication(
  options: ApplicationOptions,
): AppController {
  const history =
    options.history ??
    browserHistoryAdapter({
      history: globalThis.history,
      window: globalThis,
    });
  const controller = startAppController({
    initialHash: options.hash,
    getHash: options.getHash ?? (() => globalThis.location.hash),
    basePath: options.basePath ?? globalThis.location.pathname,
    root: options.root,
    history,
    views: appViews,
    validateRoute: validateAppRoute,
  });

  const currentLanguage = (): PuzzleLocale => {
    const language = controller.currentRoute().routeParams.get('language');
    return language === 'nb' ? 'nb' : 'en';
  };

  const { root } = options;

  const navigateSafely = (route: Route): void => {
    try {
      controller.navigate(route);
    } catch {
      return;
    }
  };

  root.addEventListener(puzzleSelectionRequestEvent, (event) => {
    navigateSafely(
      routeFromPuzzleSelection((event as CustomEvent<PuzzleSelectionRequest>).detail),
    );
  });
  root.addEventListener(sessionSelectionRequestEvent, (event) => {
    navigateSafely(
      routeFromSessionSelection((event as CustomEvent<SessionSelectionRequest>).detail),
    );
  });
  root.addEventListener(navigateHomeRequestEvent, () => {
    navigateSafely(routeFromHomeSelection({ language: currentLanguage() }));
  });
  root.addEventListener(navigatePuzzleRequestEvent, (event) => {
    const detail = (event as CustomEvent<NavigatePuzzleRequest>).detail;
    navigateSafely(
      routeFromPuzzleSelection({
        seed: detail?.seed ?? defaultPuzzleSeed,
        themeId: themeIdOrThrow(detail?.themeId ?? defaultThemeId),
        modeId: modeIdOrThrow(detail?.modeId ?? defaultModeId),
        locale: currentLanguage(),
      }),
    );
  });
  root.addEventListener(navigateSessionRequestEvent, (event) => {
    const detail = (event as CustomEvent<NavigateSessionRequest>).detail;
    navigateSafely(
      routeFromSessionSelection({
        seed: detail?.seed ?? defaultSessionSeed,
        themeId: themeIdOrThrow(detail?.themeId ?? defaultThemeId),
        locale: currentLanguage(),
      }),
    );
  });

  return controller;
}

function themeIdOrThrow(value: string): ThemeId {
  if (!isThemeId(value)) {
    throw new Error(`Unknown scenario ${JSON.stringify(value)}.`);
  }
  return value;
}

function modeIdOrThrow(value: string): ModeId {
  if (!isModeId(value)) {
    throw new Error(`Unknown puzzle task ${JSON.stringify(value)}.`);
  }
  return value;
}
