import type { LearnerNameMap } from '../../named-expression';
import {
  creatorFollowersResources,
  type SupportedLocale,
} from './lang';
import type { CreatorFollowersScenarioBinding } from './scenario';

export function createCreatorFollowersLearnerNames(
  binding: CreatorFollowersScenarioBinding,
  locale: SupportedLocale,
): LearnerNameMap {
  const resources = creatorFollowersResources[locale];

  return Object.fromEntries(
    binding.facts.map((fact) => [
      resources.quantities[fact.id].variableName,
      fact.id,
    ]),
  );
}
