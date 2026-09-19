import {
  parseNamedRelation,
} from '../../named-expression';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';
import { puzzleResources } from '../lang';
import type { LearnerAnswer as PuzzleLearnerAnswer } from '../learner-answer';
import type {
  Mode,
  ModeResult,
  ModeStartOptions,
  ModeSubmitOptions,
  PuzzleFeedback,
  QuantitiesToNamedEquationState,
} from './mode';

export const quantitiesToNamedEquationMode: Mode = {
  id: 'quantities-to-named-equation',
  start(options: ModeStartOptions): ModeResult {
    return { state: composeState(options, '') };
  },
  submit(options: ModeSubmitOptions): ModeResult {
    const answer = options.answer as PuzzleLearnerAnswer;
    const displayInput = answer.kind === 'text' ? answer.input : answer.label;
    const parsed =
      answer.kind === 'text'
        ? parseNamedRelation(answer.input, options.names)
        : ({ kind: 'success' as const, relation: answer.relation } as const);
    if (parsed.kind !== 'success') {
      return {
        state: composeState(options, displayInput),
        feedback: parsed as PuzzleFeedback,
      };
    }
    const accepted = relationsHaveNormalizedStructure(
      options.problem.relation,
      parsed.relation,
      namedEquationStructurePolicy,
    );
    const sidesAreReversed =
      !accepted &&
      relationsHaveNormalizedStructure(options.problem.relation, parsed.relation, {
        ...namedEquationStructurePolicy,
        equationSides: 'swappable',
      });
    const resources = puzzleResources[options.locale].quantitiesToNamedEquation;
    return {
      state: composeState(options, displayInput),
      feedback: accepted
        ? {
            kind: 'accepted',
            message: resources.accepted,
            checkPolicy: 'normalized-structure',
            equationSides: namedEquationStructurePolicy.equationSides,
          }
        : {
            kind: 'structural-mismatch',
            message: sidesAreReversed
              ? resources.reversedSides
              : resources.groupingMismatch,
            checkPolicy: 'normalized-structure',
            equationSides: namedEquationStructurePolicy.equationSides,
          },
    };
  },
};

function composeState(
  options: ModeStartOptions,
  input: string,
): QuantitiesToNamedEquationState {
  const resources = puzzleResources[options.locale].quantitiesToNamedEquation;
  return {
    modeId: 'quantities-to-named-equation',
    source: {
      kind: 'quantities',
      quantityIds: options.problem.quantities.map((quantity) => quantity.id),
    },
    target: {
      kind: 'named-equation',
      prompt: resources.prompt,
    },
    input: { kind: 'expression', value: input },
  };
}
