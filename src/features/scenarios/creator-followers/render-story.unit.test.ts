import { expect, test } from 'vitest';

import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { renderCreatorFollowersStory } from './render-story';
import {
  bindCreatorFollowersScenario,
  planCreatorFollowersStory,
} from './scenario';

test('renders the reference English creator story from planned facts', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);
  const plan = planCreatorFollowersStory(binding, 17);

  expect(renderCreatorFollowersStory(binding, plan, 'en')).toEqual({
    text: 'A creator starts with 30 followers. Each of four promoted posts gains the same number of followers. The creator finishes with 210 followers. How many followers does each post gain?',
    replay: {
      locale: 'en',
      scenarioId: 'creator.followers',
      storySeed: 17,
    },
  });
});

test('renders the same creator plan in Norwegian Bokmål without revealing the answer', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);
  const plan = planCreatorFollowersStory(binding, 17);
  const story = renderCreatorFollowersStory(binding, plan, 'nb');

  expect(story.text).toBe(
    'En innholdsskaper starter med 30 følgere. Fire promoterte innlegg gir like mange nye følgere hver. Innholdsskaperen ender med 210 følgere. Hvor mange følgere gir hvert innlegg?',
  );
  expect(story.text).not.toContain('45');
  expect(story.replay).toEqual({
    locale: 'nb',
    scenarioId: 'creator.followers',
    storySeed: 17,
  });
});
