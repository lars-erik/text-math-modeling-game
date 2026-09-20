import type { PuzzleLocale } from '../puzzle/lang';
import type { ThemeId } from '../themes';

// AppRoute is a discriminated union representing application state at the route level.
// It serves as the single source of truth for URL -> AppState mapping and transitions.
// This type lives in the composition/UI boundary, not in Problem/Theme/Mode semantics.

export type AppRoute =
  | { kind: 'home'; locale: PuzzleLocale }
  | { kind: 'puzzle'; seed: number; themeId: ThemeId; modeId: string; locale: PuzzleLocale }
  | { kind: 'session'; seed: number; themeId: ThemeId; locale: PuzzleLocale };

export type AppRouteKind = AppRoute['kind']; // 'home' | 'puzzle' | 'session'

// Parse search parameters into an AppRoute.
// This function is pure and framework-independent. It does not mutate DOM or document.
export function parseAppRoute(search: string): AppRoute {
  const params = new URLSearchParams(search);
  const sessionText = params.get('session');
  
  if (sessionText !== null) {
    // Backward-compatible: existing session URLs (M10 graybox sessions) still work
    return parseSessionRoute(sessionText, params);
  }
  
  const homeParam = params.get('home');
  if (homeParam === 'true' || homeParam === '') {
    // Home/Menu route - stable destination for new users
    return { kind: 'home', locale: parseLocale(params.get('locale')) };
  }
  
  // Backward-compatible: existing puzzle URLs continue to parse as puzzles
  return parsePuzzleRoute(params);
}

function parseSessionRoute(
  sessionText: string,
  params: URLSearchParams,
): AppRoute {
  const sessionSeed = parseInt(sessionText, 10);
  if (isNaN(sessionSeed) || sessionSeed < 0) {
    throw new Error(`Invalid session seed: ${sessionText}`);
  }
  
  return {
    kind: 'session',
    seed: sessionSeed,
    themeId: parseThemeId(params.get('scenario')) ?? 'gaming.drone-power',
    locale: parseLocale(params.get('locale')),
  };
}

function parsePuzzleRoute(params: URLSearchParams): AppRoute {
  const seedText = params.get('seed');
  const seed = seedText !== null ? parseInt(seedText, 10) : defaultPuzzleSeed;
  
  return {
    kind: 'puzzle',
    seed: seed,
    themeId: parseThemeId(params.get('scenario')) ?? 'gaming.drone-power',
    modeId: parseModeId(params.get('task')),
    locale: parseLocale(params.get('locale')),
  };
}

function parseLocale(localeText: string | null): PuzzleLocale {
  if (localeText === null || localeText === '') {
    return 'en';
  }
  // TODO: Add stricter validation with isPuzzleLocale after it's exported properly
  // For now, accept common locale identifiers and validate later
  const validLocales = ['en', 'nb'];
  if (!validLocales.includes(localeText)) {
    throw new Error(`Unknown locale: ${JSON.stringify(localeText)}.${JSON.stringify(validLocales)}.`);
  }
  return localeText as PuzzleLocale;
}

function parseThemeId(scenario: string | null): ThemeId | undefined {
  if (scenario === null || scenario === '') {
    return undefined; // Will default in caller
  }
  // Keep existing validation from application.ts - we could add here too later
  return scenario;
}

function parseModeId(task: string | null): string {
  if (task === null || task === '') {
    // Default to a reasonable mode for puzzles
    return 'story-to-quantities';
  }
  // TODO: Add mode validation here after modes export is available
  return task;
}

// Format an AppRoute into search string. Deterministic and replayable.
export function formatAppRoute(route: AppRoute): string {
  switch (route.kind) {
    case 'home':
      return `?home=true&locale=${route.locale}`;
    case 'puzzle':
    case 'session':
      const params = new URLSearchParams();
      if (route.kind === 'puzzle') {
        params.set('seed', String(route.seed));
        params.set('task', route.modeId);
      } else {
        params.set('session', String(route.seed));
      }
      params.set('scenario', route.themeId);
      params.set('locale', route.locale);
      return `?${params.toString()}`;
  }
}

// Type guards for discriminated union
export function isAppRoute(value: unknown): value is AppRoute {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('kind' in value && 'locale' in value)
  );
}

export function isHomeRoute(route: AppRoute): route is Extract<AppRoute, { kind: 'home' }> {
  return route.kind === 'home';
}

export function isPuzzleRoute(route: AppRoute): route is Extract<AppRoute, { kind: 'puzzle' }> {
  return route.kind === 'puzzle';
}

export function isSessionRoute(route: AppRoute): route is Extract<AppRoute, { kind: 'session' }> {
  return route.kind === 'session';
}

// Defaults for optional fields
export const defaultPuzzleSeed = 17;
