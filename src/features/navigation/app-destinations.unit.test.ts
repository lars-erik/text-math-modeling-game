import { expect, test } from 'vitest';
import { parseHash } from './hash-route';
import {
  homeSelectionFromRoute,
  puzzleSelectionFromRoute,
  routeFromHomeSelection,
  routeFromPuzzleSelection,
  routeFromSessionSelection,
  sessionSelectionFromRoute,
} from './app-destinations';

test('parses a puzzle hash route into a typed puzzle selection', () => {
  expect(
    puzzleSelectionFromRoute(
      parseHash(
        '#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=nb',
      ),
    ),
  ).toEqual({
    seed: 17,
    familyId: 'total-from-parts',
    themeId: 'gaming.drone-power',
    modeId: 'story-to-quantities',
    locale: 'nb',
  });
});

test('a missing language falls back to the default locale', () => {
  expect(
    puzzleSelectionFromRoute(
      parseHash('#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation'),
    ).locale,
  ).toBe('en');
});

test('rejects invalid or missing puzzle route arguments', () => {
  expect(() => puzzleSelectionFromRoute(parseHash('#puzzle'))).toThrowError(
    /seed/,
  );
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?scenario=gaming.drone-power&task=story-to-quantities')),
  ).toThrowError(/seed/);
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?seed=17&task=story-to-quantities')),
  ).toThrowError(/scenario/);
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?seed=17&scenario=gaming.drone-power')),
  ).toThrowError(/task/);
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?seed=-1&scenario=gaming.drone-power&task=story-to-quantities')),
  ).toThrowError(/unsigned 32-bit/);
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?seed=17&scenario=unknown.theme&task=story-to-quantities')),
  ).toThrowError(/Unknown scenario/);
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?seed=17&scenario=gaming.drone-power&task=unknown-task')),
  ).toThrowError(/Unknown puzzle task/);
  expect(() =>
    puzzleSelectionFromRoute(parseHash('#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=fr')),
  ).toThrowError(/Unknown language/);
});

test('round-trips a puzzle selection through route and hash', () => {
  const selection = {
    seed: 321,
    familyId: 'total-from-parts',
    themeId: 'creator.followers',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  } as const;
  expect(
    puzzleSelectionFromRoute(
      parseHash(
        '#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation&language=nb',
      ),
    ),
  ).toEqual(selection);
  expect(routeFromPuzzleSelection(selection).name).toBe('puzzle');
});

test('routeFromPuzzleSelection formats the canonical hash', () => {
  const route = routeFromPuzzleSelection({
    seed: 42,
    familyId: 'total-from-parts',
    themeId: 'gaming.drone-power',
    modeId: 'story-to-quantities',
    locale: 'nb',
  });
  expect(route.name).toBe('puzzle');
  expect(new Map(route.routeParams)).toEqual(
    new Map<string, string | number | boolean>([
      ['seed', 42],
      ['family', 'total-from-parts'],
      ['scenario', 'gaming.drone-power'],
      ['task', 'story-to-quantities'],
      ['language', 'nb'],
    ]),
  );
});

test('parses and formats a session hash route', () => {
  const selection = {
    seed: 918273,
    themeId: 'creator.followers',
    locale: 'nb',
  } as const;
  expect(
    sessionSelectionFromRoute(
      parseHash('#session?seed=918273&scenario=creator.followers&language=nb'),
    ),
  ).toEqual(selection);
  const route = routeFromSessionSelection(selection);
  expect(route.name).toBe('session');
  expect(new Map(route.routeParams)).toEqual(
    new Map<string, string | number | boolean>([
      ['seed', 918273],
      ['scenario', 'creator.followers'],
      ['language', 'nb'],
    ]),
  );
});

test('rejects invalid session route arguments', () => {
  expect(() => sessionSelectionFromRoute(parseHash('#session'))).toThrowError(
    /seed/,
  );
  expect(() => sessionSelectionFromRoute(parseHash('#session?seed=918273'))).toThrowError(
    /scenario/,
  );
  expect(() =>
    sessionSelectionFromRoute(parseHash('#session?seed=abc&scenario=gaming.drone-power')),
  ).toThrowError(/unsigned 32-bit/);
  expect(() =>
    sessionSelectionFromRoute(parseHash('#session?seed=918273&scenario=unknown.theme')),
  ).toThrowError(/Unknown scenario/);
  expect(() =>
    sessionSelectionFromRoute(parseHash('#session?seed=918273&scenario=gaming.drone-power&language=xx')),
  ).toThrowError(/Unknown language/);
});

test('a home route carries only a language', () => {
  expect(homeSelectionFromRoute(parseHash(''))).toEqual({ language: 'en' });
  expect(homeSelectionFromRoute(parseHash('#home'))).toEqual({ language: 'en' });
  expect(homeSelectionFromRoute(parseHash('#home?language=nb'))).toEqual({
    language: 'nb',
  });
  expect(
    new Map(routeFromHomeSelection({ language: 'nb' }).routeParams),
  ).toEqual(new Map([['language', 'nb']]));
  expect(() =>
    homeSelectionFromRoute(parseHash('#home?language=fr')),
  ).toThrowError(/Unknown language/);
});

test('a missing family falls back to the default family', () => {
  expect(
    puzzleSelectionFromRoute(
      parseHash('#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities'),
    ).familyId,
  ).toBe('total-from-parts');
});

test('parses a groups-total family from the puzzle hash route', () => {
  expect(
    puzzleSelectionFromRoute(
      parseHash(
        '#puzzle?seed=17&family=groups-total&scenario=gaming.drone-power&task=quantities-to-named-equation&language=nb',
      ),
    ),
  ).toEqual({
    seed: 17,
    familyId: 'groups-total',
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  });
});

test('round-trips an explicit family through the canonical puzzle hash', () => {
  const selection = {
    seed: 321,
    familyId: 'groups-total',
    themeId: 'creator.followers',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  } as const;
  expect(
    puzzleSelectionFromRoute(parseHash(formatHashOfPuzzleSelection(selection))),
  ).toEqual(selection);
});

test('rejects unknown family route arguments', () => {
  expect(() =>
    puzzleSelectionFromRoute(
      parseHash(
        '#puzzle?seed=17&family=unknown-family&scenario=gaming.drone-power&task=story-to-quantities',
      ),
    ),
  ).toThrowError(/Unknown problem family/);
});

function formatHashOfPuzzleSelection(
  selection: ReturnType<typeof puzzleSelectionFromRoute>,
): string {
  const route = routeFromPuzzleSelection(selection);
  const parameters = new URLSearchParams();
  for (const [key, value] of route.routeParams) {
    parameters.set(key, String(value));
  }
  return `#${route.name}?${parameters.toString()}`;
}
