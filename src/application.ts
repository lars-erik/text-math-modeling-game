import type { PuzzleRegistry } from './features/puzzle/puzzle-definition';
import { referencePuzzle } from './features/puzzle/reference-puzzle';
import { createSeededPuzzle } from './features/puzzle/seeded-puzzle';

export const generatedPuzzleKey = 'generated';

export function startMathModelingApplication({
  search,
  root,
}: {
  search: string;
  root: ParentNode;
}): void {
  const seedText = new URLSearchParams(search).get('seed');
  const registry: Record<string, PuzzleRegistry[string]> = {
    reference: referencePuzzle,
  };

  if (seedText !== null) {
    const seed = parseSeed(seedText);
    registry[generatedPuzzleKey] = createSeededPuzzle({ seed });
    root
      .querySelector('math-modeling-puzzle')
      ?.setAttribute('puzzle', generatedPuzzleKey);
  }

  globalThis.mathModelingPuzzles = registry;
}

function parseSeed(seedText: string): number {
  if (!/^(0|[1-9]\d*)$/.test(seedText)) {
    throw new Error('URL seed must be an unsigned decimal integer.');
  }

  return Number(seedText);
}
