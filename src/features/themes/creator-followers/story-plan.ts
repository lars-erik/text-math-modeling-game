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
        fragmentKey:
          | 'perItemFact.followersPerPost'
          | 'totalFact.finalAudience'
          | 'totalFact.postGains';
        factId: ThemeFact['themeQuantityId'];
      }
  )[];
  question: {
    fragmentKey:
      | 'question.followersPerPost'
      | 'question.startingFollowers'
      | 'question.promotedPostCount'
      | 'question.finalFollowers'
      | 'question.totalPostGains';
    factId: ThemeFact['themeQuantityId'];
    nounKey: 'creator' | 'post';
  };
};

const statementFragmentsByRole = {
  base: 'baseFact.startingAudience',
  count: 'countFact.promotedPosts',
  'per-item': 'perItemFact.followersPerPost',
  total: 'totalFact.finalAudience',
} as const satisfies Record<
  string,
  | 'baseFact.startingAudience'
  | 'countFact.promotedPosts'
  | 'perItemFact.followersPerPost'
  | 'totalFact.finalAudience'
>;

const questionFragmentsByRole = {
  'per-item': 'question.followersPerPost',
  base: 'question.startingFollowers',
  count: 'question.promotedPostCount',
  total: {
    'base-and-parts': 'question.finalFollowers',
    'groups-only': 'question.totalPostGains',
  },
} as const satisfies Record<
  string,
  | CreatorFollowersStoryPlan['question']['fragmentKey']
  | {
      'base-and-parts': CreatorFollowersStoryPlan['question']['fragmentKey'];
      'groups-only': CreatorFollowersStoryPlan['question']['fragmentKey'];
    }
>;

const nounsByRole = {
  base: 'creator',
  count: 'post',
  'per-item': 'post',
  total: 'creator',
} as const satisfies Record<string, 'creator' | 'post'>;

const totalQuestionNoun = {
  'base-and-parts': 'creator',
  'groups-only': 'post',
} as const satisfies Record<CreatorFollowersStoryPlan['structure'], 'creator' | 'post'>;

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
  const structure = hasBase ? 'base-and-parts' : 'groups-only';
  const totalQuestionFragment =
    questionFragmentsByRole.total[structure];
  const totalQuestionNounKey = totalQuestionNoun[structure];
  return {
    scenarioId: 'creator.followers',
    seed,
    structure: hasBase ? 'base-and-parts' : 'groups-only',
    sentences: facts
      .filter(
        (fact): fact is ThemeFact & {
          visibility: 'known';
          role: 'base' | 'count' | 'per-item' | 'total';
        } =>
          fact.visibility === 'known' &&
          (fact.role === 'base' ||
            fact.role === 'count' ||
            fact.role === 'per-item' ||
            fact.role === 'total'),
      )
      .map((fact) => ({
        ...(fact.role === 'total'
          ? {
              fragmentKey: hasBase
                ? ('totalFact.finalAudience' as const)
                : ('totalFact.postGains' as const),
            }
          : fact.role === 'per-item'
            ? {
                fragmentKey: statementFragmentsByRole[fact.role],
              }
            : {
                fragmentKey: statementFragmentsByRole[fact.role],
                nounKey: nounsByRole[fact.role],
              }),
        factId: fact.themeQuantityId,
      })),
    question: {
      fragmentKey:
        hiddenFact.role === 'total'
          ? totalQuestionFragment
          : questionFragmentsByRole[hiddenFact.role],
      factId: hiddenFact.themeQuantityId,
      nounKey:
        hiddenFact.role === 'total'
          ? totalQuestionNounKey
          : nounsByRole[hiddenFact.role],
    },
  };
}
