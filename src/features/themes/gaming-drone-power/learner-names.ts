import type { LearnerNameMap } from '../../named-expression';
import type { ThemeFact } from '../theme';
import { dronePowerResources, type SupportedLocale } from './lang';

export function createDronePowerLearnerNames(
  facts: readonly ThemeFact[],
  locale: SupportedLocale,
): LearnerNameMap {
  const resources = dronePowerResources[locale];
  return Object.fromEntries(
    facts.map((fact) => [
      resources.quantities[
        fact.themeQuantityId as keyof typeof resources.quantities
      ].variableName,
      fact.canonicalId,
    ]),
  );
}
