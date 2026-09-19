import type { QuantityRole } from '../../problem-model/problem';
import type { Theme, ThemeFact } from '../theme';
import { dronePowerResources } from './lang';
import { createDronePowerLearnerNames } from './learner-names';
import { renderDronePowerStory } from './render-story';
import { planDronePowerStory } from './story-plan';

const roleFacts = {
  base: { themeQuantityId: 'basePower', unitKey: 'power' },
  count: { themeQuantityId: 'droneCount', unitKey: 'count' },
  'per-item': { themeQuantityId: 'dronePower', unitKey: 'powerPerDrone' },
  total: { themeQuantityId: 'totalPower', unitKey: 'power' },
} as const satisfies Record<
  QuantityRole,
  { themeQuantityId: string; unitKey: 'count' | 'power' | 'powerPerDrone' }
>;

export const dronePowerTheme: Theme = {
  id: 'gaming.drone-power',
  present({ problem, locale, storySeed }) {
    const resources = dronePowerResources[locale];
    const facts: ThemeFact[] = problem.quantities.map((quantity) => {
      if (quantity.role === undefined) {
        throw new Error(
          `Quantity ${quantity.id} has no total-from-parts role.`,
        );
      }
      const roleFact = roleFacts[quantity.role];
      const quantityResources = resources.quantities[
        roleFact.themeQuantityId as keyof typeof resources.quantities
      ];
      return {
        themeQuantityId: roleFact.themeQuantityId,
        canonicalId: quantity.id,
        role: quantity.role,
        visibility: quantity.given.kind,
        ...(quantity.given.kind === 'known'
          ? { value: quantity.given.value }
          : {}),
        label: quantityResources.label,
        variableName: quantityResources.variableName,
        unit: resources.units[roleFact.unitKey],
      };
    });
    const plan = planDronePowerStory(facts, storySeed);
    const story = renderDronePowerStory(facts, plan, locale);
    return {
      themeId: 'gaming.drone-power',
      locale,
      facts,
      story: { text: story.text, storySeed: story.replay.storySeed },
      learnerNames: createDronePowerLearnerNames(facts, locale),
    };
  },
};
