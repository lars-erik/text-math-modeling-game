import type { PuzzleLocale } from '../../puzzle/lang';
import type { NamedEquationLocaleDefinition } from '../../puzzle/puzzle-definition';
import { createCreatorFollowersLearnerNames } from './learner-names';
import { creatorFollowersResources } from './lang';
import type { CreatorFollowersScenarioBinding } from './scenario';

export function createCreatorFollowersNamedEquationDefinition(
  binding: CreatorFollowersScenarioBinding,
  locale: PuzzleLocale,
): NamedEquationLocaleDefinition {
  const resources = creatorFollowersResources[locale];
  const quantityNames = Object.fromEntries(
    binding.facts.map((fact) => [
      fact.id,
      resources.quantities[fact.id].variableName,
    ]),
  );
  const base = quantityNames.startingFollowers;
  const count = quantityNames.promotedPostCount;
  const unit = quantityNames.followersPerPost;
  const total = quantityNames.finalFollowers;

  return {
    learnerNames: createCreatorFollowersLearnerNames(binding, locale),
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
          left: { kind: 'quantity', id: 'finalFollowers' },
          right: {
            kind: 'multiply',
            left: { kind: 'quantity', id: 'promotedPostCount' },
            right: {
              kind: 'add',
              left: { kind: 'quantity', id: 'startingFollowers' },
              right: { kind: 'quantity', id: 'followersPerPost' },
            },
          },
        },
      },
    ],
  };
}
