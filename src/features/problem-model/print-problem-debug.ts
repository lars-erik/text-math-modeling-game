import { serializeProblem } from '../problem-dsl';
import type { AnswerKey, Problem, Quantity } from './problem';
import { printRelation } from './print-relation';

type PrintProblemDebugOptions = {
  answerKey?: AnswerKey;
};

export function printProblemDebug(
  problem: Problem,
  options: PrintProblemDebugOptions = {},
): string {
  const lines = [
    `problem ${problem.id}`,
    `scenario ${problem.scenarioId}`,
    `concepts ${problem.concepts.join(', ')}`,
    'quantities',
    ...problem.quantities.map((quantity) => `  ${printQuantity(quantity)}`),
    'relation',
    ...indent(printRelation(problem.relation)),
    `replay ${problem.replay
      ? `seed=${problem.replay.seed} generator=${problem.replay.generatorVersion}`
      : 'none'}`,
    ...printAnswerKey(problem, options.answerKey),
    'dsl',
    ...indent(serializeProblem(problem).trimEnd()),
  ];

  return `${lines.join('\n')}\n`;
}

function printQuantity(quantity: Quantity): string {
  const role = quantity.role ? ` role=${quantity.role}` : '';
  const visibility = quantity.given.kind === 'known' ? 'known' : 'hidden';
  const value = quantity.given.kind === 'known' ? quantity.given.value : '?';
  return `quantity ${quantity.id} dimension=${quantity.dimension}${role} visibility=${visibility} value=${value}`;
}

function printAnswerKey(problem: Problem, answerKey?: AnswerKey): string[] {
  if (!answerKey) {
    return ['answer-key none'];
  }

  const hiddenQuantityIds = new Set(
    problem.quantities
      .filter((quantity) => quantity.given.kind === 'hidden')
      .map((quantity) => quantity.id),
  );
  const bindings = Object.entries(answerKey.bindings)
    .filter(([quantityId]) => hiddenQuantityIds.has(quantityId))
    .sort(([left], [right]) => left.localeCompare(right));

  if (bindings.length === 0) {
    return ['answer-key hidden-bindings none'];
  }

  return [
    'answer-key',
    ...bindings.map(([quantityId, value]) => `  ${quantityId} = ${value}`),
  ];
}

function indent(value: string): string[] {
  const lines = value.split('\n');
  if (lines.at(-1) === '') {
    lines.pop();
  }
  return lines.map((line) => `  ${line}`);
}
