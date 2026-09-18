import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
  type TotalFromPartsGenerationConfig,
} from '../problem-generation/generate-total-from-parts';
import type { PuzzleDefinition } from './puzzle-definition';
import { bindDronePowerScenario } from '../scenarios/gaming-drone-power/scenario';
import { createDronePowerStoryQuantitiesDefinition } from '../scenarios/gaming-drone-power/story-quantities-definition';
import { createDronePowerNamedEquationDefinition } from '../scenarios/gaming-drone-power/named-equation-definition';

export function createSeededPuzzle({
  seed,
  config = defaultTotalFromPartsGenerationConfig,
}: {
  seed: number;
  config?: TotalFromPartsGenerationConfig;
}): PuzzleDefinition {
  const generated = generateTotalFromPartsCase({ seed, config });
  const binding = bindDronePowerScenario(generated.problem);
  const englishNamedEquation = createDronePowerNamedEquationDefinition(
    binding,
    'en',
  );

  return {
    kind: 'story-to-quantities',
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
