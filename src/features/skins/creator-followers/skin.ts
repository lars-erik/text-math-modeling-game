import type { QuantityRole } from '../../problem-model/problem';
import type { Skin, SkinFact } from '../skin';
import { creatorFollowersResources } from './lang';
import { createCreatorFollowersLearnerNames } from './learner-names';
import { renderCreatorFollowersStory } from './render-story';
import { planCreatorFollowersStory } from './story-plan';

const roleFacts = {
  base: { skinQuantityId: 'startingFollowers', unitKey: 'followers' },
  count: { skinQuantityId: 'promotedPostCount', unitKey: 'posts' },
  'per-item': { skinQuantityId: 'followersPerPost', unitKey: 'followersPerPost' },
  total: { skinQuantityId: 'finalFollowers', unitKey: 'followers' },
} as const satisfies Record<
  QuantityRole,
  { skinQuantityId: string; unitKey: 'followers' | 'posts' | 'followersPerPost' }
>;

export const creatorFollowersSkin: Skin = {
  id: 'creator.followers',
  present({ problem, locale, storySeed }) {
    const resources = creatorFollowersResources[locale];
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
    const plan = planCreatorFollowersStory(facts, storySeed);
    const story = renderCreatorFollowersStory(facts, plan, locale);
    return {
      skinId: 'creator.followers',
      locale,
      facts,
      story: { text: story.text, storySeed: story.replay.storySeed },
      learnerNames: createCreatorFollowersLearnerNames(facts, locale),
    };
  },
};
