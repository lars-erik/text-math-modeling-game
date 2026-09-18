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
