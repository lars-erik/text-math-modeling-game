import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { composePuzzle, submitPuzzle } from './compose-puzzle';
import { printScreen } from './print-screen';
import { verifyApproval } from '../../testing/approvals';

test('approves the fixed-problem story candidate transcript', () => {
  const options = {
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power' as const,
    modeId: 'named-model-to-story' as const,
    locale: 'en' as const,
    storySeed: 0,
  };
  const start = composePuzzle(options);
  const correct = submitPuzzle({
    ...options,
    answer: { kind: 'story-choice', choiceId: 'matching' },
  });
  const distractor = submitPuzzle({
    ...options,
    answer: { kind: 'story-choice', choiceId: 'factor-into-group' },
  });
  verifyApproval(
    import.meta.url,
    'named-model-to-story-transcript',
    [
      `=== Start ===\n${printScreen(start)}`,
      `=== Correct ===\n${printScreen(correct)}`,
      `=== Distractor ===\n${printScreen(distractor)}`,
    ].join(''),
  );
});

test('theme and locale changes present candidates without changing semantics', () => {
  const droneEn = composePuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power' as const,
    modeId: 'named-model-to-story' as const,
    locale: 'en' as const,
    storySeed: 0,
  });
  const creatorNb = composePuzzle({
    problem: totalFromPartsProblem,
    themeId: 'creator.followers' as const,
    modeId: 'named-model-to-story' as const,
    locale: 'nb' as const,
    storySeed: 0,
  });
  const droneCandidates = candidatesOf(droneEn);
  const creatorCandidates = candidatesOf(creatorNb);
  expect(droneCandidates.map((candidate) => candidate.id)).toEqual(
    creatorCandidates.map((candidate) => candidate.id),
  );
  expect(droneCandidates.map((candidate) => candidate.relation)).toEqual(
    creatorCandidates.map((candidate) => candidate.relation),
  );
});

function candidatesOf(
  screen: ReturnType<typeof composePuzzle>,
): readonly {
  id: string;
  relation: unknown;
  label: string;
}[] {
  if (screen.screen.modeId !== 'named-model-to-story') {
    throw new Error(`Unexpected screen mode ${screen.screen.modeId}.`);
  }
  return screen.screen.target.candidates.map((candidate) => ({
    id: candidate.id,
    relation: candidate.relation,
    label: candidate.label,
  }));
}

