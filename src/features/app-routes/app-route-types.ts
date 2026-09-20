import type { PuzzleLocale } from '../puzzle/lang';
import type { ThemeId } from '../themes';

// AppRoute is a discriminated union representing application state at the route level.
// It serves as the single source of truth for URL -> AppState mapping and transitions.
// This type lives in the composition/UI boundary, not in Problem/Theme/Mode semantics.
// Decoupled format: properties stored in arguments Map; concrete properties accessed via get().
// Format functions internally use Map to avoid coupling formatting to concrete mode params.

export type AppRoute = {
  kind: 'home' | 'puzzle' | 'session';
  arguments: Map<string, any>;
  locale: PuzzleLocale;
};

export type AppRouteKind = AppRoute['kind']; // 'home' | 'puzzle' | 'session'

// Parse search and/or hash parameters into an AppRoute.
// Returns a decoupled format with properties in arguments Map for orthogonal architecture.
// This function is pure and framework-independent. It does not mutate DOM or document.
// Backward compatible with existing ?key=value URLs from M10 graybox sessions.
export function parseAppRoute(search: string, hash?: string): AppRoute {
  if (!hash && search.indexOf('#') > -1) {
    hash = search.substring(search.indexOf('#'));
  }
  
  // If hash is provided, extract route kind from anchor
  if (hash !== undefined && hash.trim() !== '') {
    return parseFromHash(hash);
  }
  
  console.log('returning home route');

  return {
    kind: 'home',
    arguments: new Map<string, any>(),
    locale: parseLocale(new URLSearchParams(search).get('locale')),
  }
}

