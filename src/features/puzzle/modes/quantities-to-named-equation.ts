import {
  parseNamedRelation,
  type LearnerNameSource,
  type NamedRelationDiagnostic,
} from '../../named-expression';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';
import type { Relation } from '../../problem-model/expression';
import { puzzleResources } from '../lang';
import type { LearnerAnswer as PuzzleLearnerAnswer } from '../learner-answer';
import type {
  Mode,
  ModeStartOptions,
  ModeSubmitOptions,
  PuzzleFeedback,
  PuzzleScreen,
} from './mode';
import { createNamedEquationChoices } from './named-equation-choices';
import { toScreenQuantities } from './screen-quantities';

export const quantitiesToNamedEquationMode: Mode = {
  id: 'quantities-to-named-equation',
  start(options: ModeStartOptions): PuzzleScreen {
    return compose(options, { input: '' });
  },
  submit(options: ModeSubmitOptions): PuzzleScreen {
    const answer = options.answer as PuzzleLearnerAnswer;
    const displayInput = answer.kind === 'text' ? answer.input : answer.label;
    const parsed = answer.kind === 'text'
      ? parseNamedRelation(answer.input, options.skin.learnerNames)
      : { kind: 'success' as const, relation: answer.relation };
    const screen = compose(options, { input: displayInput });
    if (parsed.kind !== 'success' && answer.kind === 'text') {
      return {
        ...screen,
        submission: {
          kind: 'named-equation',
          answerKind: answer.kind,
          input: displayInput,
        },
        feedback: parsed as PuzzleFeedback,
      };
    }
    if (parsed.kind !== 'success') {
      return screen;
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
      ...screen,
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

function compose(
  options: ModeStartOptions,
  input: { input: string },
): PuzzleScreen {
  const resources = puzzleResources[options.locale].quantitiesToNamedEquation;
  const screenQuantities = toScreenQuantities(options.skin);
  return {
    screen: {
      modeId: 'quantities-to-named-equation',
      source: { kind: 'quantities', quantities: screenQuantities },
      target: {
        kind: 'named-equation',
        prompt: resources.prompt,
      },
      input: { kind: 'expression', value: input.input },
    },
    context: {
      locale: options.locale,
      skinId: options.skin.skinId,
      story: options.skin.story.text,
      quantities: screenQuantities,
      replay: options.problem.replay
        ? {
            ...options.problem.replay,
            locale: options.locale,
            skinId: options.skin.skinId,
            storySeed: options.skin.story.storySeed,
          }
        : undefined,
    },
  };
}

export { createNamedEquationChoices };
export type { LearnerNameSource, NamedRelationDiagnostic };
