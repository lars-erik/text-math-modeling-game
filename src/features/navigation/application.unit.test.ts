import { expect, test } from 'vitest';
import { startMathModelingApplication } from '../../application';
import {
  navigateHomeRequestEvent,
  navigatePuzzleRequestEvent,
  navigateSessionRequestEvent,
} from './navigation-request';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from '../puzzle/puzzle-request';
import type { HistoryAdapter } from './history-adapter';

class FakeElement {
  readonly attributes = new Map<string, string>();
  hidden = false;
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
}

class FakeHomeElement extends FakeElement {
  hiddenRuns:
    | {
        activeRun: { seed: number; position: number; total: number } | undefined;
        completedRuns: readonly { runId: string; seed: number; total: number }[];
      }
    | undefined;

  setHiddenRuns(view: {
    activeRun: { seed: number; position: number; total: number } | undefined;
    completedRuns: readonly { runId: string; seed: number; total: number }[];
  }): void {
    this.hiddenRuns = view;
  }
}

type Harness = ReturnType<typeof harness>;

function harness(initialHash: string) {
  const elements: Record<string, FakeElement> = {
    'home-screen': new FakeHomeElement(),
    'math-modeling-puzzle': new FakeElement(),
  };
  const writes: Array<{ hash: string; mode: 'push' | 'replace' }> = [];
  const routeChanges: Array<() => void> = [];
  let currentHash = initialHash;
  const history: HistoryAdapter = {
    push: (hash: string) => writes.push({ hash, mode: 'push' }),
    replace: (hash: string) => writes.push({ hash, mode: 'replace' }),
    onRouteChanged: (listener: () => void) => routeChanges.push(listener),
  };
  const controller = startMathModelingApplication({
    hash: initialHash,
    root: {
      addEventListener: rootListeners.addEventListener.bind(rootListeners),
      querySelector: (selector: string) =>
        elements[selector] as unknown as import('./app-controller').ViewElement | null,
    } as unknown as ParentNode,
    getHash: () => currentHash,
    basePath: '/text-math-modeling-game/',
    history,
  });
  return {
    elements,
    writes,
    routeChanges,
    controller,
    setHash: (hash: string) => {
      currentHash = hash;
    },
  };
}

const rootListeners = new EventTarget();

test('an empty hash starts on home without puzzle or session attributes', () => {
  const h = harness('');
  expect(h.writes).toEqual([{ hash: '#home', mode: 'replace' }]);
  expect(h.elements['home-screen'].hidden).toBe(false);
  expect(h.elements['math-modeling-puzzle'].hidden).toBe(true);
  expect(h.elements['math-modeling-puzzle'].attributes.has('session')).toBe(
    false,
  );
  expect(h.elements['math-modeling-puzzle'].attributes.has('seed')).toBe(false);
});

test('a puzzle deep link reflects seed, theme, mode and language attributes', () => {
  const h = harness(
    '#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation&language=nb',
  );
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.get('seed')).toBe('321');
  expect(puzzle.attributes.get('theme')).toBe('creator.followers');
  expect(puzzle.attributes.get('mode')).toBe('quantities-to-named-equation');
  expect(puzzle.attributes.get('locale')).toBe('nb');
  expect(h.elements['home-screen'].hidden).toBe(true);
});

test('a session deep link sets the session attribute and clears mode', () => {
  const h = harness(
    '#session?seed=918273&scenario=gaming.drone-power&language=nb',
  );
  const puzzle = h.elements['math-modeling-puzzle'];
  expect(puzzle.attributes.get('session')).toBe('918273');
  expect(puzzle.attributes.get('locale')).toBe('nb');
  expect(puzzle.attributes.has('mode')).toBe(false);
  expect(puzzle.attributes.has('seed')).toBe(false);
});

test('an invalid deep link is rejected explicitly', () => {
  expect(() => harness('#puzzle?scenario=creator.followers')).toThrowError(
    /seed/,
  );
  expect(() =>
    harness('#puzzle?seed=17&scenario=unknown.theme&task=story-to-quantities'),
  ).toThrowError(/Unknown scenario/);
  expect(() => harness('#home?language=fr')).toThrowError(/Unknown language/);
  expect(() => harness('#unknown-destination')).toThrowError(
    /No destination is bound/,
  );
});

