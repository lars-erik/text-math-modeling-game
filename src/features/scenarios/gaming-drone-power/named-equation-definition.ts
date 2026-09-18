import type { PuzzleLocale } from '../../puzzle/lang';
import type { NamedEquationLocaleDefinition } from '../../puzzle/puzzle-definition';
import { createDronePowerLearnerNames } from './learner-names';
import { dronePowerResources } from './lang';
import type { DronePowerScenarioBinding } from './scenario';

export function createDronePowerNamedEquationDefinition(
  binding: DronePowerScenarioBinding,
  locale: PuzzleLocale,
): NamedEquationLocaleDefinition {
  const resources = dronePowerResources[locale];
  const quantityNames = Object.fromEntries(
    binding.facts.map((fact) => [
      fact.id,
      resources.quantities[fact.id].variableName,
    ]),
  );
  const base = quantityNames.basePower;
  const count = quantityNames.droneCount;
  const unit = quantityNames.dronePower;
  const total = quantityNames.totalPower;

  return {
    learnerNames: createDronePowerLearnerNames(binding, locale),
    quantityNames,
    choices: [
      {
        id: 'matching',
        label: `${total} = ${base} + ${count} * ${unit}`,
        relation: binding.problem.relation,
      },
      {
        id: 'base-per-item',
        label: `${total} = ${count} * (${base} + ${unit})`,
        relation: {
          kind: 'equation',
          left: { kind: 'quantity', id: 'totalPower' },
          right: {
            kind: 'multiply',
            left: { kind: 'quantity', id: 'droneCount' },
            right: {
              kind: 'add',
              left: { kind: 'quantity', id: 'basePower' },
              right: { kind: 'quantity', id: 'dronePower' },
            },
          },
        },
      },
    ],
  };
}
