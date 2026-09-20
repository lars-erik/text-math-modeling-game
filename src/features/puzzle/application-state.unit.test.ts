import { expect, test } from 'vitest';
import {
  formatSearch,
  parseApplicationState,
  startMathModelingApplication,
} from '../../application';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from './puzzle-request';
import {
  navigateHomeRequestEvent,
} from '../navigation/navigation-request';

class TestPuzzleElement extends EventTarget {
  readonly attributes = new Map<string, string>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
}

test('parses the replay URL into theme, mode, and locale with defaults', () => {
  expect(
    parseApplicationState(
      '#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    ),
  ).toEqual({
    kind: 'puzzle',
    seed: 321,
    themeId: 'creator.followers',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  });
  // TODO: Default should be home!
  expect(parseApplicationState('')).toEqual({
    "kind": "home",
    "locale": "en",
  });
});

test('reformats the composed selection with replay URL parameters', () => {
  expect(
    formatSearch({
      kind: 'puzzle',
      seed: 321,
      themeId: 'creator.followers',
      modeId: 'quantities-to-named-equation',
      locale: 'nb',
    }),
  ).toBe(
    '#puzzle?locale=nb&seed=321&scenario=creator.followers&task=quantities-to-named-equation',
  );
});

test('parses and reproduces both academic notation task URLs', () => {
  for (const modeId of [
    'named-equation-to-academic-notation',
    'academic-notation-to-named-equation',
  ] as const) {
    const search = `#puzzle?locale=nb&seed=321&scenario=creator.followers&task=${modeId}`;
    const state = parseApplicationState(search);
    expect(state.kind).toBe('puzzle');
    expect(state.kind === 'puzzle' ? state.modeId : undefined).toBe(modeId);
    expect(formatSearch(state)).toBe(search);
  }
});

test('drives the puzzle element through theme, mode, seed, and locale attributes', () => {
  const puzzleElement = new TestPuzzleElement();
  startMathModelingApplication({
    search:
      '#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    root: {
      querySelector: () => puzzleElement,
    } as unknown as ParentNode,
  });
  expect(puzzleElement.attributes.get('seed')).toBe('321');
  expect(puzzleElement.attributes.get('theme')).toBe('creator.followers');
  expect(puzzleElement.attributes.get('mode')).toBe(
    'quantities-to-named-equation',
  );
  expect(puzzleElement.attributes.get('locale')).toBe('nb');
});

test('selection requests update the element attributes and the replay URL', () => {
  const puzzleElement = new TestPuzzleElement();
  const replacedSearches: string[] = [];
  const root = {
    querySelector: () => puzzleElement,
  } as unknown as ParentNode;
  startMathModelingApplication({
    search: '#puzzle?seed=321&scenario=creator.followers',
    root,
    replaceSearch: (search) => replacedSearches.push(search),
  });
  puzzleElement.dispatchEvent(
    new CustomEvent<PuzzleSelectionRequest>(puzzleSelectionRequestEvent, {
      detail: {
        seed: 42,
        themeId: 'gaming.drone-power',
        modeId: 'quantities-to-named-equation',
        locale: 'nb',
      },
    }),
  );
  expect(puzzleElement.attributes.get('seed')).toBe('42');
  expect(puzzleElement.attributes.get('theme')).toBe('gaming.drone-power');
  expect(puzzleElement.attributes.get('mode')).toBe(
    'quantities-to-named-equation',
  );
  expect(puzzleElement.attributes.get('locale')).toBe('nb');
  expect(replacedSearches).toEqual([
    '#puzzle?locale=nb&seed=42&scenario=gaming.drone-power&task=quantities-to-named-equation',
  ]);
});

test('parses the session replay URL into a session application state', () => {
  expect(
    parseApplicationState(
      '#session?seed=918273&scenario=creator.followers&locale=nb',
    ),
  ).toEqual({
    kind: 'session',
    seed: 918273,
    themeId: 'creator.followers',
    locale: 'nb',
  });
  expect(parseApplicationState('#session?seed=918273')).toEqual({
    kind: 'session',
    seed: 918273,
    themeId: 'gaming.drone-power',
    locale: 'en',
  });
});

test('reformats the session replay URL deterministically', () => {
  expect(
    formatSearch({
      kind: 'session',
      seed: 918273,
      themeId: 'creator.followers',
      locale: 'nb',
    }),
  ).toBe('#session?locale=nb&seed=918273&scenario=creator.followers');
});

