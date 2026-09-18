import { expect, test } from 'vitest';

import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from '../problem-model/total-from-parts.fixture';
import { parseProblem } from './parse-problem';
import { referenceProblemDsl } from './reference-problem.fixture';
import { serializeProblem } from './serialize-problem';

test('serializes the reference AST as canonical problem DSL', () => {
  const parsed = parseProblem(referenceProblemDsl);
  expect(parsed.kind).toBe('success');
  if (parsed.kind !== 'success') {
    throw new Error(`Expected parse success, received ${parsed.kind}`);
  }

  expect(serializeProblem(parsed.problem)).toBe(referenceProblemDsl);
});

test('normalizes accepted whitespace and CRLF to four-space indents and LF', () => {
  const nonCanonicalDsl = referenceProblemDsl
    .replaceAll('    ', '\t')
    .replaceAll('\n', '\r\n');
  const parsed = parseProblem(nonCanonicalDsl);
  expect(parsed.kind).toBe('success');
  if (parsed.kind !== 'success') {
    throw new Error(`Expected parse success, received ${parsed.kind}`);
  }

  expect(serializeProblem(parsed.problem)).toBe(referenceProblemDsl);
});

test('round-trips an AST with replay and transitional role metadata', () => {
  expect(parseProblem(serializeProblem(totalFromPartsProblem))).toEqual({
    kind: 'success',
    problem: totalFromPartsProblem,
  });
});

test('parenthesizes grouped addition so equation structure survives round-trip', () => {
  const groupedProblem = {
    ...totalFromPartsProblem,
    relation: {
      kind: 'equation' as const,
      left: { kind: 'quantity' as const, id: 'total' },
      right: {
        kind: 'multiply' as const,
        left: { kind: 'quantity' as const, id: 'count' },
        right: {
          kind: 'add' as const,
          left: { kind: 'quantity' as const, id: 'base' },
          right: { kind: 'quantity' as const, id: 'unitValue' },
        },
      },
    },
  };

  const serialized = serializeProblem(groupedProblem);
  expect(serialized).toContain('        total = count * (base + unitValue)\n');
  expect(parseProblem(serialized)).toEqual({
    kind: 'success',
    problem: groupedProblem,
  });
});

test('preserves nested right-associated addition and multiplication trees through round-trip', () => {
  const rightAssociatedProblem = {
    ...totalFromPartsProblem,
    quantities: totalFromPartsProblem.quantities.map((quantity) =>
      quantity.id === 'count'
        ? { ...quantity, dimension: 'scalar' as const }
        : quantity,
    ),
    relation: {
      kind: 'equation' as const,
      left: { kind: 'quantity' as const, id: 'total' },
      right: {
        kind: 'add' as const,
        left: { kind: 'quantity' as const, id: 'base' },
        right: {
          kind: 'add' as const,
          left: { kind: 'quantity' as const, id: 'count' },
          right: {
            kind: 'multiply' as const,
            left: { kind: 'quantity' as const, id: 'unitValue' },
            right: {
              kind: 'multiply' as const,
              left: { kind: 'literal' as const, value: 2 },
              right: { kind: 'literal' as const, value: 3 },
            },
          },
        },
      },
    },
  };

  const serialized = serializeProblem(rightAssociatedProblem);
  expect(serialized).toContain(
    '        total = base + (count + unitValue * (2 * 3))\n',
  );
  expect(parseProblem(serialized)).toEqual({
    kind: 'success',
    problem: rightAssociatedProblem,
  });
});

test('orders symbol mappings canonically and serializes deterministically', () => {
  const problemWithUnorderedSymbols = {
    ...totalFromPartsProblem,
    academicSymbols: { total: 't', base: 'b' },
  };

  const first = serializeProblem(problemWithUnorderedSymbols);
  const second = serializeProblem(problemWithUnorderedSymbols);

  expect(first).toBe(second);
  expect(first.indexOf('    symbol base = b\n')).toBeLessThan(
    first.indexOf('    symbol total = t\n'),
  );
});

test('serializes learner-visible facts without leaking a colocated private answer key', () => {
  const runtimeValueWithPrivateData = {
    ...totalFromPartsProblem,
    answerKey: totalFromPartsAnswerKey,
  };

  const serialized = serializeProblem(runtimeValueWithPrivateData);

  expect(serialized).toContain('    quantity unitValue: scalar role per-item = ?\n');
  expect(serialized).not.toContain('45');
  expect(serialized).not.toContain('answerKey');
  expect(serialized).not.toContain('bindings');
});
