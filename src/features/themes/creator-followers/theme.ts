import type { QuantityRole } from '../../problem-model/problem';
import type { Theme, ThemeFact } from '../theme';
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
  QuantityRole,
  { themeQuantityId: string; unitKey: 'followers' | 'posts' | 'followersPerPost' }
>;

export const creatorFollowersTheme: Theme = {
  id: 'creator.followers',
  present({ problem, locale, storySeed }) {
    const resources = creatorFollowersResources[locale];
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
