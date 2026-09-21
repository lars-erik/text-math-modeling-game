import { expect, test } from 'vitest';
import { startAppController, type Destination } from './app-controller';
import { formatHash, parseHash, type Route } from './hash-route';
import type { HistoryAdapter } from './history-adapter';

class FakeView {
  hidden = false;
  readonly applied: Route[] = [];
  readonly cleared: Route[] = [];
  constructor(private readonly onApply: (route: Route) => void) {}
  apply(route: Route): void {
    this.onApply(route);
    this.applied.push(route);
  }
}

type Harness = {
  home: FakeView;
  puzzle: FakeView;
  writes: Array<{ hash: string; mode: 'push' | 'replace' }>;
  pops: Array<() => void>;
  setHash: (hash: string) => void;
  controller: ReturnType<typeof startAppController>;
};

function destinationOf(view: FakeView): Destination {
  return {
    view,
    apply: (route: Route) => view.apply(route),
  };
}

function harness(initialHash: string): Harness {
  const home = new FakeView(() => {});
  const puzzle = new FakeView(() => {});
  const writes: Harness['writes'] = [];
  const pops: Array<() => void> = [];
  let currentHash = initialHash;
  const history: HistoryAdapter = {
    push: (hash: string) => writes.push({ hash, mode: 'push' }),
    replace: (hash: string) => writes.push({ hash, mode: 'replace' }),
    onRoutePopped: (listener: () => void) => pops.push(listener),
  };
  const controller = startAppController({
    initialHash,
    getHash: () => currentHash,
    basePath: '/text-math-modeling-game/',
    history,
    destinations: {
      home: destinationOf(home),
      puzzle: destinationOf(puzzle),
    },
  });
  return {
    home,
    puzzle,
    writes,
    pops,
    setHash: (hash: string) => {
      currentHash = hash;
    },
    controller,
  };
}

test('an empty initial hash resolves to home and normalizes without a new history entry', () => {
  const h = harness('');
  expect(h.controller.currentRoute().name).toBe('home');
  expect(h.writes).toEqual([{ hash: '#home', mode: 'replace' }]);
  expect(h.home.hidden).toBe(false);
  expect(h.puzzle.hidden).toBe(true);
});

test('an initial deep link applies the route once without writing history', () => {
  const h = harness('#puzzle?seed=321&language=nb');
  expect(h.writes).toEqual([]);
  expect(h.puzzle.applied).toHaveLength(1);
  expect(h.puzzle.applied[0].name).toBe('puzzle');
  expect(h.puzzle.applied[0].routeParams.get('seed')).toBe('321');
  expect(h.puzzle.hidden).toBe(false);
  expect(h.home.hidden).toBe(true);
  expect(h.controller.currentRoute().name).toBe('puzzle');
});

test('semantic navigation pushes a history entry and applies the route', () => {
  const h = harness('#home?language=nb');
  h.controller.navigate(
    parseHash('#puzzle?seed=42&scenario=gaming.drone-power&task=story-to-quantities&language=nb'),
  );
  expect(h.writes).toEqual([
    {
      hash: '#puzzle?seed=42&scenario=gaming.drone-power&task=story-to-quantities&language=nb',
      mode: 'push',
    },
  ]);
  expect(h.puzzle.applied).toHaveLength(1);
  expect(h.home.hidden).toBe(true);
  expect(h.puzzle.hidden).toBe(false);
});

test('browser navigation restores the popped route without pushing history', () => {
  const h = harness('#home');
  h.controller.navigate(parseHash('#puzzle?seed=42&language=en'));
  h.setHash('#home');
  const writesBefore = h.writes.length;
  for (const pop of h.pops) {
    pop();
  }
  expect(h.writes.length).toBe(writesBefore);
  expect(h.controller.currentRoute().name).toBe('home');
  expect(h.home.hidden).toBe(false);
  expect(h.puzzle.hidden).toBe(true);
});

test('repeated external notifications for the same route apply it only once', () => {
  const h = harness('#home');
  h.setHash('#puzzle?seed=7&language=en');
  for (const pop of h.pops) {
    pop();
    pop();
  }
  expect(h.controller.currentRoute().name).toBe('puzzle');
  expect(h.puzzle.applied).toHaveLength(1);
  expect(h.writes).toEqual([]);
});

test('unknown route names are rejected explicitly', () => {
  expect(() => harness('#unknown-route')).toThrowError(/No destination is bound/);
  const h = harness('#home');
  expect(() =>
    h.controller.navigate({ name: 'unknown-route', routeParams: new Map() }),
  ).toThrowError(/No destination is bound/);
});

test('a validation hook rejects invalid routes before they are applied', () => {
  const writes: Array<{ hash: string; mode: 'push' | 'replace' }> = [];
  const history: HistoryAdapter = {
    push: (hash: string) => writes.push({ hash, mode: 'push' }),
    replace: (hash: string) => writes.push({ hash, mode: 'replace' }),
    onRoutePopped: () => {},
  };
  const view = new FakeView(() => {});
  const otherView = new FakeView(() => {});
  const start = () =>
    startAppController({
      initialHash: '#home',
      getHash: () => '#home',
      basePath: '/',
      history,
      destinations: {
        home: destinationOf(view),
        puzzle: destinationOf(otherView),
      },
      validateRoute: (route: Route) => {
        if (route.name !== 'home') {
          throw new Error(`Rejected ${route.name}.`);
        }
      },
    });
  const controller = start();
  expect(() =>
    controller.navigate({ name: 'puzzle', routeParams: new Map() }),
  ).toThrowError(/Rejected/);
  expect(view.applied.map((route) => route.name)).toEqual(['home']);
  expect(writes).toEqual([]);
});

test('the current route round-trips through the canonical hash format', () => {
  const h = harness('#home?language=nb');
  const route: Route = h.controller.currentRoute();
  expect(formatHash(route)).toBe('#home?language=nb');
});
