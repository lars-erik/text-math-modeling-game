import { parseNamedRelation } from '../../named-expression';
import { classifyMisconception } from '../../problem-model/misconception';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';
import { createAcademicSymbolMap } from '../../representations/academic-symbol-map';
import { substituteVisibleValues } from '../../representations/substitute-visible-values';
import { puzzleResources } from '../lang';
import type { LearnerAnswer } from '../learner-answer';
import type {
  AcademicNotationToNamedEquationState,
  Mode,
  ModeStartOptions,
  ModeSubmitOptions,
  PuzzleFeedback,
} from './mode';

export const academicNotationToNamedEquationMode: Mode = {
  id: 'academic-notation-to-named-equation',
  start(options) {
    return { state: composeState(options, '') };
  },
  submit(options) {
    const answer = options.answer as LearnerAnswer;
    const input =
      answer.kind === 'text'
        ? answer.input
        : answer.kind === 'relation-choice'
          ? answer.label
          : '';
    if (answer.kind === 'story-choice') {
      return {
        state: composeState(options, input),
        feedback: { kind: 'incorrect', message: incorrectMessage(options) },
        submission: { kind: 'named-equation', answerKind: 'text', input },
      };
    }
    const parsed = parseNamedRelation(input, options.names);
    if (parsed.kind !== 'success') {
      return {
        state: composeState(options, input),
        feedback: localizeDiagnostic(options, parsed),
        submission: {
          kind: 'named-equation',
          answerKind: answer.kind,
          input,
        },
      };
    }
    const accepted = relationsHaveNormalizedStructure(
      options.problem.relation,
      parsed.relation,
      namedEquationStructurePolicy,
    );
    const misconception =
      !accepted
        ? classifyMisconception(options.problem.relation, parsed.relation)
        : undefined;
    const resources =
      puzzleResources[options.locale].academicNotationToNamedEquation;
    return {
      state: composeState(options, input),
      feedback: accepted
        ? {
            kind: 'accepted',
            message: resources.accepted,
            checkPolicy: 'normalized-structure',
            equationSides: namedEquationStructurePolicy.equationSides,
          }
        : misconception !== undefined
          ? {
              kind: 'misconception',
              misconception,
              checkPolicy: 'normalized-structure',
              equationSides: namedEquationStructurePolicy.equationSides,
            }
          : {
              kind: 'structural-mismatch',
              message: resources.groupingMismatch,
              checkPolicy: 'normalized-structure',
              equationSides: namedEquationStructurePolicy.equationSides,
            },
      submission: {
        kind: 'named-equation',
        answerKind: answer.kind,
        input,
        relation: parsed.relation,
      },
    };
  },
};

function composeState(
  options: ModeStartOptions,
  input: string,
): AcademicNotationToNamedEquationState {
  return {
    modeId: 'academic-notation-to-named-equation',
    source: {
      kind: 'academic-notation',
      relation: substituteVisibleValues(options.problem),
      symbols: createAcademicSymbolMap(options.problem),
    },
    target: {
      kind: 'named-equation',
      prompt:
        puzzleResources[options.locale].academicNotationToNamedEquation.prompt,
    },
    input: { kind: 'expression', value: input },
  };
}

function localizeDiagnostic(
  options: ModeSubmitOptions,
  diagnostic: Exclude<
    ReturnType<typeof parseNamedRelation>,
    { kind: 'success' }
  >,
): PuzzleFeedback {
  if (diagnostic.kind !== 'unknown-identifier') {
    return diagnostic;
  }
  const resources =
    puzzleResources[options.locale].academicNotationToNamedEquation;
  return {
    ...diagnostic,
    message: resources.unknownIdentifier(
      diagnostic.identifier,
      diagnostic.availableIdentifiers.join(', '),
    ),
  };
}
function incorrectMessage(options: ModeSubmitOptions): string {
  return puzzleResources[options.locale].namedModelToStory.incorrect;
}
