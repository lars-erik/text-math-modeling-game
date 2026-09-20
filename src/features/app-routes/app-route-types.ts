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
// Backward compatible with existing ?key=value URLs from M10 graybox sessions.
export function parseAppRoute(search: string): AppRoute {
  const params = new URLSearchParams(search);
  
  // Check for session parameter (backward compatible)
  const sessionText = params.get('session');
  if (sessionText !== null) {
    const sessionSeed = parseInt(sessionText, 10);
    if (!isNaN(sessionSeed) && sessionSeed >= 0) {
      return {
        kind: 'session',
        seed: sessionSeed,
        themeId: parseThemeId(params.get('scenario')) ?? 'gaming.drone-power',
        locale: parseLocale(params.get('locale')),
      };
    }
  }
  
  // Check for home parameter (backward compatible)
  const homeParam = params.get('home');
  if (homeParam === 'true' || homeParam === '') {
    return { kind: 'home', locale: parseLocale(params.get('locale')) };
  }
  
  // Default to puzzle parsing with all query params
  return parsePuzzleRoute(params);
}

// Parse legacy session routes from existing M10 graybox sessions
function parseSessionRoute(search: string): AppRoute {
  const params = new URLSearchParams(search);
  const sessionText = params.get('session');
  
  if (sessionText === null) {
    throw new Error(`No session parameter in route string: ${search}`);
  }
  
  try {
    return {
      kind: 'session',
      seed: parseInt(sessionText, 10),
      themeId: parseThemeId(params.get('scenario')),
      locale: parseLocale(params.get('locale')),
    };
  } catch {
    throw new Error(`Could not parse session value: ${sessionText}`);
  }
}

// Parse legacy puzzle routes with all backward-compatible params
function parsePuzzleRoute(params: URLSearchParams): AppRoute {
  const seedText = params.get('seed');
  const seed = seedText !== null ? parseInt(seedText, 10) : 17; // default puzzle seed
  
  return {
    kind: 'puzzle',
    seed,
    themeId: parseThemeId(params.get('scenario')),
    modeId: parseModeId(params.get('task')),
    locale: parseLocale(params.get('locale')),
  };
}

// Parse locale from query param - backward compatible with all existing URLs
function parseLocale(localeText: string | null): PuzzleLocale {
  if (!localeText || localeText === '') {
    return 'en'; // default locale
  }
  
  const validLocales = ['en', 'nb'];
  if (validLocales.includes(localeText)) {
    return localeText as PuzzleLocale;
  }
  
  throw new Error(`Unknown locale: ${JSON.stringify(localeText)}.${JSON.stringify(validLocales)}`);
}

// Parse theme ID from scenario param
function parseThemeId(scenario: string | null): ThemeId {
  if (!scenario || scenario.trim() === '') {
    return 'gaming.drone-power'; // default theme
  }
  return scenario as ThemeId;
}

// Parse mode ID from task param
function parseModeId(task: string | null): string {
  if (!task || task.trim() === '') {
    return 'story-to-quantities'; // default mode
  }
  return task;
}

// Format an AppRoute into search string. Deterministic and backward-compatible with old URLs.
export function formatAppRoute(route: AppRoute): string {
  switch (route.kind) {
    case 'home':
      return `?home=true&locale=${route.locale}`;
      
    case 'puzzle':
      // Maintain parameter order for backward compatibility
      const params = new URLSearchParams();
      params.set('seed', String(route.seed));
      params.set('scenario', route.themeId);
      params.set('task', route.modeId);
      params.set('locale', route.locale);
      return `?${params.toString()}`;
      
    case 'session':
      const sessionParams = new URLSearchParams();
      sessionParams.set('session', String(route.seed));
      sessionParams.set('scenario', route.themeId);
      sessionParams.set('locale', route.locale);
      return `?${sessionParams.toString()}`;
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
export const defaultSessionSeed = 918273;
