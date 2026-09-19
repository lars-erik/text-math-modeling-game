import { expect, test } from 'vitest';
import {
  formatSearch,
  parseApplicationState,
  startMathModelingApplication,
} from '../../application';
import {
  puzzleSelectionRequestEvent,
  type PuzzleSelectionRequest,
} from './puzzle-request';

class TestPuzzleElement extends EventTarget {
  readonly attributes = new Map<string, string>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
}

test('parses the replay URL into theme, mode, and locale with defaults', () => {
  expect(
    parseApplicationState(
      '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    ),
  ).toEqual({
    seed: 321,
    themeId: 'creator.followers',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
  });
  expect(parseApplicationState('')).toEqual({
    seed: 17,
    themeId: 'gaming.drone-power',
    modeId: 'story-to-quantities',
    locale: 'en',
  });
});

test('reformats the composed selection with replay URL parameters', () => {
  expect(
    formatSearch({
      seed: 321,
      themeId: 'creator.followers',
      modeId: 'quantities-to-named-equation',
      locale: 'nb',
    }),
  ).toBe(
    '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
  );
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
