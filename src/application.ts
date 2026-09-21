import { startAppController, type AppController, type Destination } from './features/navigation/app-controller';
import { browserHistoryAdapter, type HistoryAdapter } from './features/navigation/history-adapter';
import type { Route } from './features/navigation/hash-route';
import {
  homeSelectionFromRoute,
  puzzleSelectionFromRoute,
  routeFromHomeSelection,
  routeFromPuzzleSelection,
  routeFromSessionSelection,
  sessionSelectionFromRoute,
  type HomeSelection,
} from './features/navigation/app-destinations';
import {
  navigateHomeRequestEvent,
  navigatePuzzleRequestEvent,
  navigateResumeSessionRequestEvent,
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
import {
  defaultProblemFamilyId,
  isProblemFamilyId,
  type ProblemFamilyId,
} from './features/problem-generation/problem-families';
import type { PuzzleLocale } from './features/localization/locale';
import {
  createSessionRunStore,
  type SessionRunStore,
} from './features/session/session-run-store';
import { createInMemorySessionPersistence } from './features/session/persistence/in-memory-session-repository';
import type { HomeSessionRunsView } from './features/navigation/session-runs-view';

export const defaultPuzzleSeed = 17;
export const defaultProblemFamily: ProblemFamilyId = defaultProblemFamilyId;
export const defaultSessionSeed = 918273;
export const defaultThemeId: ThemeId = 'gaming.drone-power';
export const defaultModeId: ModeId = 'story-to-quantities';

type PuzzleAttributes = {
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  startSessionFromStore?: () => void;
  hidden: boolean;
};

type HomeAttributes = {
  setAttribute: (name: string, value: string) => void;
  setHiddenRuns: (view: HomeSessionRunsView) => void;
  hidden: boolean;
};

export type ApplicationOptions = {
  hash: string;
  root: {
    querySelector: (selector: string) => unknown;
    addEventListener: (
      type: string,
      listener: (event: unknown) => void,
    ) => void;
  };
  getHash?: () => string;
  basePath?: string;
  history?: HistoryAdapter;
  sessionRunStore?: SessionRunStore;
  defaultRunId?: string;
};

export function puzzleDestination(element: PuzzleAttributes): Destination {
  return {
    view: element,
    apply: (route: Route) => {
      const selection = puzzleSelectionFromRoute(route);
      element.setAttribute('seed', String(selection.seed));
      element.setAttribute('family', selection.familyId);
      element.setAttribute('theme', selection.themeId);
      element.setAttribute('mode', selection.modeId);
      element.setAttribute('locale', selection.locale);
      element.removeAttribute('session');
    },
  };
}

export function sessionDestination(element: PuzzleAttributes): Destination {
  return {
    view: element,
    apply: (route: Route) => {
      const selection = sessionSelectionFromRoute(route);
      element.setAttribute('session', String(selection.seed));
      element.setAttribute('theme', selection.themeId);
      element.setAttribute('locale', selection.locale);
      element.removeAttribute('seed');
      element.removeAttribute('mode');
      element.removeAttribute('family');
    },
  };
}

export function homeDestination(
  element: HomeAttributes,
  sessionRuns: () => HomeSessionRunsView,
): Destination {
  return {
    view: element,
    apply: (route: Route) => {
      const selection: HomeSelection = homeSelectionFromRoute(route);
      element.setAttribute('locale', selection.language);
      element.setHiddenRuns(sessionRuns());
    },
  };
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
  const homeElement = options.root.querySelector(
    'home-screen',
  ) as HomeAttributes | null;
  const puzzleElement = options.root.querySelector(
    'math-modeling-puzzle',
  ) as PuzzleAttributes | null;
  if (homeElement === null || puzzleElement === null) {
    throw new Error(
      'The application root must contain home-screen and math-modeling-puzzle elements.',
    );
  }

  const sessionRunStore =
    options.sessionRunStore ??
    createSessionRunStore({
      ...createInMemorySessionPersistence(),
      runIdMemory: {
        get: () => options.defaultRunId,
        set: () => undefined,
      },
    });

  const sessionRuns = () => {
    const active = sessionRunStore.resumeActiveRun();
    return {
      activeRun:
        active === undefined
          ? undefined
          : {
              seed: active.replay.seed,
              position: active.position,
              total: active.total,
            },
      completedRuns: sessionRunStore.completedRuns().map((run) => ({
        runId: run.runId,
        seed: run.seed,
        total: run.total,
      })),
    };
  };

  const controller = startAppController({
    initialHash: options.hash,
    getHash: options.getHash ?? (() => globalThis.location.hash),
    basePath: options.basePath ?? globalThis.location.pathname,
    history,
    destinations: {
      home: homeDestination(homeElement, sessionRuns),
      puzzle: puzzleDestination(puzzleElement),
      session: sessionDestination(puzzleElement),
    },
  });
  (puzzleElement as { sessionRunStore?: SessionRunStore }).sessionRunStore =
    sessionRunStore;

  const currentLanguage = (): PuzzleLocale => {
    const language = controller.currentRoute().routeParams.get('language');
    return language === 'nb' ? 'nb' : 'en';
  };

  const navigateSafely = (build: () => Route): void => {
    try {
      controller.navigate(build());
    } catch {
      return;
    }
  };

  options.root.addEventListener(puzzleSelectionRequestEvent, (event) => {
    navigateSafely(() =>
      routeFromPuzzleSelection(
        (event as CustomEvent<PuzzleSelectionRequest>).detail,
      ),
    );
  });
  options.root.addEventListener(sessionSelectionRequestEvent, (event) => {
    navigateSafely(() =>
      routeFromSessionSelection(
        (event as CustomEvent<SessionSelectionRequest>).detail,
      ),
    );
  });
  options.root.addEventListener(navigateHomeRequestEvent, () => {
    navigateSafely(() =>
      routeFromHomeSelection({ language: currentLanguage() }),
    );
  });
  options.root.addEventListener(navigatePuzzleRequestEvent, (event) => {
    const detail = (event as CustomEvent<NavigatePuzzleRequest>).detail;
    navigateSafely(() =>
      routeFromPuzzleSelection({
        seed: detail?.seed ?? defaultPuzzleSeed,
        familyId: familyIdOrThrow(detail?.familyId ?? defaultProblemFamily),
        themeId: themeIdOrThrow(detail?.themeId ?? defaultThemeId),
        modeId: modeIdOrThrow(detail?.modeId ?? defaultModeId),
        locale: currentLanguage(),
      }),
    );
  });
  options.root.addEventListener(navigateSessionRequestEvent, (event) => {
    const detail = (event as CustomEvent<NavigateSessionRequest>).detail;
    try {
      const selection = {
        seed: detail?.seed ?? defaultSessionSeed,
        themeId: themeIdOrThrow(detail?.themeId ?? defaultThemeId),
        locale: currentLanguage(),
      };
      sessionRunStore.start(selection);
      navigateSafely(() => routeFromSessionSelection(selection));
      puzzleElement.startSessionFromStore?.();
    } catch {
      return;
    }
  });
  options.root.addEventListener(navigateResumeSessionRequestEvent, () => {
    const resumed = sessionRunStore.resumeActiveRun();
    if (resumed === undefined) {
      return;
    }
    navigateSafely(() =>
      routeFromSessionSelection({
        seed: resumed.replay.seed,
        themeId: resumed.replay.themeId,
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

function familyIdOrThrow(value: string): ProblemFamilyId {
  if (!isProblemFamilyId(value)) {
    throw new Error(`Unknown problem family ${JSON.stringify(value)}.`);
  }
  return value;
}

function modeIdOrThrow(value: string): ModeId {
  if (!isModeId(value)) {
    throw new Error(`Unknown puzzle task ${JSON.stringify(value)}.`);
  }
  return value;
}
