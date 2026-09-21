import { namedEquationStructurePolicy, relationsHaveNormalizedStructure } from '../../problem-model/normalized-structure';
import { createAcademicSymbolMap } from '../../representations/academic-symbol-map';
import { parseAcademicRelation } from '../../representations/parse-academic-relation';
import { substituteVisibleValues } from '../../representations/substitute-visible-values';
import { puzzleResources } from '../lang';
import type { LearnerAnswer } from '../learner-answer';
import type {
  Mode,
  ModeResult,
  ModeStartOptions,
  ModeSubmitOptions,
  NamedEquationToAcademicNotationState,
  PuzzleFeedback,
} from './mode';

export const namedEquationToAcademicNotationMode: Mode = {
  id: 'named-equation-to-academic-notation',
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
        submission: { kind: 'academic-notation', input },
      };
    }
    const symbols = createAcademicSymbolMap(options.problem);
    const parsed = parseAcademicRelation(input, symbols);
    if (parsed.kind !== 'success') {
      return {
        state: composeState(options, input),
        feedback: localizeDiagnostic(options, parsed),
        submission: { kind: 'academic-notation', input },
      };
    }
    const accepted = relationsHaveNormalizedStructure(
      substituteVisibleValues(options.problem),
      parsed.relation,
      namedEquationStructurePolicy,
    );
    const resources = puzzleResources[options.locale].namedEquationToAcademicNotation;
    return {
      state: composeState(options, input),
      feedback: accepted
        ? {
            kind: 'accepted',
            message: resources.accepted,
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
        kind: 'academic-notation',
        input,
        relation: parsed.relation,
      },
    };
  },
};

function composeState(
  options: ModeStartOptions,
  input: string,
): NamedEquationToAcademicNotationState {
  return {
    modeId: 'named-equation-to-academic-notation',
    source: {
      kind: 'named-equation',
      relation: substituteVisibleValues(options.problem),
    },
    target: {
      kind: 'academic-notation',
      prompt:
        puzzleResources[options.locale].namedEquationToAcademicNotation.prompt,
      symbols: createAcademicSymbolMap(options.problem),
    },
    input: { kind: 'expression', value: input },
  };
}

function localizeDiagnostic(
  options: ModeSubmitOptions,
  diagnostic: Exclude<ReturnType<typeof parseAcademicRelation>, { kind: 'success' }>,
): PuzzleFeedback {
  if (diagnostic.kind !== 'unknown-identifier') {
    return diagnostic;
  }
  const resources = puzzleResources[options.locale].namedEquationToAcademicNotation;
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
