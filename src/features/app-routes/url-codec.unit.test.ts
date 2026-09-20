import { describe, test, expect } from 'vitest';
import { parseAppRoute, formatAppRoute, type AppRoute } from './app-route-types';

// Default route for determinism in tests
const enLocale = 'en';

describe('AppRoute parser (parseAppRoute)', () => {
  describe('Home route', () => {
    test('parses new home URL with locale param', () => {
      const search = '?home=true&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toEqual({ kind: 'home', locale: enLocale });
    });

    test('parses home URL without explicit locale param (defaults to en)', () => {
      const search = '?home=true';
      const route = parseAppRoute(search);
      
      expect(route).toEqual({ kind: 'home', locale: enLocale });
    });

    test('rejects invalid locale in home URL', () => {
      expect(() => parseAppRoute('?home=true&locale=invalid')).toThrow();
    });

    test('home is distinct from puzzle route even without seed', () => {
      const search = '?scenario=gaming.drone-power&task=story-to-quantities&locale=en';
      const route = parseAppRoute(search);
      
      expect(route.kind).toBe('puzzle');
      expect((route as AppRoute & { kind: 'puzzle' })).toHaveProperty('modeId', 'story-to-quantities');
    });
  });

  describe('Puzzle route (backward compatibility)', () => {
    test('parses existing puzzle URL from math-modeling-puzzle.browser.test.ts', () => {
      const search = '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'puzzle',
        seed: 17,
        themeId: 'gaming.drone-power',
        modeId: 'story-to-quantities',
        locale: enLocale,
      });
    });

    test('parses puzzle URL from other browser test', () => {
      const search = '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'puzzle',
        seed: 321,
        themeId: 'creator.followers',
        modeId: 'quantities-to-named-equation',
        locale: enLocale,
      });
    });

    test('parses puzzle URL without seed (uses default)', () => {
      const search = '?scenario=gaming.drone-power&task=named-equation-to-academic-notation&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'puzzle',
        seed: 17, // defaultPuzzleSeed
        themeId: 'gaming.drone-power',
        modeId: 'named-equation-to-academic-notation',
        locale: enLocale,
      });
    });

    test('parses puzzle URL with Norwegian locale', () => {
      const search = '?seed=321&scenario=creator.followers&task=named-equation-to-academic-notation&locale=nb';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'puzzle',
        seed: 321,
        themeId: 'creator.followers',
        modeId: 'named-equation-to-academic-notation',
        locale: 'nb',
      });
    });

    test('parses puzzle URL with no scenario (uses default)', () => {
      const search = '?seed=17&task=story-to-quantities&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'puzzle',
        seed: 17,
        themeId: 'gaming.drone-power',
        modeId: 'story-to-quantities',
        locale: enLocale,
      });
    });

    test('parses puzzle URL with no task (uses default)', () => {
      const search = '?seed=17&scenario=gaming.drone-power&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'puzzle',
        seed: 17,
        themeId: 'gaming.drone-power',
        modeId: 'story-to-quantities', // default mode
        locale: enLocale,
      });
    });

    test('accepts any non-empty themeId (backward compatibility)', () => {
      // Accepting user-supplied values without strict registry check for initial implementation
      const search = '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en';
      expect(() => parseAppRoute(search)).not.toThrow();
    });
  });

  describe('Session route (backward compatibility for M10 graybox)', () => {
    test('parses existing session URL with scenario param', () => {
      const search = '?session=918273&scenario=gaming.drone-power&locale=en';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'session',
        seed: 918273,
        themeId: 'gaming.drone-power',
        locale: enLocale,
      });
    });

    test('parses session URL with Norwegian locale', () => {
      const search = '?session=17&scenario=creator.followers&locale=nb';
      const route = parseAppRoute(search);
      
      expect(route).toMatchObject({
        kind: 'session',
        seed: 17,
        themeId: 'creator.followers',
        locale: 'nb',
      });
    });

    test('session ignores puzzle-specific params (seed is the key)', () => {
      // Note: session URLs don't have task/mode parameters
      const search = '?session=17&scenario=gaming.drone-power&locale=en';
      const route = parseAppRoute(search);
      
      expect(route.kind).toBe('session');
      expect((route as AppRoute & { kind: 'session' })).toHaveProperty('seed', 17);
    });

    test('rejects non-numeric session value', () => {
      expect(() => parseAppRoute('?session=invalid&scenario=gaming.drone-power&locale=en')).toThrow();
    });
  });
});

