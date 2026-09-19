import { expect, test } from 'vitest';

import { defaultTotalFromPartsConcepts } from '../problem-generation/generate-total-from-parts';
import { createPuzzle } from './puzzle-definition';
import {
  createSeededModelingCase,
} from './seeded-puzzle';

test('composes two puzzle tasks from the same seeded modeling case', () => {
  const modelingCase = createSeededModelingCase({ seed: 321 });

  const storyPuzzle = createPuzzle(modelingCase, 'story-to-quantities');
  const namedPuzzle = createPuzzle(
    modelingCase,
    'quantities-to-named-equation',
  );

  expect(storyPuzzle.modelingCase).toBe(modelingCase);
  expect(namedPuzzle.modelingCase).toBe(modelingCase);
  expect(storyPuzzle.task).toBe('story-to-quantities');
  expect(namedPuzzle.task).toBe('quantities-to-named-equation');
});

test('creates a seeded modeling case with the scenario-bound problem', () => {
  const modelingCase = createSeededModelingCase({ seed: 321 });

  expect(modelingCase.problem.replay).toEqual({
    seed: 321,
    generatorVersion: 'total-from-parts-v1',
  });
  expect(
    modelingCase.problem.quantities.find(
      (quantity) => quantity.id === 'dronePower',
    )?.given,
  ).toEqual({ kind: 'hidden' });
  expect(modelingCase.storySeed).toBe(321);
});

test('uses explicit scenario and concept inputs when creating a seeded puzzle', () => {
  const modelingCase = createSeededModelingCase({
    seed: 321,
    scenarioId: 'creator.followers',
    concepts: defaultTotalFromPartsConcepts,
  });

  expect(modelingCase.problem.scenarioId).toBe('creator.followers');
  expect(modelingCase.problem.concepts).toEqual(defaultTotalFromPartsConcepts);
  expect(
    modelingCase.problem.quantities.map((quantity) => quantity.id),
  ).toEqual([
    'startingFollowers',
    'promotedPostCount',
    'followersPerPost',
    'finalFollowers',
  ]);
});

test('provides the localized creator story through the scenario-selected puzzle definition', () => {
  const modelingCase = createSeededModelingCase({
    seed: 321,
    scenarioId: 'creator.followers',
    concepts: defaultTotalFromPartsConcepts,
  });

  const definition = modelingCase.storyQuantities?.createDefinition('nb');

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
  const modelingCase = createSeededModelingCase({
    seed: 321,
    scenarioId: 'creator.followers',
    concepts: defaultTotalFromPartsConcepts,
  });

  expect(modelingCase.namedEquation?.createDefinition('nb')).toMatchObject({
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
  const modelingCase = createSeededModelingCase({ seed: 321 });

  expect(modelingCase.namedEquation?.createDefinition('nb')).toMatchObject({
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
