import { expect, test } from 'vitest';
import { serializeProblem } from '../problem-dsl/serialize-problem';
import { evaluateRelation } from '../problem-model/expression';
import { printProblemDebug } from '../problem-model/print-problem-debug';
import { verifyApproval } from '../../testing/approvals';
import { generateGroupsTotalCase } from './generate-groups-total';
import { defaultGroupsTotalGenerationConfig } from './generate-groups-total';

test('prints a fixed seeded generated groups-total case for review', () => {
  const generated = generateGroupsTotalCase({
    seed: 17,
    config: defaultGroupsTotalGenerationConfig,
  });
  const dsl = serializeProblem(generated.problem);
  const debug = printProblemDebug(generated.problem, {
    answerKey: generated.answerKey,
  });
  expect(
    evaluateRelation(generated.problem.relation, generated.answerKey.bindings),
  ).toEqual({ kind: 'value', value: true });
  expect(generated.answerKey.bindings.unitValue).toBeGreaterThan(0);
  expect(dsl).not.toContain(
    `unitValue = ${generated.answerKey.bindings.unitValue}`,
  );
  verifyApproval(
    import.meta.url,
    'generate-groups-total',
    [
      `replay ${JSON.stringify(generated.replay, null, '  ')}`,
      '',
      'dsl',
      dsl.trimEnd(),
      '',
      'debug',
      debug.trimEnd(),
    ].join('\n'),
  );
});