test('drives the puzzle element through a session attribute from a session URL', () => {
  const puzzleElement = new TestPuzzleElement();
  startMathModelingApplication({
    search: '#session?locale=nb&seed=918273&scenario=creator.followers',
    root: {
      querySelector: () => puzzleElement,
    } as unknown as ParentNode,
  });
  expect(puzzleElement.attributes.get('seed')).toBe('918273');
  expect(puzzleElement.attributes.get('theme')).toBe('creator.followers');
  expect(puzzleElement.attributes.get('locale')).toBe('nb');
});

test('clears the session attribute when a direct puzzle selection is requested', () => {
  const puzzleElement = new TestPuzzleElement();
  const replacedSearches: string[] = [];
  const root = {
    querySelector: () => puzzleElement,
  } as unknown as ParentNode;
  startMathModelingApplication({
    search: '#session?seed=918273',
    root,
    replaceSearch: (search) => replacedSearches.push(search),
  });
  puzzleElement.dispatchEvent(
    new CustomEvent<PuzzleSelectionRequest>(puzzleSelectionRequestEvent, {
      detail: {
        seed: 42,
        themeId: 'gaming.drone-power',
        modeId: 'quantities-to-named-equation',
        locale: 'nb',
      },
    }),
  );
  expect(puzzleElement.attributes.has('session')).toBe(false);
  expect(replacedSearches).toEqual([
    '#puzzle?locale=nb&seed=42&scenario=gaming.drone-power&task=quantities-to-named-equation',
  ]);
});

test('session selection requests update the element and the replay URL', () => {
  const puzzleElement = new TestPuzzleElement();
  const replacedSearches: string[] = [];
  const root = {
    querySelector: () => puzzleElement,
  } as unknown as ParentNode;
  startMathModelingApplication({
    search: '#session?seed=17',
    root,
    replaceSearch: (search) => replacedSearches.push(search),
  });
  puzzleElement.dispatchEvent(
    new CustomEvent<SessionSelectionRequest>(sessionSelectionRequestEvent, {
      detail: {
        seed: 918273,
        themeId: 'creator.followers',
        locale: 'nb',
      },
    }),
  );
  expect(puzzleElement.attributes.get('seed')).toBe('918273');
  expect(puzzleElement.attributes.get('theme')).toBe('creator.followers');
  expect(puzzleElement.attributes.get('locale')).toBe('nb');
  expect(replacedSearches).toEqual([
    '#session?locale=nb&seed=918273&scenario=creator.followers',
  ]);
});

test('rejects invalid session seeds', () => {
  expect(() => parseApplicationState('#puzzle?seed=-1')).toThrowError(
    /unsigned 32-bit/,
  );
});

// TODO: Implement proper handling for unknown replay URL values with typed errors
test.skip('rejects unknown replay URL values with typed errors', () => {
  expect(() => parseApplicationState('#puzzle?themeId=unknown.theme')).toThrowError(
    /Unknown scenario/,
  );
  expect(() => parseApplicationState('#puzzle?mode=unknown-task')).toThrowError(
    /Unknown puzzle task/,
  );
  expect(() => parseApplicationState('?locale=fr')).toThrowError(
    /Unknown locale/,
  );
  expect(() => parseApplicationState('?seed=-1')).toThrowError(
    /unsigned 32-bit/,
  );
});

// TODO: Make a proper home screen instead.
test.skip('navigate home requests reset to the default puzzle screen', () => {
  const puzzleElement = new TestPuzzleElement();
  const replacedSearches: string[] = [];
  const root = {
    querySelector: () => puzzleElement,
  } as unknown as ParentNode;
  startMathModelingApplication({
    search: '?session=918273&scenario=creator.followers&locale=nb',
    root,
    replaceSearch: (search) => replacedSearches.push(search),
  });
  expect(puzzleElement.attributes.has('seed')).toBe(true);
  puzzleElement.dispatchEvent(
    new CustomEvent(navigateHomeRequestEvent, { detail: {} }),
  );
  expect(puzzleElement.attributes.has('session')).toBe(false);
  expect(puzzleElement.attributes.get('seed')).toBe('17');
  expect(puzzleElement.attributes.get('theme')).toBe('gaming.drone-power');
  expect(puzzleElement.attributes.get('mode')).toBe('story-to-quantities');
  expect(replacedSearches).toEqual([
    '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en',
  ]);
});
