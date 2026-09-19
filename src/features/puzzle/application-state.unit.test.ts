import { expect, test } from 'vitest';

import {
  generatedPuzzleKey,
  parseApplicationState,
  startMathModelingApplication,
} from '../../application';
import type { PuzzleRegistry } from './puzzle-definition';
import {
  puzzleSelectionRequestEvent,
  type PuzzleSelectionRequest,
} from './puzzle-request';

test('parses the selected task and locale with the generated case request', () => {
  expect(
    parseApplicationState(
      '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    ),
  ).toEqual({
    seed: 321,
    scenarioId: 'creator.followers',
    task: 'quantities-to-named-equation',
    locale: 'nb',
  });
});

test('composes the URL-selected task into the generated puzzle registry entry', () => {
  const puzzleElement = new TestPuzzleElement();

  startMathModelingApplication({
    search:
      '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    root: {
      querySelector: () => puzzleElement,
    } as unknown as ParentNode,
  });

  const registry = globalThis.mathModelingPuzzles as PuzzleRegistry;
  expect(registry[generatedPuzzleKey]?.task).toBe(
    'quantities-to-named-equation',
  );
  expect(JSON.stringify(registry[generatedPuzzleKey])).not.toContain(
    'answerKey',
  );
  expect(puzzleElement.attributes.get('locale')).toBe('nb');
});

test('reuses the modeling case while task and locale update the complete URL state', () => {
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
  const originalCase = globalThis.mathModelingPuzzles?.[generatedPuzzleKey]
    ?.modelingCase;

  puzzleElement.dispatchEvent(
    new CustomEvent<PuzzleSelectionRequest>(puzzleSelectionRequestEvent, {
      detail: {
        seed: 321,
        scenarioId: 'creator.followers',
        task: 'quantities-to-named-equation',
        locale: 'nb',
      },
    }),
  );

  const selected = globalThis.mathModelingPuzzles?.[generatedPuzzleKey];
  expect(selected?.modelingCase).toBe(originalCase);
  expect(selected?.task).toBe('quantities-to-named-equation');
  expect(replacedSearches).toEqual([
    '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
  ]);
});

class TestPuzzleElement extends EventTarget {
  readonly attributes = new Map<string, string>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
}
