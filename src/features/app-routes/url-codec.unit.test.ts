import { expect, test, describe } from 'vitest';

import { parseAppRoute, formatAppRoute, formatAppRouteLegacy, type AppRoute, hasSeed } from './app-route-types';

// Default route for determinism in tests
const enLocale = 'en';
const defaultPuzzleSeed = 17;

describe('AppRoute parser (parseAppRoute)', () => {
  describe('Home route', () => {
    test('parses new home URL with locale param', () => {
      const search = '?home=true&locale=en';
      const route: AppRoute = parseAppRoute(search);

      // Home routes only have route.locale (top-level), not in arguments Map
      expect(route.kind).toBe('home');
      expect(route.locale).toBe(enLocale);
      // locale should NOT be in arguments for home
      expect(route.arguments.has('locale')).toBe(false);
    });

    test('parses home URL without explicit locale param (defaults to en)', () => {
      const search = '?home=true';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('home');
      expect(route.locale).toBe(enLocale);
    });

    test('rejects invalid locale in home URL', () => {
      expect(() => parseAppRoute('?home=true&locale=invalid')).toThrow();
    });

    // TODO: Delete backwards compatibility tests.
    test.skip('home is distinct from puzzle route even without seed', () => {
      const search = '?scenario=gaming.drone-power&task=story-to-quantities&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('puzzle');
      
      // Puzzle routes should have seed in arguments even with default value
      // We verify this by checking the argument keys directly without relying on hasSeed guard
      expect(Array.from(route.arguments.keys()).includes('seed')).toBe(true);
      expect(route.arguments.get('seed')).not.toBeNull();
      
      // The theme and mode params should be populated
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
      expect(route.arguments.get('modeId')).toBe('story-to-quantities');
    });
  });

  // TODO: Delete backwards compatibility tests.
  describe.skip('Puzzle route (backward compatibility)', () => {
    test('parses existing puzzle URL from math-modeling-puzzle.browser.test.ts', () => {
      const search = '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en';
      const route: AppRoute = parseAppRoute(search);

      // New format uses arguments Map instead of concrete properties
      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('17');
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
      expect(route.arguments.get('modeId')).toBe('story-to-quantities');
      expect(route.locale).toBe(enLocale);
    });

    test('parses puzzle URL from other browser test', () => {
      const search = '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('321');
      expect(route.arguments.get('themeId')).toBe('creator.followers');
      expect(route.arguments.get('modeId')).toBe('quantities-to-named-equation');
      expect(route.locale).toBe(enLocale);
    });

    test('parses puzzle URL without seed (uses default)', () => {
      const search = '?scenario=gaming.drone-power&task=named-equation-to-academic-notation&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe(String(defaultPuzzleSeed));
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
      expect(route.arguments.get('modeId')).toBe('named-equation-to-academic-notation');
      expect(route.locale).toBe(enLocale);
    });

    test('parses puzzle URL with Norwegian locale', () => {
      const search = '?seed=321&scenario=creator.followers&task=named-equation-to-academic-notation&locale=nb';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('321');
      expect(route.arguments.get('themeId')).toBe('creator.followers');
      expect(route.arguments.get('modeId')).toBe('named-equation-to-academic-notation');
      expect(route.locale).toBe('nb');
    });

    test('parses puzzle URL with no scenario (uses default)', () => {
      const search = '?seed=17&task=story-to-quantities&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('17');
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
      expect(route.arguments.get('modeId')).toBe('story-to-quantities');
      expect(route.locale).toBe(enLocale);
    });

    test('parses puzzle URL with no task (uses default)', () => {
      const search = '?seed=17&scenario=gaming.drone-power&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('17');
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
      expect(route.arguments.get('modeId')).toBe('story-to-quantities'); // default mode
      expect(route.locale).toBe(enLocale);
    });

    test('accepts any non-empty themeId (backward compatibility)', () => {
      // Accepting user-supplied values without strict registry check for initial implementation
      const search = '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en';
      expect(() => parseAppRoute(search)).not.toThrow();
    });
  });

  describe.skip('Session route (backward compatibility for M10 graybox)', () => {
    test('parses existing session URL with scenario param', () => {
      const search = '?session=918273&scenario=gaming.drone-power&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('session');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('918273');
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
      expect(route.locale).toBe(enLocale);
    });

    test('parses session URL with Norwegian locale', () => {
      const search = '?session=17&scenario=creator.followers&locale=nb';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('session');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('17');
      expect(route.arguments.get('themeId')).toBe('creator.followers');
      expect(route.locale).toBe('nb');
    });

    test('session ignores puzzle-specific params (seed is the key)', () => {
      // Note: session URLs don't have task/mode parameters
      const search = '?session=17&scenario=gaming.drone-power&locale=en';
      const route: AppRoute = parseAppRoute(search);

      expect(route.kind).toBe('session');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('17');
    });

    test('rejects non-numeric session value', () => {
      expect(() => parseAppRoute('?session=invalid&scenario=gaming.drone-power&locale=en')).toThrow();
    });
  });

  describe('Hash-based routing (Phase 2 controller)', () => {
    test('parses #home route without locale param', () => {
      const hash = '#home';
      const route: AppRoute = parseAppRoute('', hash);

      expect(route.kind).toBe('home');
      expect(route.locale).toBe('en');
    });

    test('parses #home with locale in querystring', () => {
      const hash = '#home?locale=nb';
      const route: AppRoute = parseAppRoute('', hash);

      expect(route.kind).toBe('home');
      expect(route.locale).toBe('nb');
    });

    test('parses #puzzle?seed=n with locale and scenario', () => {
      const hash = '#puzzle?seed=12&locale=nb&scenario=creator.followers&task=quantities-to-named-equation';
      const route: AppRoute = parseAppRoute('', hash);

      expect(route.kind).toBe('puzzle');
      expect(hasSeed(route)).toBe(true);
      expect(route.arguments.get('seed')).toBe('12');
      expect(route.arguments.get('themeId')).toBe('creator.followers');
      expect(route.arguments.get('modeId')).toBe('quantities-to-named-equation');
      expect(route.locale).toBe('nb');
    });

    test('parses #puzzle/seed with mode param instead of task', () => {
      const hash = '#puzzle?seed=99&locale=en&mode=story-to-quantities';
      const route: AppRoute = parseAppRoute('', hash);

      expect(route.arguments.get('modeId')).toBe('story-to-quantities');
    });

    test('parses #session/seed without params', () => {
      const hash = '#session?seed=918273';
      const route: AppRoute = parseAppRoute('', hash);

      expect(route.kind).toBe('session');
      
      // Verify a session always has seed, even with default value
      expect(Array.from(route.arguments.keys()).includes('seed')).toBe(true);
      expect(route.arguments.get('seed')).not.toBeNull();
      
      expect(route.arguments.get('themeId')).toBe('gaming.drone-power');
    });

    test('parses #session/seed with locale in querystring', () => {
      const hash = '#session?seed=123&locale=nb&scenario=creator.followers';
      const route: AppRoute = parseAppRoute('', hash);

      expect(route.kind).toBe('session');
      
      // Verify seed exists and locale is set from params
      expect(Array.from(route.arguments.keys()).includes('seed')).toBe(true);
      expect(route.arguments.get('seed')).toBe('123');
      expect(route.arguments.get('themeId')).toBe('creator.followers');
      expect(route.locale).toBe('nb');
    });

  });

  describe('AppRoute formatter (formatAppRoute - hash format)', () => {
    describe('Home route', () => {
      test('formats home with locale in hash format', () => {
        const route: AppRoute = { kind: 'home', locale: 'en', arguments: new Map() };
        const search = formatAppRoute(route);

        expect(search).toBe('#home'); // Hash format for controller
      });

      test('formats home with nb locale includes locale param', () => {
        const route: AppRoute = { kind: 'home', locale: 'nb', arguments: new Map() };
        const search = formatAppRoute(route);

        expect(search).toBe('#home?locale=nb');
      });
    });

    describe('Puzzle route', () => {
      test('formats puzzle in hash format', () => {
        const route: AppRoute = {
          kind: 'puzzle',
          arguments: new Map([['seed', '17'], ['themeId', 'gaming.drone-power'], ['modeId', 'story-to-quantities'], ['locale', 'en']]),
          locale: enLocale,
        };
        const search = formatAppRoute(route);

        expect(search).toBe('#puzzle?locale=en&seed=17&scenario=gaming.drone-power&task=story-to-quantities');
      });

      test('formats puzzle with Norwegian locale', () => {
        const route: AppRoute = {
          kind: 'puzzle',
          arguments: new Map([['seed', '321'], ['themeId', 'creator.followers'], ['modeId', 'quantities-to-named-equation'], ['locale', 'nb']]),
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
      test('formats session in hash format', () => {
        const route: AppRoute = {
          kind: 'session',
          arguments: new Map([['seed', '918273'], ['themeId', 'gaming.drone-power'], ['locale', 'en']]),
          locale: enLocale,
        };
        const search = formatAppRoute(route);

        expect(search).toContain('#session?locale=en&seed=918273');
        expect(search).toContain('scenario=gaming.drone-power');
      });
    });
  });

  describe('AppRoute legacy formatter (formatAppRouteLegacy)', () => {
    describe('Home route', () => {
      test('formats home with legacy query params', () => {
        const route: AppRoute = { kind: 'home', locale: 'en', arguments: new Map() };
        const search = formatAppRouteLegacy(route);

        expect(search).toBe('?home=true&locale=en'); // Legacy format
      });

      test('formats home with Norwegian locale', () => {
        const route: AppRoute = { kind: 'home', locale: 'nb', arguments: new Map() };
        const search = formatAppRouteLegacy(route);

        expect(search).toBe('?home=true&locale=nb');
      });
    });

    describe('Puzzle route (legacy)', () => {
      test('formats puzzle with legacy params', () => {
        const route: AppRoute = {
          kind: 'puzzle',
          arguments: new Map([['seed', '17'], ['themeId', 'gaming.drone-power'], ['modeId', 'story-to-quantities'], ['locale', 'en']]),
          locale: enLocale,
        };
        const search = formatAppRouteLegacy(route);

        expect(search).toBe('?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en');
      });
    });

    describe('Session route (legacy)', () => {
      test('formats session with legacy params', () => {
        const route: AppRoute = {
          kind: 'session',
          arguments: new Map([['seed', '918273'], ['themeId', 'gaming.drone-power'], ['locale', 'en']]),
          locale: enLocale,
        };
        const search = formatAppRouteLegacy(route);

        expect(search).toBe('?session=918273&scenario=gaming.drone-power&locale=en');
      });
    });
  });

  describe('Hash round-trip tests', () => {
    // TODO: Delete backwards compatibility tests.
    describe.skip('Legacy URLs (backward compatibility)', () => {
      test('existing puzzle URL parses and reformats identically', async () => {
        const originalSearch = '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en';

        const parsed = parseAppRoute(originalSearch);
        const reformattedLegacy = formatAppRouteLegacy(parsed);

        expect(reformattedLegacy).toBe(originalSearch);
      });

      test('session URL round-trips', () => {
        const originalSearch = '?session=918273&scenario=gaming.drone-power&locale=en';

        const parsed = parseAppRoute(originalSearch);
        const reformattedLegacy = formatAppRouteLegacy(parsed);

        expect(reformattedLegacy).toBe(originalSearch);
      });

      test('home URL round-trips', () => {
        const originalSearch = '?home=true&locale=nb';

        const parsed = parseAppRoute(originalSearch);
        const reformattedLegacy = formatAppRouteLegacy(parsed);

        expect(reformattedLegacy).toBe(originalSearch);
      });
    });

    describe('Hash URLs (Phase 2 controller)', () => {
      test('home hash route round-trips', () => {
        const originalHash = '#home?locale=nb';

        const parsed = parseAppRoute('', originalHash);
        const reformatted = formatAppRoute(parsed);

        expect(reformatted).toBe(originalHash);
      });

      test('puzzle hash route round-trips', () => {
        const originalHash = '#puzzle?locale=en&seed=17&scenario=gaming.drone-power&task=story-to-quantities';

        const parsed = parseAppRoute('', originalHash);
        const reformatted = formatAppRoute(parsed);

        expect(reformatted).toBe(originalHash);
      });

      test('session hash route round-trips', () => {
        const originalHash = '#session?locale=en&seed=918273&scenario=gaming.drone-power';

        console.log('original hash:', originalHash);
        const parsed = parseAppRoute('', originalHash);

        console.log(parsed);

        const reformatted = formatAppRoute(parsed);

        expect(reformatted).toBe(originalHash);
      });

      test('puzzle hash without extra params round-trips', () => {
        const originalHash = '#puzzle?seed=42';

        const parsed = parseAppRoute('', originalHash);
        const reformatted = formatAppRoute(parsed);

        // With all defaults, should include locale in output always
        expect(reformatted).toBe('#puzzle?locale=en&seed=42&scenario=gaming.drone-power&task=story-to-quantities');
      });
    });

    // TODO: Delete backwards compatibility tests.
    describe.skip('Mixed: legacy params from hash parsing', () => {
      test('hash with ?param produces URLSearchParams output on reformat', () => {
        const originalHash = '#puzzle/17?locale=en'; // simplified params

        const parsed = parseAppRoute('', originalHash);
        const reformatted = formatAppRoute(parsed);

        expect(reformatted).toContain('seed=17');
        expect(reformatted).toContain('locale=en');
        expect(reformatted).toBe('#puzzle/17?locale=en&scenario=gaming.drone-power&task=story-to-quantities');
      });
    });
  });

});