// Parse hash anchor format: #home, #puzzle/seed?params..., #session/seed?params...
function parseFromHash(hash: string): AppRoute {
  const hashClean = hash.replace(/^#/, ''); // Remove leading # if present
  
  // Split into path and querystring parts (queryString is a single string if present)
  const [pathPart, queryString = ''] = hashClean.split('?');

  // Parse query params when present
  const params = new URLSearchParams(queryString ?? '');

  // Check session first (higher priority)
  if (/^session/.test(pathPart)) {
    const seedParam = params.get('seed');
    if (seedParam) {
      const seed = parseInt(seedParam, 10);
      const argumentsMap = new Map<string, any>();
      argumentsMap.set('seed', seed.toString());
      argumentsMap.set('themeId', parseThemeId(params?.get('scenario')));
      return {
        kind: 'session',
        arguments: argumentsMap,
        locale: parseLocale(params?.get('locale')),
      };
    }
  }
  
  // Check puzzle route
  if (/^puzzle/.test(pathPart)) {
    const seedParam = params.get('seed');
    if (seedParam) {
      const seed = parseInt(seedParam, 10);
      const argumentsMap = new Map<string, any>();
      argumentsMap.set('seed', seed.toString());
      argumentsMap.set('themeId', parseThemeId(params?.get('scenario')));
      // Prefer task param over mode for backwards compatibility, then default
      argumentsMap.set('modeId', params?.get('task') || params?.get('mode') || 'story-to-quantities');
      return {
        kind: 'puzzle',
        arguments: argumentsMap,
        locale: parseLocale(params?.get('locale')),
      };
    }
  }
  
  // Route kind from hash anchor
  if (hashClean.startsWith('home')) {
    return {
      kind: 'home',
      arguments: new Map<string, any>(),
      locale: parseLocale(params?.get('locale')),
    };
  }
  
  // Fallback to legacy parsing (should not be reached, but for safety)
  const paramsFromLegacy = new URLSearchParams(hashClean);
  const sessionTextFromHash = paramsFromLegacy.get('session');
  if (sessionTextFromHash !== null) {
    try {
      const argumentsMap = new Map<string, any>();
      argumentsMap.set('seed', parseInt(sessionTextFromHash, 10).toString());
      argumentsMap.set('themeId', parseThemeId(paramsFromLegacy.get('scenario')));
      argumentsMap.set('locale', parseLocale(paramsFromLegacy.get('locale')));
      return {
        kind: 'session',
        arguments: argumentsMap,
        locale: parseLocale(paramsFromLegacy.get('locale')),
      };
    } catch {
      throw new Error(`Could not parse session value: ${sessionTextFromHash}`);
    }
  }
  
  if (paramsFromLegacy.has('home')) {
    return { kind: 'home', arguments: new Map<string, any>(), locale: parseLocale(paramsFromLegacy.get('locale')) };
  }
  
  const seedText = paramsFromLegacy.get('seed');
  if (seedText !== null) {
    try {
      const argumentsMap = new Map<string, any>();
      argumentsMap.set('seed', (parseInt(seedText, 10) || defaultPuzzleSeed).toString());
      argumentsMap.set('themeId', parseThemeId(paramsFromLegacy.get('scenario')));
      // Default mode if neither task nor mode provided
      argumentsMap.set('modeId', (paramsFromLegacy.get('task') || paramsFromLegacy.get('mode') || 'story-to-quantities'));
      argumentsMap.set('locale', parseLocale(paramsFromLegacy.get('locale')));
      return {
        kind: 'puzzle',
        arguments: argumentsMap,
        locale: parseLocale(paramsFromLegacy.get('locale')),
      };
    } catch {
      throw new Error(`Could not parse puzzle value: ${seedText}`);
    }
  }
  
  const fallbackArguments = new Map<string, any>();
  fallbackArguments.set('seed', defaultPuzzleSeed.toString());
  fallbackArguments.set('themeId', 'gaming.drone-power');
  fallbackArguments.set('modeId', 'story-to-quantities');
  fallbackArguments.set('locale', 'en');
  return {
    kind: 'puzzle',
    arguments: fallbackArguments,
    locale: 'en',
  };
}

// Parse legacy puzzle routes with all backward-compatible params
function parsePuzzleRoute(params: URLSearchParams): AppRoute {
  const seedText = params.get('seed');
  const seed = seedText !== null ? parseInt(seedText, 10) : defaultPuzzleSeed; // default puzzle seed
  
  const argumentsMap = new Map<string, any>();
  argumentsMap.set('seed', seed.toString());
  argumentsMap.set('themeId', parseThemeId(params.get('scenario')));
  argumentsMap.set('modeId', params.get('task') || params.get('mode') || 'story-to-quantities'); // Use parseModeId logic inline
  
  return {
    kind: 'puzzle',
    arguments: argumentsMap,
    locale: parseLocale(params.get('locale')),
  };
}

// Parse legacy session routes from existing M10 graybox sessions
function parseSessionRoute(search: string): AppRoute {
  const params = new URLSearchParams(search);
  const sessionText = params.get('session');
  
  if (sessionText === null) {
    throw new Error(`No session parameter in route string: ${search}`);
  }
  
  try {
    const argumentsMap = new Map<string, any>();
    const seed = parseInt(sessionText, 10);
    // Validate that session value is numeric (not NaN or Infinity)
    if (!Number.isFinite(seed)) {
      throw new Error(`Session must be a valid number: ${sessionText}`);
    }
    argumentsMap.set('seed', seed.toString());
    argumentsMap.set('themeId', parseThemeId(params.get('scenario')));
    argumentsMap.set('locale', parseLocale(params.get('locale')));
    return {
      kind: 'session',
      arguments: argumentsMap,
      locale: parseLocale(params.get('locale')),
    };
  } catch {
    throw new Error(`Could not parse session value: ${sessionText}`);
  }
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

// Format an AppRoute into URL string. Supports both legacy query params and new hash format for controller use.
export function formatAppRoute(route: AppRoute): string {
  switch (route.kind) {
    case 'home':
      // Hash format for programmatic navigation
      return `#home${(route.locale !== 'en') ? `?locale=${encodeURIComponent(route.locale)}` : ''}`;
      
    case 'puzzle':
      // Hash format: #puzzle/seed followed by params (locale first, then scenario, task)
      const puzzleParams = new URLSearchParams();
      puzzleParams.set('locale', route.locale); // Always add locale first for consistency
      // Add seed to query params - needed for tests that verify ?seed=XX exists (e.g., Norwegian localization test)
      puzzleParams.set('seed', route.arguments.get('seed')!.toString()); 
      if (route.arguments.has('themeId')) {
        puzzleParams.set('scenario', route.arguments.get('themeId')!);
      }
      if (route.arguments.has('modeId')) {
        puzzleParams.set('task', route.arguments.get('modeId') as string);
      }
      return `#puzzle?${puzzleParams.toString()}`;

    case 'session':
      const sessionParams = new URLSearchParams();
      // Locale first, then scenario (seed is in path, not query params)
      sessionParams.set('locale', route.locale);
      if (route.arguments.has('seed')) {
        sessionParams.set('seed', route.arguments.get('seed')!);
      }
      if (route.arguments.has('themeId')) {
        sessionParams.set('scenario', route.arguments.get('themeId')!);
      }
      return `#session?${sessionParams.toString()}`;
  }
}

// Format for legacy browser compatibility (query params instead of hash)
export function formatAppRouteLegacy(route: AppRoute): string {
  switch (route.kind) {
    case 'home':
      return `?home=true&locale=${encodeURIComponent(route.locale)}`;
      
    case 'puzzle':
      const puzzleParams = new URLSearchParams();
      const seed = route.arguments.get('seed');
      if (seed) {
        puzzleParams.set('seed', seed);
      } else {
        puzzleParams.set('seed', defaultPuzzleSeed.toString());
      }
      if (route.arguments.has('themeId')) {
        puzzleParams.set('scenario', route.arguments.get('themeId')!);
      }
      if (route.arguments.has('modeId')) {
        puzzleParams.set('task', route.arguments.get('modeId') as string);
      }
      puzzleParams.set('locale', route.locale);
      return `?${puzzleParams.toString()}`;
      
    case 'session':
      const sessionParams = new URLSearchParams();
      const sSeed = route.arguments.get('seed');
      if (sSeed) {
        sessionParams.set('session', sSeed);
      } else if (route.kind === 'session') {
        sessionParams.set('session', defaultSessionSeed.toString());
      }
      if (route.arguments.has('themeId')) {
        sessionParams.set('scenario', route.arguments.get('themeId')!);
      }
      sessionParams.set('locale', route.locale);
      return `?${sessionParams.toString()}`;
  }
}

// Type guards for discriminated union - composer/application layer boundary
export function isAppRoute(value: unknown): value is AppRoute {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('kind' in value || 'locale' in value)
  );
}

// Check if route has seed property (union discriminator for non-home routes)
export function hasSeed(route: AppRoute): route is Extract<AppRoute, { kind: 'puzzle' } | { kind: 'session' }> {
  return route.arguments.has('seed'); // Maps require .has() for key existence check
}

// Exported type guards for composer/dispatch layer (Phase 2 controller)
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
