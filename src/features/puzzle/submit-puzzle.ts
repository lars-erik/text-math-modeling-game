import {
  parseNamedRelation,
  type LearnerNameSource,
  type NamedRelationDiagnostic,
} from '../named-expression';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../problem-model/normalized-structure';
import type { Problem } from '../problem-model/problem';
import type { LearnerAnswer } from './learner-answer';
import { startPuzzle, type PuzzleScreen } from './start-puzzle';

export function submitPuzzle(
  problem: Problem,
  answer: LearnerAnswer,
  names: LearnerNameSource,
): PuzzleScreen {
  const screen = startPuzzle(problem);
  const displayInput =
    answer.kind === 'text' ? answer.input : answer.label;
  const parsed =
    answer.kind === 'text'
      ? parseNamedRelation(answer.input, names)
      : { kind: 'success' as const, relation: answer.relation };

  if (parsed.kind !== 'success' && answer.kind === 'text') {
    return {
      ...screen,
      input: { kind: 'expression', value: displayInput },
      submission: {
        kind: 'named-equation',
        answerKind: answer.kind,
        input: displayInput,
      },
      feedback: formatDiagnostic(parsed),
    };
  }

  if (parsed.kind !== 'success') {
    return screen;
  }

  const accepted = relationsHaveNormalizedStructure(
    problem.relation,
    parsed.relation,
    namedEquationStructurePolicy,
  );
  const sidesAreReversed =
    !accepted &&
    relationsHaveNormalizedStructure(problem.relation, parsed.relation, {
      ...namedEquationStructurePolicy,
      equationSides: 'swappable',
    });

  return {
    ...screen,
    input: { kind: 'expression', value: displayInput },
    submission: {
      kind: 'named-equation',
      answerKind: answer.kind,
      input: displayInput,
      ...(answer.kind === 'relation-choice'
        ? { choiceId: answer.choiceId }
        : {}),
      relation: parsed.relation,
    },
    feedback: accepted
      ? {
          kind: 'accepted',
          message: 'The equation matches the quantity model.',
          checkPolicy: 'normalized-structure',
          equationSides: namedEquationStructurePolicy.equationSides,
        }
      : {
          kind: 'structural-mismatch',
          message: sidesAreReversed
            ? 'The equation sides are reversed; keep them in the requested order.'
            : 'The equation grouping does not match the quantity model.',
          checkPolicy: 'normalized-structure',
          equationSides: namedEquationStructurePolicy.equationSides,
        },
  };
}

function formatDiagnostic(
  diagnostic: NamedRelationDiagnostic,
): NamedRelationDiagnostic {
  if (diagnostic.kind !== 'unknown-identifier') {
    return diagnostic;
  }

  const available = diagnostic.availableIdentifiers.join(', ');
  return {
    ...diagnostic,
    message: `${diagnostic.message} Available identifiers: ${available}.`,
  };
}
