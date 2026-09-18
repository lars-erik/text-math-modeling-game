import { test } from 'vitest';

import { verifyApproval } from '../../../testing/approvals';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { printStoryAndFacts } from './print-story-and-facts';
import { renderDronePowerStory } from './render-story';
import { bindDronePowerScenario, planDronePowerStory } from './scenario';

test('approves the English reference story and fact ledger', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);
  const plan = planDronePowerStory(binding, 17);
  const story = renderDronePowerStory(binding, plan, 'en');

  verifyApproval(
    import.meta.url,
    'gaming-drone-power-en',
    printStoryAndFacts(story, plan, binding),
  );
});

test('approves the Norwegian Bokmål reference story and identical fact ledger', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);
  const plan = planDronePowerStory(binding, 17);
  const story = renderDronePowerStory(binding, plan, 'nb');

  verifyApproval(
    import.meta.url,
    'gaming-drone-power-nb',
    printStoryAndFacts(story, plan, binding),
  );
});
