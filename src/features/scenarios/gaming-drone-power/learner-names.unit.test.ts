import { expect, test } from 'vitest';

import { parseNamedRelation } from '../../named-expression';
import { createDronePowerLearnerNames } from './learner-names';
import { bindDronePowerScenario } from './scenario';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';

test('resource-backed English and Norwegian equations resolve to the same canonical AST', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);
  const english = parseNamedRelation(
    'totalPower = basePower + droneCount * dronePower',
    createDronePowerLearnerNames(binding, 'en'),
  );
  const norwegian = parseNamedRelation(
    'totalEffekt = grunnEffekt + droneAntall * droneEffekt',
    createDronePowerLearnerNames(binding, 'nb'),
  );

  expect(english).toEqual(norwegian);
  expect(english).toMatchObject({
    kind: 'success',
    relation: totalFromPartsProblem.relation,
  });
});

test('unknown-name diagnostics list the active Norwegian variable names', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);

  expect(
    parseNamedRelation(
      'totalEffekt = ukjent',
      createDronePowerLearnerNames(binding, 'nb'),
    ),
  ).toMatchObject({
    kind: 'unknown-identifier',
    availableIdentifiers: [
      'droneAntall',
      'droneEffekt',
      'grunnEffekt',
      'totalEffekt',
    ],
  });
});