test('selection requests navigate with the canonical hash and keep language', () => {
  const h = harness('#home?language=nb');
  const puzzleRequest: PuzzleSelectionRequest = {
    seed: 42,
    familyId: 'total-from-parts',
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  };
  rootListeners.dispatchEvent(
    new CustomEvent(puzzleSelectionRequestEvent, { detail: puzzleRequest }),
  );
  expect(h.writes).toEqual([
    {
      hash: '#puzzle?seed=42&family=total-from-parts&scenario=gaming.drone-power&task=quantities-to-named-equation&language=nb',
      mode: 'push',
    },
  ]);
  expect(h.elements['math-modeling-puzzle'].attributes.get('locale')).toBe(
    'nb',
  );

  const sessionRequest: SessionSelectionRequest = {
    seed: 918273,
    themeId: 'creator.followers',
    locale: 'nb',
  };
  rootListeners.dispatchEvent(
    new CustomEvent(sessionSelectionRequestEvent, {
      detail: sessionRequest,
    }),
  );
  expect(h.writes[1]).toEqual({
    hash: '#session?seed=918273&scenario=creator.followers&language=nb',
    mode: 'push',
  });
  expect(h.elements['math-modeling-puzzle'].attributes.get('session')).toBe(
    '918273',
  );
});

test('home navigation keeps the current language and resets selection attributes', () => {
  const h = harness(
    '#session?seed=918273&scenario=creator.followers&language=nb',
  );
  rootListeners.dispatchEvent(
    new CustomEvent(navigateHomeRequestEvent, { detail: {} }),
  );
  expect(h.writes).toEqual([{ hash: '#home?language=nb', mode: 'push' }]);
  expect(h.elements['home-screen'].attributes.get('locale')).toBe('nb');
  expect(h.elements['home-screen'].hidden).toBe(false);
  expect(h.elements['math-modeling-puzzle'].hidden).toBe(true);
});

test('semantic home menu requests start default puzzle and session destinations', () => {
  const h = harness('#home?language=nb');
  rootListeners.dispatchEvent(
    new CustomEvent(navigatePuzzleRequestEvent, {
      detail: { seed: 17, themeId: 'gaming.drone-power', modeId: 'story-to-quantities' },
    }),
  );
  expect(h.writes).toEqual([
    {
      hash: '#puzzle?seed=17&family=total-from-parts&hidden-role=per-item&scenario=gaming.drone-power&task=story-to-quantities&language=nb',
      mode: 'push',
    },
  ]);
  rootListeners.dispatchEvent(
    new CustomEvent(navigateSessionRequestEvent, {
      detail: { seed: 918273, themeId: 'gaming.drone-power' },
    }),
  );
  expect(h.writes[1]).toEqual({
    hash: '#session?seed=918273&scenario=gaming.drone-power&language=nb',
    mode: 'push',
  });
});

test('browser Back/Forward notifications restore routes without new writes', () => {
  const h = harness('#home');
  rootListeners.dispatchEvent(
    new CustomEvent(navigateSessionRequestEvent, {
      detail: { seed: 918273, themeId: 'gaming.drone-power' },
    }),
  );
  const writesBefore = h.writes.length;
  h.setHash('#home');
  for (const notify of h.routeChanges) {
    notify();
  }
  expect(h.writes.length).toBe(writesBefore);
  expect(h.elements['home-screen'].hidden).toBe(false);
  expect(h.elements['math-modeling-puzzle'].hidden).toBe(true);
});

test('an external hash edit restores the route without new writes', () => {
  const h = harness('#home');
  h.setHash(
    '#puzzle?seed=7&scenario=gaming.drone-power&task=story-to-quantities&language=en',
  );
  for (const notify of h.routeChanges) {
    notify();
  }
  expect(h.controller.currentRoute().name).toBe('puzzle');
  expect(h.elements['math-modeling-puzzle'].attributes.get('seed')).toBe('7');
  expect(h.elements['home-screen'].hidden).toBe(true);
  expect(h.writes).toEqual([]);
});

test('unknown selection values in semantic requests are rejected without navigation', () => {
  const h = harness('#home');
  rootListeners.dispatchEvent(
    new CustomEvent(navigatePuzzleRequestEvent, {
      detail: { seed: 17, themeId: 'unknown.theme', modeId: 'story-to-quantities' },
    }),
  );
  rootListeners.dispatchEvent(
    new CustomEvent(navigateSessionRequestEvent, {
      detail: { seed: 918273, themeId: 'unknown.theme' },
    }),
  );
  expect(h.writes).toEqual([]);
  expect(h.elements['home-screen'].hidden).toBe(false);
  expect(h.elements['math-modeling-puzzle'].hidden).toBe(true);
  expect(h.controller.currentRoute().name).toBe('home');
});
