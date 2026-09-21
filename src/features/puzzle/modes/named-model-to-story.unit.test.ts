import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { namedModelToStoryMode } from './named-model-to-story';
import type { NamedModelToStoryState } from './mode';

function startState(problem: typeof totalFromPartsProblem): NamedModelToStoryState {
  const { state } = namedModelToStoryMode.start({
    problem,
    locale: 'en',
  });
  if (state.modeId !== 'named-model-to-story') {
    throw new Error(`Unexpected mode state ${state.modeId}.`);
  }
  return state;
}

test('start exposes the canonical model and semantic candidate ids', () => {
  const state = startState(totalFromPartsProblem);

  expect(state.modeId).toBe('named-model-to-story');
  expect(state.source.relation).toEqual(totalFromPartsProblem.relation);
  expect(state.target.candidateIds).toEqual([
    'matching',
    'factor-into-group',
    'add-instead-of-multiply',
  ]);
});

test('submitting the matching candidate id is accepted by semantic structure', () => {
  const submitted = namedModelToStoryMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    answer: { kind: 'story-choice', choiceId: 'matching' },
    names: {},
  });

  expect(submitted.feedback?.kind).toBe('accepted');
  if (submitted.state.modeId !== 'named-model-to-story') {
    throw new Error(`Unexpected mode state ${submitted.state.modeId}.`);
  }
  expect(submitted.state.input.selectedChoiceId).toBe('matching');
});

test('submitting a structural distractor candidate id is rejected', () => {
  const submitted = namedModelToStoryMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    answer: { kind: 'story-choice', choiceId: 'factor-into-group' },
    names: {},
  });

  expect(submitted.feedback?.kind).toBe('incorrect');
});

test('submitting an unknown candidate id is rejected', () => {
  const submitted = namedModelToStoryMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    answer: { kind: 'story-choice', choiceId: 'no-such-candidate' },
    names: {},
  });

  expect(submitted.feedback?.kind).toBe('incorrect');
});

test('correctness traces the candidate relation, not the choice id', () => {
  const submitted = namedModelToStoryMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    answer: { kind: 'story-choice', choiceId: 'matching' },
    names: {},
  });

  expect(submitted.submission?.kind).toBe('story-choice');
  const submission = submitted.submission;
  if (
    submission === undefined ||
    submission.kind !== 'story-choice' ||
    submission.relation === undefined
  ) {
    throw new Error('Expected a story-choice submission with a relation.');
  }
  expect(submission.relation).toEqual(totalFromPartsProblem.relation);
});

test('candidate ids are stable across start and submit', () => {
  const submitted = namedModelToStoryMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    answer: { kind: 'story-choice', choiceId: 'matching' },
    names: {},
  });
  if (submitted.state.modeId !== 'named-model-to-story') {
    throw new Error(`Unexpected mode state ${submitted.state.modeId}.`);
  }
  expect(submitted.state.target.candidateIds).toEqual(
    startState(totalFromPartsProblem).target.candidateIds,
  );
});
