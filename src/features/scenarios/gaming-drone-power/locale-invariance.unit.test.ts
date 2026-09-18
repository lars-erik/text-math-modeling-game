import { expect, test } from 'vitest';

import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../../problem-generation/generate-total-from-parts';
import {
  allProblemConstraintCodes,
  validateProblemAst,
  validateProblemConstraints,
} from '../../problem-model/problem-validation';
import { renderDronePowerStory } from './render-story';
import {
  bindDronePowerAnswerKey,
  bindDronePowerScenario,
  planDronePowerStory,
} from './scenario';

test('locale rendering preserves the validated AST, AnswerKey, StoryPlan, and hidden role', () => {
  const generated = generateTotalFromPartsCase({
    seed: 17,
    config: defaultTotalFromPartsGenerationConfig,
  });
  const binding = bindDronePowerScenario(generated.problem);
  const answerKey = bindDronePowerAnswerKey(generated.answerKey, binding);
  const plan = planDronePowerStory(binding, 99);
  const problemBeforeRendering = structuredClone(binding.problem);
  const answerBeforeRendering = structuredClone(answerKey);

  const english = renderDronePowerStory(binding, plan, 'en');
  const norwegian = renderDronePowerStory(binding, plan, 'nb');

  expect(binding.problem).toEqual(problemBeforeRendering);
  expect(answerKey).toEqual(answerBeforeRendering);
  expect(planDronePowerStory(binding, 99)).toEqual(plan);
  expect(binding.facts.filter((fact) => fact.visibility === 'hidden')).toEqual([
    expect.objectContaining({ id: 'dronePower', role: 'unitValue' }),
  ]);
  expect(validateProblemAst(binding.problem)).toEqual([]);
  expect(
    validateProblemConstraints(
      binding.problem,
      answerKey,
      allProblemConstraintCodes,
    ),
  ).toEqual([]);
  expect(english.replay).toEqual({
    locale: 'en',
    scenarioId: 'gaming.drone-power',
    storySeed: 99,
  });
  expect(norwegian.replay).toEqual({
    locale: 'nb',
    scenarioId: 'gaming.drone-power',
    storySeed: 99,
  });
});
