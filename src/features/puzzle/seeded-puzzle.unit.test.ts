import { expect, test } from 'vitest';

import { referencePuzzle } from './reference-puzzle';
import { createSeededPuzzle } from './seeded-puzzle';

test('creates a seeded puzzle definition with the generated problem', () => {
  const puzzle = createSeededPuzzle({ seed: 321 });

  expect(puzzle.problem.replay).toEqual({
    seed: 321,
    generatorVersion: 'total-from-parts-v1',
  });
  expect(
    puzzle.problem.quantities.find((quantity) => quantity.id === 'unitValue')?.given,
  ).toEqual({ kind: 'hidden' });
  expect(puzzle.learnerNames).toEqual(referencePuzzle.learnerNames);
  expect(puzzle.choices).toEqual(referencePuzzle.choices);
});
