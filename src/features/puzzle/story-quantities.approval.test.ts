import { test } from 'vitest';

import { verifyApproval } from '../../testing/approvals';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { createDronePowerStoryQuantitiesDefinition } from '../scenarios/gaming-drone-power/story-quantities-definition';
import { printStoryQuantitiesScreen } from './print-story-quantities-screen';
import {
  startStoryQuantitiesPuzzle,
  submitStoryQuantitiesPuzzle,
} from './story-quantities';

test('approves a real Story-to-Quantities use-case transcript', () => {
  const definition = createDronePowerStoryQuantitiesDefinition({
    problem: totalFromPartsProblem,
    storySeed: 17,
    locale: 'en',
  });
  const start = startStoryQuantitiesPuzzle(definition);
  const incorrect = submitStoryQuantitiesPuzzle(definition, {
    knownIds: ['basePower', 'droneCount'],
    unknownId: 'totalPower',
  });
  const accepted = submitStoryQuantitiesPuzzle(definition, {
    knownIds: ['basePower', 'droneCount', 'totalPower'],
    unknownId: 'dronePower',
  });

  verifyApproval(
    import.meta.url,
    'story-quantities-transcript',
    [
      '=== Start ===\n',
      printStoryQuantitiesScreen(start),
      '=== Incorrect submission ===\n',
      printStoryQuantitiesScreen(incorrect),
      '=== Accepted submission ===\n',
      printStoryQuantitiesScreen(accepted),
    ].join(''),
  );
});
