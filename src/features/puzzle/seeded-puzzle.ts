import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
  type TotalFromPartsGenerationConfig,
} from '../problem-generation/generate-total-from-parts';
import type { ConceptId } from '../problem-model/problem';
import type { ModelingCase } from './puzzle-definition';
import { bindDronePowerScenario } from '../scenarios/gaming-drone-power/scenario';
import { createDronePowerStoryQuantitiesDefinition } from '../scenarios/gaming-drone-power/story-quantities-definition';
import { createDronePowerNamedEquationDefinition } from '../scenarios/gaming-drone-power/named-equation-definition';
import { bindCreatorFollowersScenario } from '../scenarios/creator-followers/scenario';
import { createCreatorFollowersStoryQuantitiesDefinition } from '../scenarios/creator-followers/story-quantities-definition';
import { createCreatorFollowersNamedEquationDefinition } from '../scenarios/creator-followers/named-equation-definition';

export const supportedScenarioIds = [
  'gaming.drone-power',
  'creator.followers',
] as const;

export type SupportedScenarioId = (typeof supportedScenarioIds)[number];

export function isSupportedScenarioId(
  value: string,
): value is SupportedScenarioId {
  return supportedScenarioIds.some((scenarioId) => scenarioId === value);
}

export function createSeededModelingCase({
  seed,
  config = defaultTotalFromPartsGenerationConfig,
  scenarioId = config.scenarioId as SupportedScenarioId,
  concepts = config.concepts,
}: {
  seed: number;
  config?: TotalFromPartsGenerationConfig;
  scenarioId?: SupportedScenarioId;
  concepts?: readonly ConceptId[];
}): ModelingCase {
  const generated = generateTotalFromPartsCase({
    seed,
    config: { ...config, scenarioId, concepts },
  });

  if (scenarioId === 'creator.followers') {
    const binding = bindCreatorFollowersScenario(generated.problem);
    const englishNamedEquation = createCreatorFollowersNamedEquationDefinition(
      binding,
      'en',
    );

    return {
      problem: binding.problem,
      storySeed: seed,
      storyQuantities: {
        createDefinition: (locale) =>
          createCreatorFollowersStoryQuantitiesDefinition({
            problem: generated.problem,
            storySeed: seed,
            locale,
          }),
      },
      learnerNames: englishNamedEquation.learnerNames,
      choices: englishNamedEquation.choices,
      namedEquation: {
        createDefinition: (locale) =>
          createCreatorFollowersNamedEquationDefinition(binding, locale),
      },
    };
  }

  const binding = bindDronePowerScenario(generated.problem);
  const englishNamedEquation = createDronePowerNamedEquationDefinition(
    binding,
    'en',
  );

  return {
    problem: binding.problem,
    storySeed: seed,
    storyQuantities: {
      createDefinition: (locale) =>
        createDronePowerStoryQuantitiesDefinition({
          problem: binding.problem,
          storySeed: seed,
          locale,
        }),
    },
    learnerNames: englishNamedEquation.learnerNames,
    choices: englishNamedEquation.choices,
    namedEquation: {
      createDefinition: (locale) =>
        createDronePowerNamedEquationDefinition(binding, locale),
    },
  };
}
