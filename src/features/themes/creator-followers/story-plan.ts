import type { ThemeFact } from '../theme';

export type CreatorFollowersStoryPlan = {
  scenarioId: 'creator.followers';
  seed: number;
  structure: 'base-and-parts' | 'groups-only';
  sentences: readonly (
    | {
        fragmentKey:
          | 'baseFact.startingAudience'
          | 'countFact.promotedPosts';
        factId: ThemeFact['themeQuantityId'];
        nounKey: 'creator' | 'post';
      }
    | {
        fragmentKey: 'totalFact.finalAudience' | 'totalFact.postGains';
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
  const hasBase = factIdByRole.has('base');
  return {
    scenarioId: 'creator.followers',
    seed,
    structure: hasBase ? 'base-and-parts' : 'groups-only',
    sentences: [
      ...(hasBase
        ? [
            {
              fragmentKey: 'baseFact.startingAudience' as const,
              factId: requireRole(factIdByRole, 'base'),
              nounKey: 'creator' as const,
            },
          ]
        : []),
      {
        fragmentKey: 'countFact.promotedPosts',
        factId: requireRole(factIdByRole, 'count'),
        nounKey: 'post',
      },
      {
        fragmentKey: hasBase
          ? ('totalFact.finalAudience' as const)
          : ('totalFact.postGains' as const),
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
