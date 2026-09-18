import { expect, test } from 'vitest';

import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from './total-from-parts.fixture';
import { printProblemDebug } from './print-problem-debug';

test('prints deterministic metadata, quantity visibility, relation structure, and replay details', () => {
  const output = printProblemDebug(totalFromPartsProblem);

  expect(output).toContain('problem total-from-parts');
  expect(output).toContain('scenario gaming.drone-power');
  expect(output).toContain('concepts arithmetic.addition, arithmetic.multiplication, algebra.variable, linear.one-unknown');
  expect(output).toContain('quantity base dimension=scalar role=base visibility=known value=30');
  expect(output).toContain('quantity unitValue dimension=scalar role=per-item visibility=hidden value=?');
  expect(output).toContain('relation');
  expect(output).toContain('  equation');
  expect(output).not.toContain('\n  \nreplay');
  expect(output).toContain('replay seed=0 generator=hand-built-v1');
  expect(output).toContain('answer-key none');
});

test('prints private answer bindings only when answer key is explicitly provided', () => {
  const output = printProblemDebug(totalFromPartsProblem, {
    answerKey: totalFromPartsAnswerKey,
  });

  expect(output).toContain('answer-key');
  expect(output).toContain('  unitValue = 45');
  expect(output).not.toContain('  base = 30');
  expect(output).not.toContain('  count = 4');
  expect(output).not.toContain('  total = 210');
});

test('distinguishes a missing answer key from one without hidden bindings', () => {
  const fullyKnownProblem = {
    ...totalFromPartsProblem,
    quantities: totalFromPartsProblem.quantities.map((quantity) =>
      quantity.id === 'unitValue'
        ? { ...quantity, given: { kind: 'known' as const, value: 45 } }
        : quantity,
    ),
  };

  expect(printProblemDebug(fullyKnownProblem)).toContain('answer-key none');
  expect(
    printProblemDebug(fullyKnownProblem, { answerKey: totalFromPartsAnswerKey }),
  ).toContain('answer-key hidden-bindings none');
});
