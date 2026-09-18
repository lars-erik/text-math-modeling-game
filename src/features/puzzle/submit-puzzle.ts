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
import { startPuzzle, type PuzzleScreen } from './start-puzzle';

export function submitPuzzle(
  problem: Problem,
  input: string,
  names: LearnerNameSource,
): PuzzleScreen {
  const screen = startPuzzle(problem);
  const parsed = parseNamedRelation(input, names);
  if (parsed.kind !== 'success') {
    return {
      ...screen,
      input: { kind: 'expression', value: input },
      submission: { kind: 'named-equation', input },
      feedback: formatDiagnostic(parsed),
    };
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
    input: { kind: 'expression', value: input },
    submission: {
      kind: 'named-equation',
      input,
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
