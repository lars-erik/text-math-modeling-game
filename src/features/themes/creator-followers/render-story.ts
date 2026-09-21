import {
  creatorFollowersResources,
  type SupportedLocale,
} from './lang';
import type { ThemeFact } from '../theme';
import type { CreatorFollowersStoryPlan } from './story-plan';

export type RenderedCreatorFollowersStory = {
  text: string;
  replay: {
    locale: SupportedLocale;
    scenarioId: 'creator.followers';
    storySeed: number;
  };
};

export function renderCreatorFollowersStory(
  facts: readonly ThemeFact[],
  plan: CreatorFollowersStoryPlan,
  locale: SupportedLocale,
): RenderedCreatorFollowersStory {
  const resources = creatorFollowersResources[locale];
  const factsById = new Map(
    facts.map((fact) => [fact.themeQuantityId, fact]),
  );
  const sentences = plan.sentences.map((sentence) => {
    const fact = requireKnownFact(factsById, sentence.factId);
    switch (sentence.fragmentKey) {
      case 'baseFact.startingAudience':
        return resources.fragments.baseFact.startingAudience({
          noun: resources.nouns[sentence.nounKey].singular,
          value: String(fact.value),
          unit: resources.units.followers,
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
          unit: resources.units.followers,
        });
      case 'totalFact.postGains':
        return resources.fragments.totalFact.postGains({
          value: String(fact.value),
          unit: resources.units.followers,
        });
    }
  });
  const questionFact = factsById.get(plan.question.factId);
  if (questionFact?.visibility !== 'hidden') {
    throw new Error(
      `Story question fact ${plan.question.factId} must be hidden.`,
    );
  }
  const question = resources.fragments.question.followersPerPost({
    noun: resources.nouns[plan.question.nounKey].singular,
  });
  return {
    text: [...sentences, question].join(' '),
    replay: {
      locale,
      scenarioId: 'creator.followers',
      storySeed: plan.seed,
    },
  };
}

function requireKnownFact(
  factsById: ReadonlyMap<string, ThemeFact>,
  id: string,
): ThemeFact & { visibility: 'known'; value: number } {
  const fact = factsById.get(id);
  if (fact?.visibility !== 'known' || fact.value === undefined) {
    throw new Error(`Story sentence fact ${id} must have a known value.`);
  }
  return { ...fact, visibility: 'known', value: fact.value };
}
