import { expect, test } from 'vitest';

import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../../problem-generation/generate-total-from-parts';
import { renderCreatorFollowersStory } from './render-story';
import {
  bindCreatorFollowersAnswerKey,
  bindCreatorFollowersScenario,
  planCreatorFollowersStory,
} from './scenario';

test('locale rendering preserves creator Problem, AnswerKey, StoryPlan, and hidden role', () => {
  const generated = generateTotalFromPartsCase({
    seed: 17,
    config: {
      ...defaultTotalFromPartsGenerationConfig,
      scenarioId: 'creator.followers',
    },
  });
  const binding = bindCreatorFollowersScenario(generated.problem);
  const answerKey = bindCreatorFollowersAnswerKey(generated.answerKey, binding);
  const plan = planCreatorFollowersStory(binding, 99);
  const problemBeforeRendering = structuredClone(binding.problem);
  const answerBeforeRendering = structuredClone(answerKey);

  const english = renderCreatorFollowersStory(binding, plan, 'en');
  const norwegian = renderCreatorFollowersStory(binding, plan, 'nb');

  expect(binding.problem).toEqual(problemBeforeRendering);
  expect(answerKey).toEqual(answerBeforeRendering);
  expect(planCreatorFollowersStory(binding, 99)).toEqual(plan);
  expect(binding.facts.filter((fact) => fact.visibility === 'hidden')).toEqual([
    expect.objectContaining({ id: 'followersPerPost', role: 'unitValue' }),
  ]);
  expect(english.text).not.toBe(norwegian.text);
  expect(english.replay.scenarioId).toBe(plan.scenarioId);
  expect(norwegian.replay.storySeed).toBe(plan.seed);
});
