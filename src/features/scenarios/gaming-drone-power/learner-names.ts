import type { LearnerNameMap } from '../../named-expression';
import { dronePowerResources, type SupportedLocale } from './lang';
import type { DronePowerScenarioBinding } from './scenario';

export function createDronePowerLearnerNames(
  binding: DronePowerScenarioBinding,
  locale: SupportedLocale,
): LearnerNameMap {
  const resources = dronePowerResources[locale];

  return Object.fromEntries(
    binding.facts.map((fact) => [
      resources.quantities[fact.id].variableName,
      fact.sourceId,
    ]),
  );
}
