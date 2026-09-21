import {
  matchesRoleStructure,
  rolesOfProblem,
  type Theme,
  type ThemeFact,
} from '../theme';
import { creatorFollowersResources } from './lang';
import { createCreatorFollowersLearnerNames } from './learner-names';
import { renderCreatorFollowersStory } from './render-story';
import { planCreatorFollowersStory } from './story-plan';

const roleFacts = {
  base: { themeQuantityId: 'startingFollowers', unitKey: 'followers' },
  count: { themeQuantityId: 'promotedPostCount', unitKey: 'posts' },
  'per-item': { themeQuantityId: 'followersPerPost', unitKey: 'followersPerPost' },
  total: { themeQuantityId: 'finalFollowers', unitKey: 'followers' },
} as const satisfies Record<
  string,
  { themeQuantityId: string; unitKey: 'followers' | 'posts' | 'followersPerPost' }
>;

export const creatorFollowersSupportedRoleStructures = [
  { roles: ['base', 'count', 'per-item', 'total'] },
  { roles: ['count', 'per-item', 'total'] },
] as const satisfies readonly { roles: readonly string[] }[];

export const creatorFollowersTheme: Theme = {
  id: 'creator.followers',
  supportedRoleStructures: creatorFollowersSupportedRoleStructures,
  present({ problem, locale, storySeed }) {
    const resources = creatorFollowersResources[locale];
    const roles = rolesOfProblem(problem);
    if (
      !creatorFollowersSupportedRoleStructures.some((structure) =>
        matchesRoleStructure(structure, roles),
      )
    ) {
      throw new Error(
        `Creator-followers supports only base-and-parts and groups-total role structures, received ${JSON.stringify(roles)}.`,
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
    const plan = planCreatorFollowersStory(facts, storySeed);
    const story = renderCreatorFollowersStory(facts, plan, locale);
    return {
      themeId: 'creator.followers',
      locale,
      facts,
      story: { text: story.text, storySeed: story.replay.storySeed },
      learnerNames: createCreatorFollowersLearnerNames(facts, locale),
    };
  },
};
