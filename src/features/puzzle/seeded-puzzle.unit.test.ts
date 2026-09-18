import { expect, test } from 'vitest';

import { defaultTotalFromPartsConcepts } from '../problem-generation/generate-total-from-parts';
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

test('uses explicit scenario and concept inputs when creating a seeded puzzle', () => {
  const puzzle = createSeededPuzzle({
    seed: 321,
    scenarioId: 'creator.followers',
    concepts: defaultTotalFromPartsConcepts,
  });

  expect(puzzle.problem.scenarioId).toBe('creator.followers');
  expect(puzzle.problem.concepts).toEqual(defaultTotalFromPartsConcepts);
  expect(puzzle.problem.quantities.map((quantity) => quantity.id)).toEqual([
    'startingFollowers',
    'promotedPostCount',
    'followersPerPost',
    'finalFollowers',
  ]);
});

test('provides the localized creator story through the scenario-selected puzzle definition', () => {
  const puzzle = createSeededPuzzle({
    seed: 321,
    scenarioId: 'creator.followers',
    concepts: defaultTotalFromPartsConcepts,
  });

  const definition = puzzle.storyQuantities?.createDefinition('nb');

  expect(definition?.sourceText).toContain(
    'En innholdsskaper starter med',
  );
  expect(definition?.choices).toContainEqual(
    expect.objectContaining({
      id: 'followersPerPost',
      variableName: 'foelgerePerInnlegg',
      displayValue: '?',
    }),
  );
  expect(definition?.replay?.scenarioId).toBe('creator.followers');
});

test('provides localized creator names for the named-equation puzzle', () => {
  const puzzle = createSeededPuzzle({
    seed: 321,
    scenarioId: 'creator.followers',
    concepts: defaultTotalFromPartsConcepts,
  });

  expect(puzzle.namedEquation?.createDefinition('nb')).toMatchObject({
    quantityNames: {
      startingFollowers: 'startFoelgere',
      promotedPostCount: 'promoterteInnlegg',
      followersPerPost: 'foelgerePerInnlegg',
      finalFollowers: 'sluttFoelgere',
    },
    choices: [
      {
        id: 'matching',
        label:
          'sluttFoelgere = startFoelgere + promoterteInnlegg * foelgerePerInnlegg',
      },
      {
        id: 'base-per-item',
        label:
          'sluttFoelgere = promoterteInnlegg * (startFoelgere + foelgerePerInnlegg)',
      },
    ],
  });
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
