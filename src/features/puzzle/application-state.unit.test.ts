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
      '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    ),
  ).toEqual({
    kind: 'puzzle',
    seed: 321,
    themeId: 'creator.followers',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  });
  expect(parseApplicationState('')).toEqual({
    kind: 'puzzle',
    seed: 17,
    themeId: 'gaming.drone-power',
    modeId: 'story-to-quantities',
    locale: 'en',
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
    '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
  );
});

test('parses and reproduces both academic notation task URLs', () => {
  for (const modeId of [
    'named-equation-to-academic-notation',
    'academic-notation-to-named-equation',
  ] as const) {
    const search = `?seed=321&scenario=creator.followers&task=${modeId}&locale=nb`;
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
      '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
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
    search: '?seed=321&scenario=creator.followers',
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
    '?seed=42&scenario=gaming.drone-power&task=quantities-to-named-equation&locale=nb',
  ]);
});

test('parses the session replay URL into a session application state', () => {
  expect(
    parseApplicationState(
      '?session=918273&scenario=creator.followers&locale=nb',
    ),
  ).toEqual({
    kind: 'session',
    seed: 918273,
    themeId: 'creator.followers',
    locale: 'nb',
  });
  expect(parseApplicationState('?session=918273')).toEqual({
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
  ).toBe('?session=918273&scenario=creator.followers&locale=nb');
});

test('drives the puzzle element through a session attribute from a session URL', () => {
  const puzzleElement = new TestPuzzleElement();
  startMathModelingApplication({
    search: '?session=918273&scenario=creator.followers&locale=nb',
    root: {
      querySelector: () => puzzleElement,
    } as unknown as ParentNode,
  });
  expect(puzzleElement.attributes.get('session')).toBe('918273');
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
    search: '?session=918273',
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
    '?seed=42&scenario=gaming.drone-power&task=quantities-to-named-equation&locale=nb',
  ]);
});

test('session selection requests update the element and the replay URL', () => {
  const puzzleElement = new TestPuzzleElement();
  const replacedSearches: string[] = [];
  const root = {
    querySelector: () => puzzleElement,
  } as unknown as ParentNode;
  startMathModelingApplication({
    search: '?seed=17',
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
  expect(puzzleElement.attributes.get('session')).toBe('918273');
  expect(puzzleElement.attributes.get('theme')).toBe('creator.followers');
  expect(puzzleElement.attributes.get('locale')).toBe('nb');
  expect(puzzleElement.attributes.has('mode')).toBe(false);
  expect(replacedSearches).toEqual([
    '?session=918273&scenario=creator.followers&locale=nb',
  ]);
});

test('rejects invalid session seeds', () => {
  expect(() => parseApplicationState('?session=-1')).toThrowError(
    /unsigned 32-bit/,
  );
});

test('rejects unknown replay URL values with typed errors', () => {
  expect(() => parseApplicationState('?scenario=unknown.theme')).toThrowError(
    /Unknown scenario/,
  );
  expect(() => parseApplicationState('?task=unknown-task')).toThrowError(
    /Unknown puzzle task/,
  );
  expect(() => parseApplicationState('?locale=fr')).toThrowError(
    /Unknown locale/,
  );
  expect(() => parseApplicationState('?seed=-1')).toThrowError(
    /unsigned 32-bit/,
  );
});
