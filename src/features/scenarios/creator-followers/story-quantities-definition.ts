import type { Problem } from '../../problem-model/problem';
import { puzzleResources, type PuzzleLocale } from '../../puzzle/lang';
import type { StoryQuantitiesPuzzleDefinition } from '../../puzzle/story-quantities';
import { creatorFollowersResources } from './lang';
import { renderCreatorFollowersStory } from './render-story';
import {
  bindCreatorFollowersScenario,
  planCreatorFollowersStory,
} from './scenario';

export function createCreatorFollowersStoryQuantitiesDefinition({
  problem,
  storySeed,
  locale,
}: {
  problem: Problem;
  storySeed: number;
  locale: PuzzleLocale;
}): StoryQuantitiesPuzzleDefinition {
  const binding = bindCreatorFollowersScenario(problem);
  const plan = planCreatorFollowersStory(binding, storySeed);
  const story = renderCreatorFollowersStory(binding, plan, locale);
  const scenarioResources = creatorFollowersResources[locale];
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
