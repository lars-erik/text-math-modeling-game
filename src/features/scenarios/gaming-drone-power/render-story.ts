import { dronePowerResources, type SupportedLocale } from './lang';
import type {
  DronePowerScenarioBinding,
  DronePowerStoryPlan,
} from './scenario';

export type RenderedStory = {
  text: string;
  replay: {
    locale: SupportedLocale;
    scenarioId: 'gaming.drone-power';
    storySeed: number;
  };
};

export function renderDronePowerStory(
  binding: DronePowerScenarioBinding,
  plan: DronePowerStoryPlan,
  locale: SupportedLocale,
): RenderedStory {
  const resources = dronePowerResources[locale];
  const facts = new Map(binding.facts.map((fact) => [fact.id, fact]));
  const sentences = plan.sentences.map((sentence) => {
    const fact = requireKnownFact(facts, sentence.factId);

    switch (sentence.fragmentKey) {
      case 'baseFact.basicSystems':
        return resources.fragments.baseFact.basicSystems({
          noun: resources.nouns[sentence.nounKey].singular,
          value: String(fact.value),
          unit: resources.units[fact.unitKey],
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
          unit: resources.units[fact.unitKey],
        });
    }
  });
  const questionFact = facts.get(plan.question.factId);
  if (questionFact?.visibility !== 'hidden') {
    throw new Error(`Story question fact ${plan.question.factId} must be hidden.`);
  }
  const question = resources.fragments.question.perDronePower({
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
  facts: ReadonlyMap<string, DronePowerScenarioBinding['facts'][number]>,
  id: string,
): DronePowerScenarioBinding['facts'][number] & {
  visibility: 'known';
  value: number;
} {
  const fact = facts.get(id);
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
