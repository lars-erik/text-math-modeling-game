import { expect, test } from 'vitest';

import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { bindDronePowerScenario, planDronePowerStory } from './scenario';
import { renderDronePowerStory } from './render-story';

test('renders the reference English story from planned validated facts', () => {
  const facts = bindDronePowerScenario(totalFromPartsProblem);
  const plan = planDronePowerStory(facts, 17);

  expect(renderDronePowerStory(facts, plan, 'en')).toEqual({
    text: 'A ship uses 30 MW for basic systems. Four identical drones are active. Together they draw 210 MW. How much power does one drone draw?',
    replay: {
      locale: 'en',
      scenarioId: 'gaming.drone-power',
      storySeed: 17,
    },
  });
});

test('locale changes rendered wording without changing the deterministic StoryPlan', () => {
  const facts = bindDronePowerScenario(totalFromPartsProblem);
  const firstPlan = planDronePowerStory(facts, 17);
  const replayedPlan = planDronePowerStory(facts, 17);
  const english = renderDronePowerStory(facts, firstPlan, 'en');
  const norwegian = renderDronePowerStory(facts, firstPlan, 'nb');

  expect(replayedPlan).toEqual(firstPlan);
  expect(norwegian.text).toBe(
    'Et skip bruker 30 MW til grunnleggende systemer. Fire identiske droner er aktive. Til sammen trekker de 210 MW. Hvor mye effekt trekker én drone?',
  );
  expect(norwegian.text).not.toBe(english.text);
  expect(english.text).not.toContain('45');
  expect(norwegian.text).not.toContain('45');
  expect(norwegian.replay).toEqual({
    locale: 'nb',
    scenarioId: firstPlan.scenarioId,
    storySeed: firstPlan.seed,
  });
});
