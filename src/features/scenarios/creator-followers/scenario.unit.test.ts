import { expect, test } from 'vitest';

import { relationsHaveNormalizedStructure } from '../../problem-model/normalized-structure';
import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from '../../problem-model/total-from-parts.fixture';
import {
  bindCreatorFollowersAnswerKey,
  bindCreatorFollowersScenario,
  planCreatorFollowersStory,
} from './scenario';

test('binds creator semantics while preserving mathematical shape and private values', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);
  const answerKey = bindCreatorFollowersAnswerKey(
    totalFromPartsAnswerKey,
    binding,
  );

  expect(
    relationsHaveNormalizedStructure(
      {
        kind: 'equation',
        left: { kind: 'quantity', id: 'finalFollowers' },
        right: {
          kind: 'add',
          left: { kind: 'quantity', id: 'startingFollowers' },
          right: {
            kind: 'multiply',
            left: { kind: 'quantity', id: 'promotedPostCount' },
            right: { kind: 'quantity', id: 'followersPerPost' },
          },
        },
      },
      binding.problem.relation,
      {
        addition: 'commutative',
        multiplication: 'commutative',
        equationSides: 'ordered',
      },
    ),
  ).toBe(true);
  expect(answerKey).toEqual({
    bindings: {
      startingFollowers: 30,
      promotedPostCount: 4,
      followersPerPost: 45,
      finalFollowers: 210,
    },
  });
  expect(binding.facts.find((fact) => fact.id === 'followersPerPost')).not.toHaveProperty(
    'value',
  );
});

test('plans creator prose with locale-independent semantic keys', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);

  expect(planCreatorFollowersStory(binding, 17)).toEqual({
    scenarioId: 'creator.followers',
    seed: 17,
    sentences: [
      {
        fragmentKey: 'baseFact.startingAudience',
        factId: 'startingFollowers',
        nounKey: 'creator',
      },
      {
        fragmentKey: 'countFact.promotedPosts',
        factId: 'promotedPostCount',
        nounKey: 'post',
      },
      {
        fragmentKey: 'totalFact.finalAudience',
        factId: 'finalFollowers',
      },
    ],
    question: {
      fragmentKey: 'question.followersPerPost',
      factId: 'followersPerPost',
      nounKey: 'post',
    },
  });
});
