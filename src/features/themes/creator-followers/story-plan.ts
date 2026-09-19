import type { ThemeFact } from '../theme';

export type CreatorFollowersStoryPlan = {
  scenarioId: 'creator.followers';
  seed: number;
  sentences: readonly (
    | {
        fragmentKey:
          | 'baseFact.startingAudience'
          | 'countFact.promotedPosts';
        factId: ThemeFact['themeQuantityId'];
        nounKey: 'creator' | 'post';
      }
    | {
        fragmentKey: 'totalFact.finalAudience';
        factId: ThemeFact['themeQuantityId'];
      }
  )[];
  question: {
    fragmentKey: 'question.followersPerPost';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'post';
  };
};

export function planCreatorFollowersStory(
  facts: readonly ThemeFact[],
  seed: number,
): CreatorFollowersStoryPlan {
  const factIdByRole = new Map(
    facts.map((fact) => [fact.role, fact.themeQuantityId]),
  );
  return {
    scenarioId: 'creator.followers',
    seed,
    sentences: [
      {
        fragmentKey: 'baseFact.startingAudience',
        factId: requireRole(factIdByRole, 'base'),
        nounKey: 'creator',
      },
      {
        fragmentKey: 'countFact.promotedPosts',
        factId: requireRole(factIdByRole, 'count'),
        nounKey: 'post',
      },
      {
        fragmentKey: 'totalFact.finalAudience',
        factId: requireRole(factIdByRole, 'total'),
      },
    ],
    question: {
      fragmentKey: 'question.followersPerPost',
      factId: requireRole(factIdByRole, 'per-item'),
      nounKey: 'post',
    },
  };
}

function requireRole(
  factIdByRole: ReadonlyMap<string, string>,
  role: string,
): string {
  const factId = factIdByRole.get(role);
  if (factId === undefined) {
    throw new Error(`Creator-followers story needs a fact with role ${role}.`);
  }
  return factId;
}
