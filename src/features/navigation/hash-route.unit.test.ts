import { expect, test } from 'vitest';
import {
  formatHash,
  parseHash,
  type Route,
} from '../navigation/hash-route';

test('an empty hash resolves to the home route without arguments', () => {
  const route = parseHash('');
  expect(route.name).toBe('home');
  expect(Array.from(route.routeParams.entries())).toEqual([]);
});

test('parses a hash route name and its encoded query arguments', () => {
  const route = parseHash('#home?language=nb');
  expect(route.name).toBe('home');
  expect(route.routeParams.get('language')).toBe('nb');
});

test('formats a hash route with its query arguments', () => {
  expect(formatHash({ name: 'home', routeParams: new Map([['language', 'nb']]) })).toBe(
    '#home?language=nb',
  );
});

test('round-trips arbitrary encoded argument values without per-route knowledge', () => {
  const original: Route = {
    name: 'puzzle',
    routeParams: new Map<string, string>([
      ['seed', '17'],
      ['scenario', 'gaming.drone-power'],
      ['note', 'a & b = c?'],
    ]),
  };
  const formatted = formatHash(original);
  const parsed = parseHash(formatted);
  expect(parsed.name).toBe(original.name);
  expect(new Map(parsed.routeParams)).toEqual(new Map(original.routeParams));
});
