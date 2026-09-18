import { expect, test } from 'vitest';

import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { createDronePowerStoryQuantitiesDefinition } from '../scenarios/gaming-drone-power/story-quantities-definition';
import {
  startStoryQuantitiesPuzzle,
  submitStoryQuantitiesPuzzle,
} from './story-quantities';

test('starts with the rendered story and canonical localized quantity choices', () => {
  const definition = createDronePowerStoryQuantitiesDefinition({
    problem: totalFromPartsProblem,
    storySeed: 17,
    locale: 'en',
  });

  const screen = startStoryQuantitiesPuzzle(definition);

  expect(screen.source).toEqual({
    kind: 'story',
    text: 'A ship uses 30 MW for basic systems. Four identical drones are active. Together they draw 210 MW. How much power does one drone draw?',
  });
  expect(screen.target.choices).toContainEqual({
    id: 'dronePower',
    label: 'power per drone',
    variableName: 'dronePower',
    displayValue: '?',
  });
  expect(JSON.stringify(screen)).not.toContain('45');
});

test('rejects an incorrect semantic selection and preserves it for revision', () => {
  const definition = createDronePowerStoryQuantitiesDefinition({
    problem: totalFromPartsProblem,
    storySeed: 17,
    locale: 'en',
  });

  const screen = submitStoryQuantitiesPuzzle(definition, {
    knownIds: ['basePower', 'droneCount'],
    unknownId: 'totalPower',
  });

  expect(screen.input).toEqual({
    kind: 'quantity-selection',
    knownIds: ['basePower', 'droneCount'],
    unknownId: 'totalPower',
  });
  expect(screen.feedback).toEqual({
    kind: 'incorrect',
    message: 'Not quite. Review which values the story gives and which one it asks for.',
  });
});

test('accepts the canonical known facts and hidden role independent of labels', () => {
  const definition = createDronePowerStoryQuantitiesDefinition({
    problem: totalFromPartsProblem,
    storySeed: 17,
    locale: 'nb',
  });

  const screen = submitStoryQuantitiesPuzzle(definition, {
    knownIds: ['totalPower', 'basePower', 'droneCount'],
    unknownId: 'dronePower',
  });

  expect(screen.feedback).toEqual({
    kind: 'accepted',
    message: 'Størrelsene stemmer med fortellingen.',
  });
});
