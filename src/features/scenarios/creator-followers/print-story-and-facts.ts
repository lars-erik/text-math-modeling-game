import type { RenderedCreatorFollowersStory } from './render-story';
import type {
  CreatorFollowersScenarioBinding,
  CreatorFollowersStoryPlan,
} from './scenario';

export function printCreatorFollowersStoryAndFacts(
  story: RenderedCreatorFollowersStory,
  plan: CreatorFollowersStoryPlan,
  binding: CreatorFollowersScenarioBinding,
): string {
  const lines = [
    `story scenario=${story.replay.scenarioId} locale=${story.replay.locale} seed=${story.replay.storySeed}`,
    story.text,
    'plan',
    ...plan.sentences.map(
      (sentence) =>
        `  ${sentence.fragmentKey} fact=${sentence.factId}${'nounKey' in sentence ? ` noun=${sentence.nounKey}` : ''}`,
    ),
    `  ${plan.question.fragmentKey} fact=${plan.question.factId} noun=${plan.question.nounKey}`,
    'facts',
    ...binding.facts.map(
      (fact) =>
        `  ${fact.id} source=${fact.sourceId} role=${fact.role} visibility=${fact.visibility} value=${fact.value ?? '?'} dimension=${fact.dimension} unit=${fact.unitKey}`,
    ),
  ];

  return `${lines.join('\n')}\n`;
}
