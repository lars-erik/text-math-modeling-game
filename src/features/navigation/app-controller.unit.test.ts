import { expect, test } from 'vitest';
import { startAppController } from './app-controller';
import { formatHash, parseHash, type Route } from './hash-route';
import type { HistoryAdapter } from './history-adapter';

class FakeElement {
  readonly attributes = new Map<string, string>();
  hidden = false;
  readonly attributeRemovals: string[] = [];
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
    this.attributeRemovals.push(name);
  }
}

type Harness = {
  elements: Record<string, FakeElement>;
  writes: Array<{ hash: string; mode: 'push' | 'replace' }>;
  pops: Array<() => void>;
  getHash: () => string;
  setHash: (hash: string) => void;
  controller: ReturnType<typeof startAppController>;
};

const views = {
  home: { tagName: 'app-home', attributeByParam: { language: 'locale' } },
  puzzle: {
    tagName: 'math-modeling-puzzle',
    attributeByParam: { seed: 'seed', scenario: 'theme', task: 'mode', language: 'locale' },
  },
  session: {
    tagName: 'math-modeling-puzzle',
    attributeByParam: { seed: 'session', scenario: 'theme', language: 'locale' },
  },
} as const;

function harness(initialHash: string): Harness {
  const elements: Record<string, FakeElement> = {
    'app-home': new FakeElement(),
    'math-modeling-puzzle': new FakeElement(),
  };
  const writes: Harness['writes'] = [];
  const pops: Array<() => void> = [];
  let currentHash = initialHash;
  const history: HistoryAdapter = {
    push: (hash) => writes.push({ hash, mode: 'push' }),
    replace: (hash) => writes.push({ hash, mode: 'replace' }),
    onRoutePopped: (listener) => pops.push(listener),
  };
  const getHash = () => currentHash;
  const setHash = (hash: string) => {
    currentHash = hash;
  };
  const controller = startAppController({
    initialHash,
    getHash,
    basePath: '/text-math-modeling-game/',
    root: {
      querySelector: (selector: string) =>
        elements[selector] as unknown as import('./app-controller').ViewElement | null,
    },
    history,
    views,
  });
  return { elements, writes, pops, getHash, setHash, controller };
}

test('an empty initial hash resolves to home and normalizes without a new history entry', () => {
  const h = harness('');
  expect(h.controller.currentRoute().name).toBe('home');
  expect(h.writes).toEqual([
    { hash: '#home', mode: 'replace' },
  ]);
  expect(h.elements['app-home'].hidden).toBe(false);
  expect(h.elements['math-modeling-puzzle'].hidden).toBe(true);
});

test('an initial deep link applies the route once without writing history', () => {
  const h = harness(
    '#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation&language=nb',
  );
  expect(h.writes).toEqual([]);
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.get('seed')).toBe('321');
  expect(puzzle.attributes.get('theme')).toBe('creator.followers');
  expect(puzzle.attributes.get('mode')).toBe('quantities-to-named-equation');
  expect(puzzle.attributes.get('locale')).toBe('nb');
  expect(puzzle.hidden).toBe(false);
  expect(h.elements['app-home'].hidden).toBe(true);
  expect(h.controller.currentRoute().name).toBe('puzzle');
});

test('a session deep link reflects the seed as the session attribute', () => {
  const h = harness('#session?seed=918273&scenario=gaming.drone-power&language=nb');
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.get('session')).toBe('918273');
  expect(puzzle.attributes.get('theme')).toBe('gaming.drone-power');
  expect(puzzle.attributes.get('locale')).toBe('nb');
  expect(puzzle.attributes.has('seed')).toBe(false);
  expect(puzzle.attributes.has('mode')).toBe(false);
});

test('semantic navigation pushes a history entry and reflects the new route', () => {
  const h = harness('#home?language=nb');
  h.controller.navigate(
    parseHash(
      '#puzzle?seed=42&scenario=gaming.drone-power&task=story-to-quantities&language=nb',
    ),
  );
  expect(h.writes).toEqual([
    {
      hash: '#puzzle?seed=42&scenario=gaming.drone-power&task=story-to-quantities&language=nb',
      mode: 'push',
    },
  ]);
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.get('seed')).toBe('42');
  expect(h.elements['app-home'].hidden).toBe(true);
  expect(puzzle.hidden).toBe(false);
});

test('navigating to a session clears puzzle attributes and sets the session attribute', () => {
  const h = harness(
    '#puzzle?seed=42&scenario=gaming.drone-power&task=story-to-quantities&language=nb',
  );
  h.controller.navigate(
    parseHash('#session?seed=918273&scenario=gaming.drone-power&language=nb'),
  );
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.get('session')).toBe('918273');
  expect(puzzle.attributes.has('seed')).toBe(false);
  expect(puzzle.attributes.has('mode')).toBe(false);
  expect(puzzle.attributeRemovals).toContain('seed');
  expect(puzzle.attributeRemovals).toContain('mode');
});

test('home navigation preserves the current language and resets puzzle attributes', () => {
  const h = harness(
    '#session?seed=918273&scenario=creator.followers&language=nb',
  );
  h.controller.navigate(parseHash('#home?language=nb'));
  expect(h.writes).toEqual([{ hash: '#home?language=nb', mode: 'push' }]);
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.has('session')).toBe(false);
  expect(puzzle.attributes.has('theme')).toBe(false);
  expect(h.elements['app-home'].attributes.get('locale')).toBe('nb');
  expect(h.elements['app-home'].hidden).toBe(false);
});

test('browser navigation restores the popped route without pushing history', () => {
  const h = harness('#home');
  h.controller.navigate(
    parseHash('#puzzle?seed=42&scenario=gaming.drone-power&task=story-to-quantities&language=en'),
  );
  h.setHash('#home');
  const writesBefore = h.writes.length;
  for (const pop of h.pops) {
    pop();
  }
  expect(h.writes.length).toBe(writesBefore);
  expect(h.controller.currentRoute().name).toBe('home');
  expect(h.elements['app-home'].hidden).toBe(false);
  expect(h.elements['math-modeling-puzzle'].hidden).toBe(true);
});

test('repeated external hash notifications apply the route only once', () => {
  const h = harness('#home');
  h.setHash(
    '#puzzle?seed=7&scenario=gaming.drone-power&task=story-to-quantities&language=en',
  );
  const applySpy = h.elements['math-modeling-puzzle'].attributes;
  for (const pop of h.pops) {
    pop();
    pop();
  }
  expect(h.controller.currentRoute().name).toBe('puzzle');
  expect(applySpy.get('seed')).toBe('7');
  expect(h.writes).toEqual([]);
});

test('unknown route names are rejected explicitly', () => {
  expect(() => harness('#unknown-route')).toThrowError(/No view is bound/);
  const h = harness('#home');
  expect(() =>
    h.controller.navigate({ name: 'unknown-route', routeParams: new Map() }),
  ).toThrowError(/No view is bound/);
});

test('the current route round-trips through the canonical hash format', () => {
  const h = harness('#home?language=nb');
  const route: Route = h.controller.currentRoute();
  expect(formatHash(route)).toBe('#home?language=nb');
});