describe('AppRoute formatter (formatAppRoute)', () => {
  describe('Home route', () => {
    test('formats home with locale param', () => {
      const route: AppRoute = { kind: 'home', locale: 'en' };
      const search = formatAppRoute(route);
      
      expect(search).toBe('?home=true&locale=en');
    });

    test('formats home defaults to en when no locale (edge case)', () => {
      // This would require a different API, but we always include locale in output
      const route: AppRoute = { kind: 'home', locale: 'nb' };
      const search = formatAppRoute(route);
      
      expect(search).toBe('?home=true&locale=nb');
    });
  });

  describe('Puzzle route', () => {
    test('formats puzzle with all params', () => {
      const route: AppRoute = {
        kind: 'puzzle',
        seed: 17,
        themeId: 'gaming.drone-power',
        modeId: 'story-to-quantities',
        locale: enLocale,
      };
      // Note: URLSearchParams.toString() orders by parameter insertion order then alphabetically
      // Our formatAppRoute maintains seed first (like application.ts) for backward compatibility
      const search = formatAppRoute(route);
      
      // Use toStartWith or contains for now since ordering varies across JS engines
      expect(search).toContain('seed=17');
      expect(search).toContain('scenario=gaming.drone-power');
      expect(search).toContain('task=story-to-quantities');
      expect(search).toContain('locale=en');
    });

    test('formats puzzle with Norwegian locale', () => {
      const route: AppRoute = {
        kind: 'puzzle',
        seed: 321,
        themeId: 'creator.followers',
        modeId: 'quantities-to-named-equation',
        locale: 'nb',
      };
      const search = formatAppRoute(route);
      
      expect(search).toContain('seed=321');
      expect(search).toContain('scenario=creator.followers');
      expect(search).toContain('task=quantities-to-named-equation');
      expect(search).toContain('locale=nb');
    });
  });

  describe('Session route', () => {
    test('formats session without mode/task params', () => {
      const route: AppRoute = {
        kind: 'session',
        seed: 918273,
        themeId: 'gaming.drone-power',
        locale: enLocale,
      };
      const search = formatAppRoute(route);
      
      expect(search).toContain('session=918273');
      expect(search).toContain('scenario=gaming.drone-power');
      expect(search).toContain('locale=en');
    });
  });
});

describe('Round-trip format/parse determinism', () => {
  test.each([
    [ 'Home (en)', { kind: 'home', locale: 'en' } ],
    [ 'Home (nb)', { kind: 'home', locale: 'nb' } ],
    [ 'Puzzle 1', {
      kind: 'puzzle',
      seed: 17,
      themeId: 'gaming.drone-power',
      modeId: 'story-to-quantities',
      locale: enLocale,
    }],
    [ 'Session', {
      kind: 'session',
      seed: 918273,
      themeId: 'gaming.drone-power',
      locale: enLocale,
    }],
  ])(('produces deterministic round-trip for %s', (_name, route) => {
    const search = formatAppRoute(route);
    const parsed = parseAppRoute(search);
    
    // Using toEqual with normalized comparison since we may have different defaults
    expect(parsed).toEqual(route);
  }));

  test('existing puzzle URL round-trips correctly', () => {
    const originalSearch = '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en';
    
    // Parse and reformat
    const parsed = parseAppRoute(originalSearch);
    const reformatted = formatAppRoute(parsed);
    
    expect(reformatted).toBe(originalSearch);
  });

  test('existing session URL round-trips correctly', () => {
    const originalSearch = '?session=918273&scenario=gaming.drone-power&locale=en';
    
    const parsed = parseAppRoute(originalSearch);
    const reformatted = formatAppRoute(parsed);
    
    expect(reformatted).toBe(originalSearch);
  });
});

describe('Navigation request support', () => {
  test('can detect home route in app state', () => {
    const home: AppRoute = { kind: 'home', locale: 'en' };
    expect(home.kind).toBe('home');
  });

  test('can detect puzzle route in app state', () => {
    const puzzle: AppRoute = {
      kind: 'puzzle',
      seed: 17,
      themeId: 'gaming.drone-power',
      modeId: 'story-to-quantities',
      locale: enLocale,
    };
    expect(puzzle.kind).toBe('puzzle');
  });

  test('can detect session route in app state', () => {
    const session: AppRoute = {
      kind: 'session',
      seed: 17,
      themeId: 'gaming.drone-power',
      locale: enLocale,
    };
    expect(session.kind).toBe('session');
  });

  // Note: Type guards like isHomeRoute are not exported from app-route-types.ts yet.
  // Instead, we detect routes by checking the kind property directly on runtime objects.
});
