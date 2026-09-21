import type { Relation } from '../../problem-model/expression';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';
import { puzzleResources } from '../lang';
import type { StoryChoiceAnswer } from '../learner-answer';
import { createStoryCandidateSeeds } from './story-candidates';
import type {
  Mode,
  ModeResult,
  ModeStartOptions,
  ModeSubmission,
  ModeSubmitOptions,
  NamedModelToStoryState,
} from './mode';

export const namedModelToStoryMode: Mode = {
  id: 'named-model-to-story',
  start(options: ModeStartOptions): ModeResult {
    return { state: composeState(options, undefined) };
  },
  submit(options: ModeSubmitOptions): ModeResult {
    const answer = options.answer as StoryChoiceAnswer;
    const candidates = createStoryCandidateSeeds(options.problem);
    const selected = candidates.find(
      (candidate) => candidate.id === answer.choiceId,
    );
    const accepted =
      selected !== undefined &&
      relationsHaveNormalizedStructure(
        options.problem.relation,
        selected.relation,
        namedEquationStructurePolicy,
      );
    const resources = puzzleResources[options.locale].namedModelToStory;
    return {
      state: composeState(options, answer.choiceId),
      submission: submissionOf(answer, selected?.relation),
      feedback: accepted
        ? {
            kind: 'accepted',
            message: resources.accepted,
            checkPolicy: 'normalized-structure',
            equationSides: namedEquationStructurePolicy.equationSides,
          }
        : { kind: 'incorrect', message: resources.incorrect },
    };
  },
};

function composeState(
  options: ModeStartOptions,
  selectedChoiceId: string | undefined,
): NamedModelToStoryState {
  const candidates = createStoryCandidateSeeds(options.problem);
  return {
    modeId: 'named-model-to-story',
    source: { kind: 'named-model', relation: options.problem.relation },
    target: {
      kind: 'story-choices',
      candidateIds: candidates.map((candidate) => candidate.id),
    },
    input: {
      kind: 'story-choice',
      ...(selectedChoiceId === undefined
        ? {}
        : { selectedChoiceId }),
    },
  };
}

function submissionOf(
  answer: StoryChoiceAnswer,
  relation: Relation | undefined,
): ModeSubmission {
  return {
    kind: 'story-choice',
    choiceId: answer.choiceId,
    relation,
  };
}
