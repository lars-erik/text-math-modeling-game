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
    fragmentKey:
      | 'question.followersPerPost'
      | 'question.startingFollowers'
      | 'question.promotedPostCount'
      | 'question.finalFollowers';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'creator' | 'post';
  };
};

const statementFragmentsByRole = {
  base: 'baseFact.startingAudience',
  count: 'countFact.promotedPosts',
  total: 'totalFact.finalAudience',
} as const satisfies Record<
  string,
  'baseFact.startingAudience' | 'countFact.promotedPosts' | 'totalFact.finalAudience'
>;

const questionFragmentsByRole = {
  'per-item': 'question.followersPerPost',
  base: 'question.startingFollowers',
  count: 'question.promotedPostCount',
  total: 'question.finalFollowers',
} as const satisfies Record<
  string,
  CreatorFollowersStoryPlan['question']['fragmentKey']
>;

const nounsByRole = {
  base: 'creator',
  count: 'post',
  'per-item': 'post',
  total: 'creator',
} as const satisfies Record<string, 'creator' | 'post'>;

export function planCreatorFollowersStory(
  facts: readonly ThemeFact[],
  seed: number,
): CreatorFollowersStoryPlan {
  const factByRole = new Map(facts.map((fact) => [fact.role, fact]));
  const hasBase = factByRole.has('base');
  const hiddenFact = facts.find((fact) => fact.visibility === 'hidden');
  if (hiddenFact === undefined || hiddenFact.role === undefined) {
    throw new Error('Creator-followers story needs exactly one hidden fact.');
  }
  return {
    scenarioId: 'creator.followers',
    seed,
    structure: hasBase ? 'base-and-parts' : 'groups-only',
    sentences: facts
      .filter(
        (fact): fact is ThemeFact & {
          visibility: 'known';
          role: 'base' | 'count' | 'total';
        } =>
          fact.visibility === 'known' &&
          (fact.role === 'base' ||
            fact.role === 'count' ||
            fact.role === 'total'),
      )
      .map((fact) => ({
        ...(fact.role === 'total'
          ? {
              fragmentKey: hasBase
                ? ('totalFact.finalAudience' as const)
                : ('totalFact.postGains' as const),
            }
          : {
              fragmentKey: statementFragmentsByRole[fact.role],
              nounKey: nounsByRole[fact.role],
            }),
        factId: fact.themeQuantityId,
      })),
    question: {
      fragmentKey: questionFragmentsByRole[hiddenFact.role],
      factId: hiddenFact.themeQuantityId,
      nounKey: nounsByRole[hiddenFact.role],
    },
  };
}
