import {
  matchesRoleStructure,
  rolesOfProblem,
  type Theme,
  type ThemeFact,
} from '../theme';
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
  string,
  { themeQuantityId: string; unitKey: 'count' | 'power' | 'powerPerDrone' }
>;

export const dronePowerSupportedRoleStructures = [
  { roles: ['base', 'count', 'per-item', 'total'] },
  { roles: ['count', 'per-item', 'total'] },
] as const satisfies readonly { roles: readonly string[] }[];

export const dronePowerTheme: Theme = {
  id: 'gaming.drone-power',
  supportedRoleStructures: dronePowerSupportedRoleStructures,
  present({ problem, locale, storySeed }) {
    const resources = dronePowerResources[locale];
    const roles = rolesOfProblem(problem);
    if (
      !dronePowerSupportedRoleStructures.some((structure) =>
        matchesRoleStructure(structure, roles),
      )
    ) {
      throw new Error(
        `Drone-power supports only base-and-parts and groups-total role structures, received ${JSON.stringify(roles)}.`,
      );
    }
    const facts: ThemeFact[] = problem.quantities.map((quantity) => {
      if (quantity.role === undefined) {
        throw new Error(
          `Quantity ${quantity.id} has no canonical role.`,
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
