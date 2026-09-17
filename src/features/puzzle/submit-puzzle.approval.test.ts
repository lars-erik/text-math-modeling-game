import { expect, test } from 'vitest';

import type { Relation } from '../problem-model/expression';
import {
  allProblemConstraintCodes,
  validateProblemAst,
  validateProblemConstraints,
} from '../problem-model/problem-validation';
import {
  totalFromPartsAnswerKey,
  totalFromPartsAnswerKeySeed1,
  totalFromPartsProblem,
  totalFromPartsProblemSeed1,
} from '../problem-model/total-from-parts.fixture';
import { verifyApproval } from '../../testing/approvals';
import { printScreen } from './print-screen';
import { startPuzzle } from './start-puzzle';
import { submitPuzzle } from './submit-puzzle';

const correctAnswer: Relation = {
  kind: 'equation',
  left: { kind: 'quantity', id: 'total' },
  right: {
    kind: 'add',
    left: { kind: 'quantity', id: 'base' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  },
};

const structuralMismatch: Relation = {
  kind: 'equation',
  left: { kind: 'quantity', id: 'total' },
  right: {
    kind: 'multiply',
    left: { kind: 'quantity', id: 'count' },
    right: {
      kind: 'add',
      left: { kind: 'quantity', id: 'base' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  },
};

const cases = [
  {
    answerKey: totalFromPartsAnswerKey,
    name: 'seed 0',
    problem: totalFromPartsProblem,
  },
  {
    answerKey: totalFromPartsAnswerKeySeed1,
    name: 'seed 1',
    problem: totalFromPartsProblemSeed1,
  },
] as const;

test.each(cases)(
  'submits structured named equations for $name',
  ({ answerKey, problem }) => {
    expect(validateProblemAst(problem)).toEqual([]);
    expect(
      validateProblemConstraints(problem, answerKey, allProblemConstraintCodes),
    ).toEqual([]);

    const started = startPuzzle(problem);
    const accepted = submitPuzzle(problem, correctAnswer);
    const rejected = submitPuzzle(problem, structuralMismatch);

    expect(accepted.feedback?.kind).toBe('accepted');
    expect(rejected.feedback?.kind).toBe('structural-mismatch');
    expect(accepted.submission).toEqual({
      kind: 'named-equation',
      relation: correctAnswer,
    });
    expect(JSON.stringify([started, accepted, rejected])).not.toContain(
      String(answerKey.bindings.unitValue),
    );
  },
);

test('prints the representative structured-submission transcript', () => {
  const screens = [
    startPuzzle(totalFromPartsProblem),
    submitPuzzle(totalFromPartsProblem, correctAnswer),
    submitPuzzle(totalFromPartsProblem, structuralMismatch),
  ];

  verifyApproval(
    import.meta.url,
    'submit-puzzle',
    screens.map(printScreen).join('\n'),
  );
});
