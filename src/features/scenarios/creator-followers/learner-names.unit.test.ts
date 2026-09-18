import { expect, test } from 'vitest';

import { parseNamedRelation } from '../../named-expression';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { createCreatorFollowersLearnerNames } from './learner-names';
import { bindCreatorFollowersScenario } from './scenario';

test('English and Norwegian creator equations resolve to the same canonical AST', () => {
  const binding = bindCreatorFollowersScenario(totalFromPartsProblem);
  const english = parseNamedRelation(
    'finalFollowers = startingFollowers + promotedPostCount * followersPerPost',
    createCreatorFollowersLearnerNames(binding, 'en'),
  );
  const norwegian = parseNamedRelation(
    'sluttFoelgere = startFoelgere + promoterteInnlegg * foelgerePerInnlegg',
    createCreatorFollowersLearnerNames(binding, 'nb'),
  );

  expect(english).toEqual(norwegian);
  expect(english).toMatchObject({
    kind: 'success',
    relation: binding.problem.relation,
  });
});
