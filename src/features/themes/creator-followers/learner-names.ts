import type { LearnerNameMap } from '../../named-expression';
import type { ThemeFact } from '../theme';
import {
  creatorFollowersResources,
  type SupportedLocale,
} from './lang';

export function createCreatorFollowersLearnerNames(
  facts: readonly ThemeFact[],
  locale: SupportedLocale,
): LearnerNameMap {
  const resources = creatorFollowersResources[locale];
  return Object.fromEntries(
    facts.map((fact) => [
      resources.quantities[
        fact.themeQuantityId as keyof typeof resources.quantities
      ].variableName,
      fact.canonicalId,
    ]),
  );
}
