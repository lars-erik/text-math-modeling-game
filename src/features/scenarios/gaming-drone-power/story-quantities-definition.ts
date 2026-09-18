import type { Problem } from '../../problem-model/problem';
import { puzzleResources, type PuzzleLocale } from '../../puzzle/lang';
import type { StoryQuantitiesPuzzleDefinition } from '../../puzzle/story-quantities';
import { dronePowerResources } from './lang';
import { renderDronePowerStory } from './render-story';
import { bindDronePowerScenario, planDronePowerStory } from './scenario';

export function createDronePowerStoryQuantitiesDefinition({
  problem,
  storySeed,
  locale,
}: {
  problem: Problem;
  storySeed: number;
  locale: PuzzleLocale;
}): StoryQuantitiesPuzzleDefinition {
  const binding = bindDronePowerScenario(problem);
  const plan = planDronePowerStory(binding, storySeed);
  const story = renderDronePowerStory(binding, plan, locale);
  const scenarioResources = dronePowerResources[locale];
  const genericResources = puzzleResources[locale];

  return {
    sourceText: story.text,
    prompt: genericResources.storyToQuantities.prompt,
    choices: binding.facts.map((fact) => ({
      id: fact.id,
      label: scenarioResources.quantities[fact.id].label,
      variableName: scenarioResources.quantities[fact.id].variableName,
      displayValue:
        fact.visibility === 'known'
          ? `${fact.value} ${scenarioResources.units[fact.unitKey]}`
          : '?',
    })),
    facts: binding.facts.map(({ id, visibility }) => ({ id, visibility })),
    messages: {
      accepted: genericResources.storyToQuantities.accepted,
      incorrect: genericResources.storyToQuantities.incorrect,
    },
    replay: problem.replay
      ? {
          ...problem.replay,
          locale,
          scenarioId: story.replay.scenarioId,
          storySeed: story.replay.storySeed,
        }
      : undefined,
  };
}
