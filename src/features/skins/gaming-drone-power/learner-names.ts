import type { LearnerNameMap } from '../../named-expression';
import type { SkinFact } from '../skin';
import { dronePowerResources, type SupportedLocale } from './lang';

export function createDronePowerLearnerNames(
  facts: readonly SkinFact[],
  locale: SupportedLocale,
): LearnerNameMap {
  const resources = dronePowerResources[locale];
  return Object.fromEntries(
    facts.map((fact) => [
      resources.quantities[
        fact.skinQuantityId as keyof typeof resources.quantities
      ].variableName,
      fact.canonicalId,
    ]),
  );
}
