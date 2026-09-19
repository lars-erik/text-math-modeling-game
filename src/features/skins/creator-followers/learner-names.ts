import type { LearnerNameMap } from '../../named-expression';
import type { SkinFact } from '../skin';
import {
  creatorFollowersResources,
  type SupportedLocale,
} from './lang';

export function createCreatorFollowersLearnerNames(
  facts: readonly SkinFact[],
  locale: SupportedLocale,
): LearnerNameMap {
  const resources = creatorFollowersResources[locale];
  return Object.fromEntries(
    facts.map((fact) => [
      resources.quantities[
        fact.skinQuantityId as keyof typeof resources.quantities
      ].variableName,
      fact.canonicalId,
    ]),
  );
}
