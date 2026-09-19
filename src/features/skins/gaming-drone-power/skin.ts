import type { QuantityRole } from '../../problem-model/problem';
import type { Skin, SkinFact } from '../skin';
import { dronePowerResources } from './lang';
import { createDronePowerLearnerNames } from './learner-names';
import { renderDronePowerStory } from './render-story';
import { planDronePowerStory } from './story-plan';

const roleFacts = {
  base: { skinQuantityId: 'basePower', unitKey: 'power' },
  count: { skinQuantityId: 'droneCount', unitKey: 'count' },
  'per-item': { skinQuantityId: 'dronePower', unitKey: 'powerPerDrone' },
  total: { skinQuantityId: 'totalPower', unitKey: 'power' },
} as const satisfies Record<
  QuantityRole,
  { skinQuantityId: string; unitKey: 'count' | 'power' | 'powerPerDrone' }
>;

export const dronePowerSkin: Skin = {
  id: 'gaming.drone-power',
  present({ problem, locale, storySeed }) {
    const resources = dronePowerResources[locale];
    const facts: SkinFact[] = problem.quantities.map((quantity) => {
      if (quantity.role === undefined) {
        throw new Error(
          `Quantity ${quantity.id} has no total-from-parts role.`,
        );
      }
      const roleFact = roleFacts[quantity.role];
      const quantityResources = resources.quantities[
        roleFact.skinQuantityId as keyof typeof resources.quantities
      ];
      return {
        skinQuantityId: roleFact.skinQuantityId,
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
      skinId: 'gaming.drone-power',
      locale,
      facts,
      story: { text: story.text, storySeed: story.replay.storySeed },
      learnerNames: createDronePowerLearnerNames(facts, locale),
    };
  },
};
