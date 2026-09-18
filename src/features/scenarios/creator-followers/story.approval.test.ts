import { test } from 'vitest';

import { verifyApproval } from '../../../testing/approvals';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { printCreatorFollowersStoryAndFacts } from './print-story-and-facts';
import { renderCreatorFollowersStory } from './render-story';
import {
  bindCreatorFollowersScenario,
  planCreatorFollowersStory,
} from './scenario';

test('approves the English creator story and fact ledger', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);
  const plan = planCreatorFollowersStory(binding, 17);
  const story = renderCreatorFollowersStory(binding, plan, 'en');

  verifyApproval(
    import.meta.url,
    'creator-followers-en',
    printCreatorFollowersStoryAndFacts(story, plan, binding),
  );
});

test('approves the Norwegian Bokmål creator story and identical fact ledger', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);
  const plan = planCreatorFollowersStory(binding, 17);
  const story = renderCreatorFollowersStory(binding, plan, 'nb');

  verifyApproval(
    import.meta.url,
    'creator-followers-nb',
    printCreatorFollowersStoryAndFacts(story, plan, binding),
  );
});
