import { expect, test } from 'vitest';

import { createSeededPuzzle } from './seeded-puzzle';

test('creates a seeded Story-to-Quantities definition with the scenario-bound problem', () => {
  const puzzle = createSeededPuzzle({ seed: 321 });

  expect(puzzle.kind).toBe('story-to-quantities');
  expect(puzzle.problem.replay).toEqual({
    seed: 321,
    generatorVersion: 'total-from-parts-v1',
  });
  expect(
    puzzle.problem.quantities.find((quantity) => quantity.id === 'dronePower')?.given,
  ).toEqual({ kind: 'hidden' });
  expect(puzzle.storySeed).toBe(321);
});

test('provides locale-consistent names for the preserved named-equation puzzle', () => {
  const puzzle = createSeededPuzzle({ seed: 321 });

  expect(puzzle.namedEquation?.createDefinition('nb')).toMatchObject({
    quantityNames: {
      basePower: 'grunnEffekt',
      droneCount: 'droneAntall',
      dronePower: 'droneEffekt',
      totalPower: 'totalEffekt',
    },
    choices: [
      {
        id: 'matching',
        label: 'totalEffekt = grunnEffekt + droneAntall * droneEffekt',
      },
      {
        id: 'base-per-item',
        label: 'totalEffekt = droneAntall * (grunnEffekt + droneEffekt)',
      },
    ],
  });
});
