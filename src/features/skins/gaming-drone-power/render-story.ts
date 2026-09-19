import { dronePowerResources, type SupportedLocale } from './lang';
import type { SkinFact } from '../skin';
import type { DronePowerStoryPlan } from './story-plan';

export type RenderedStory = {
  text: string;
  replay: {
    locale: SupportedLocale;
    scenarioId: 'gaming.drone-power';
    storySeed: number;
  };
};

export function renderDronePowerStory(
  facts: readonly SkinFact[],
  plan: DronePowerStoryPlan,
  locale: SupportedLocale,
): RenderedStory {
  const resources = dronePowerResources[locale];
  const factsById = new Map(
    facts.map((fact) => [fact.skinQuantityId, fact]),
  );
  const sentences = plan.sentences.map((sentence) => {
    const fact = requireKnownFact(factsById, sentence.factId);
    switch (sentence.fragmentKey) {
      case 'baseFact.basicSystems':
        return resources.fragments.baseFact.basicSystems({
          noun: resources.nouns[sentence.nounKey].singular,
          value: String(fact.value),
          unit: resources.units.power,
        });
      case 'countFact.activeDrones':
        return resources.fragments.countFact.activeDrones({
          count: resources.formatNumber(fact.value, false),
          noun: selectNoun(resources.nouns[sentence.nounKey], fact.value),
          isSingular: fact.value === 1,
        });
      case 'totalFact.combinedDraw':
        return resources.fragments.totalFact.combinedDraw({
          value: String(fact.value),
          unit: resources.units.power,
        });
    }
  });
  const questionFact = factsById.get(plan.question.factId);
  if (questionFact?.visibility !== 'hidden') {
    throw new Error(
      `Story question fact ${plan.question.factId} must be hidden.`,
    );
  }
  const question = resources.fragments.question.perDronePower({
    noun: resources.nouns[plan.question.nounKey].singular,
  });
  return {
    text: [...sentences, question].join(' '),
    replay: {
      locale,
      scenarioId: 'gaming.drone-power',
      storySeed: plan.seed,
    },
  };
}

function requireKnownFact(
  factsById: ReadonlyMap<string, SkinFact>,
  id: string,
): SkinFact & { visibility: 'known'; value: number } {
  const fact = factsById.get(id);
  if (fact?.visibility !== 'known' || fact.value === undefined) {
    throw new Error(`Story sentence fact ${id} must have a known value.`);
  }
  return { ...fact, visibility: 'known', value: fact.value };
}

function selectNoun(
  forms: { singular: string; plural: string },
  count: number,
): string {
  return count === 1 ? forms.singular : forms.plural;
}
