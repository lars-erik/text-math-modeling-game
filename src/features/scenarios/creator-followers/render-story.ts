import type {
  CreatorFollowersScenarioBinding,
  CreatorFollowersStoryPlan,
} from './scenario';
import {
  creatorFollowersResources,
  type SupportedLocale,
} from './lang';

export type RenderedCreatorFollowersStory = {
  text: string;
  replay: {
    locale: SupportedLocale;
    scenarioId: 'creator.followers';
    storySeed: number;
  };
};

export function renderCreatorFollowersStory(
  binding: CreatorFollowersScenarioBinding,
  plan: CreatorFollowersStoryPlan,
  locale: SupportedLocale,
): RenderedCreatorFollowersStory {
  const resources = creatorFollowersResources[locale];
  const facts = new Map(binding.facts.map((fact) => [fact.id, fact]));
  const sentences = plan.sentences.map((sentence) => {
    const fact = requireKnownFact(facts, sentence.factId);

    switch (sentence.fragmentKey) {
      case 'baseFact.startingAudience':
        return resources.fragments.baseFact.startingAudience({
          noun: resources.nouns[sentence.nounKey].singular,
          value: String(fact.value),
          unit: resources.units[fact.unitKey],
        });

      case 'countFact.promotedPosts':
        return resources.fragments.countFact.promotedPosts({
          count: resources.formatNumber(fact.value, false),
          noun:
            fact.value === 1
              ? resources.nouns[sentence.nounKey].singular
              : resources.nouns[sentence.nounKey].plural,
        });

      case 'totalFact.finalAudience':
        return resources.fragments.totalFact.finalAudience({
          value: String(fact.value),
          unit: resources.units[fact.unitKey],
        });
    }
  });
  const questionFact = facts.get(plan.question.factId);
  if (questionFact?.visibility !== 'hidden') {
    throw new Error(`Story question fact ${plan.question.factId} must be hidden.`);
  }
  const question = resources.fragments.question.followersPerPost({
    noun: resources.nouns[plan.question.nounKey].singular,
  });

  return {
    text: [...sentences, question].join(' '),
    replay: {
      locale,
      scenarioId: plan.scenarioId,
      storySeed: plan.seed,
    },
  };
}

function requireKnownFact(
  facts: ReadonlyMap<string, CreatorFollowersScenarioBinding['facts'][number]>,
  id: string,
): CreatorFollowersScenarioBinding['facts'][number] & {
  visibility: 'known';
  value: number;
} {
  const fact = facts.get(id);
  if (fact?.visibility !== 'known' || fact.value === undefined) {
    throw new Error(`Story sentence fact ${id} must have a known value.`);
  }

  return { ...fact, visibility: 'known', value: fact.value };
}
