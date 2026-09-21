import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import {
  generateFamilyCase,
  defaultProblemFamilyId,
} from '../problem-generation/problem-families';
import { composePuzzle } from '../puzzle/compose-puzzle';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { QuantitySelection } from '../puzzle/modes';

import type { PuzzleLocale } from '../puzzle/lang';
import {
  formatAcademicInput,
} from '../representations/academic-relation';
import type { ThemeId } from '../themes';
import { startSession, type GrayboxSession } from './graybox-session';

const sessionSeed = 918273;

const sessionOptions = {
  seed: sessionSeed,
  themeId: 'gaming.drone-power' as ThemeId,
  locale: 'en' as PuzzleLocale,
};

function start(options = sessionOptions): GrayboxSession {
  return startSession(options);
}

test('starts a session on the first planned item as an ordinary puzzle screen', () => {
  const session = start();
  expect(session.status).toBe('active');
  expect(session.currentIndex).toBe(0);
  expect(session.position).toBe(1);
  expect(session.total).toBe(session.plan.length);
  expect(session.screen?.context.replay?.seed).toBe(
    session.plan.items[0].problemSeed,
  );
  expect(session.screen?.screen.modeId).toBe(session.plan.items[0].modeId);
  expect(session.answerLog).toEqual([]);
  expect(session.availableNext).toBe(false);
});

test('wrong submit keeps the learner on the same item and logs the answer', () => {
  const session = start();
  const submitted = session.submit({ kind: 'text', input: 'wrong = wrong' });
  expect(submitted.currentIndex).toBe(0);
  expect(submitted.position).toBe(1);
  expect(submitted.status).toBe('active');
  expect(submitted.availableNext).toBe(false);
  expect(submitted.screen?.feedback).toBeDefined();
  expect(submitted.answerLog).toEqual([
    {
      itemIndex: session.plan.items[0].index,
      modeId: session.plan.items[0].modeId,
      submission: {
        kind: 'academic-notation',
        input: 'wrong = wrong',
      },
      accepted: false,
    },
  ]);
});

test('correct submit accepts the item and logs it as accepted', () => {
  const session = start();
  const submitted = session.submit(correctAnswerFor(session));
  expect(submitted.currentIndex).toBe(0);
  expect(submitted.availableNext).toBe(true);
  expect(submitted.status).toBe('active');
  expect(submitted.screen?.feedback?.kind).toBe('accepted');
  expect(submitted.answerLog).toHaveLength(1);
  expect(submitted.answerLog[0].accepted).toBe(true);
});

test('repeated answers on the same item update the same log entry', () => {
  const session = start();
  const first = session.submit({ kind: 'text', input: 'wrong = wrong' });
  const second = first.submit({ kind: 'text', input: 'still = wrong' });
  const third = second.submit(correctAnswerFor(second));
  expect(third.answerLog).toHaveLength(1);
  expect(third.answerLog[0].itemIndex).toBe(session.plan.items[0].index);
  expect(third.answerLog[0].accepted).toBe(true);
  expect(third.answerLog[0].submission.kind).toBe('academic-notation');
  const submission = third.answerLog[0].submission;
  expect(
    submission.kind === 'named-equation' ||
      submission.kind === 'academic-notation'
      ? submission.input
      : '',
  ).toEqual(expect.stringContaining('='));
});

test('next() freezes the item log entry and starts a new one on the next item', () => {
  const session = start();
  const advanced = session.submit(correctAnswerFor(session)).next();
  expect(advanced.answerLog).toHaveLength(1);
  expect(advanced.answerLog[0].itemIndex).toBe(session.plan.items[0].index);
  expect(advanced.answerLog[0].accepted).toBe(true);
  const answered = advanced.submit({ kind: 'text', input: 'wrong = wrong' });
  expect(answered.answerLog).toHaveLength(2);
  expect(answered.answerLog[1].itemIndex).toBe(advanced.plan.items[1].index);
  expect(answered.answerLog[1].accepted).toBe(false);
});

test('next() advances to the next planned item with a fresh problem', () => {
  const session = start();
  const advanced = session.submit(correctAnswerFor(session)).next();
  expect(advanced.currentIndex).toBe(1);
  expect(advanced.position).toBe(2);
  expect(advanced.screen?.screen.modeId).toBe(session.plan.items[1].modeId);
  expect(advanced.screen?.context.replay?.seed).toBe(
    session.plan.items[1].problemSeed,
  );
  expect(advanced.status).toBe('active');
  expect(advanced.availableNext).toBe(false);
});

test('an accepted submit clears a previously requested hint', () => {
  const current = seekToMode(start(), 'quantities-to-named-equation');
  const withHint = current.requestHint();
  const submitted = withHint.submit(correctAnswerFor(withHint));
  expect(submitted.hint).toBeUndefined();
  expect(submitted.screen?.feedback?.kind).toBe('accepted');
});

test('a rejected submit keeps a previously requested hint', () => {
  const current = seekToMode(start(), 'quantities-to-named-equation');
  const withHint = current.requestHint();
  const submitted = withHint.submit({ kind: 'text', input: 'wrong = wrong' });
  expect(submitted.hint).toEqual(withHint.hint);
  expect(submitted.screen?.feedback?.kind).not.toBe('accepted');
});

test('next() composes from the recorded seed, not the previous problem', () => {
  const session = start();
  const firstProblemSeed = session.screen?.context.replay?.seed;
  const advanced = session.submit(correctAnswerFor(session)).next();
  expect(advanced.screen?.context.replay?.seed).not.toBe(firstProblemSeed);
});

test('finishing the final item transitions to the completion state', () => {
  let session = start();
  for (let index = 0; index < session.plan.length; index += 1) {
    const submitted = session.submit(correctAnswerFor(session));
    if (index === session.plan.length - 1) {
      expect(submitted.status).toBe('active');
      expect(submitted.availableNext).toBe(true);
      expect(submitted.screen?.feedback?.kind).toBe('accepted');
      const finished = submitted.next();
      expect(finished.status).toBe('complete');
      expect(finished.availableNext).toBe(false);
      expect(finished.answerLog).toHaveLength(session.plan.length);
      expect(
        finished.answerLog.map((entry) => entry.accepted),
      ).toEqual(session.plan.items.map(() => true));
      expect(finished.summary?.total).toBe(session.plan.length);
      expect(finished.summary?.counts).toEqual(
        perModeCounts(session.plan.items.map((item) => item.modeId)),
      );
      return;
    }
    session = submitted.next();
  }
  throw new Error('The fixed session plan unexpectedly ran out of items.');
});

test('the item log keeps only the latest answer per item index', () => {
  const session = start();
  const advanced = session
    .submit({ kind: 'text', input: 'wrong = wrong' })
    .submit(correctAnswerFor(session))
    .next();
  expect(advanced.answerLog.map((entry) => entry.itemIndex)).toEqual([
    session.plan.items[0].index,
  ]);
  const advancedAgain = advanced.submit({ kind: 'text', input: 'wrong = wrong' });
  expect(advancedAgain.answerLog).toHaveLength(2);
  expect(advancedAgain.answerLog[1].accepted).toBe(false);
  expect(advancedAgain.currentIndex).toBe(advanced.currentIndex);
  expect(advancedAgain.next()).toBe(advancedAgain);
});

test('a session item composed directly matches the playback item', () => {
  const session = start();
  const item = session.plan.items[0];
  const direct = composePuzzle({
    problem: generateFamilyCase(defaultProblemFamilyId, {
      seed: item.problemSeed,
      hiddenRole: item.hiddenRole,
    }).problem,
    themeId: 'gaming.drone-power',
    modeId: item.modeId,
    locale: 'en',
    storySeed: item.problemSeed,
  });
  expect(session.screen?.context.replay?.seed).toBe(item.problemSeed);
  expect(session.screen?.screen.modeId).toBe(direct.screen.modeId);
  expect(session.screen?.context.quantities).toEqual(
    direct.context.quantities,
  );
  expect(session.screen?.context.story).toBe(direct.context.story);
});

function seekToMode(
  session: GrayboxSession,
  modeId: 'quantities-to-named-equation',
): GrayboxSession {
  let current = session;
  while (current.plan.items[current.currentIndex].modeId !== modeId) {
    current = current.submit(correctAnswerFor(current)).next();
  }
  return current;
}

test('misconception feedback still works unchanged inside a session', () => {
  const current = seekToMode(start(), 'quantities-to-named-equation');
  const item = current.plan.items[current.currentIndex];
  const submitted = current.submit({
    kind: 'text',
    input: 'totalPower = droneCount * (basePower + dronePower)',
  });
  expect(submitted.screen?.feedback?.kind).toBe('misconception');
  expect(submitted.currentIndex).toBe(current.currentIndex);
  const corrected = submitted.submit({
    kind: 'text',
    input: 'totalPower = basePower + droneCount * dronePower',
  });
  expect(corrected.screen?.feedback?.kind).toBe('accepted');
  expect(
    corrected.answerLog.some(
      (entry) => entry.itemIndex === item.index && entry.accepted,
    ),
  ).toBe(true);
  const advanced = corrected.next();
  expect(advanced.answerLog).toHaveLength(current.answerLog.length + 1);
  expect(advanced.answerLog.at(-1)?.itemIndex).toBe(item.index);
});

test('requests a hint without submitting', () => {
  const current = seekToMode(start(), 'quantities-to-named-equation');
  const withHint = current.requestHint();
  expect(withHint.hint?.guidanceId).toBe('per-item-scaled-by-count');
  expect(withHint.currentIndex).toBe(current.currentIndex);
  expect(withHint.answerLog).toEqual(current.answerLog);
  expect(withHint.screen?.feedback).toBeUndefined();
  expect(withHint.currentProblem?.guidance).toContainEqual(
    expect.objectContaining({ id: 'per-item-scaled-by-count' }),
  );
});

test('the same semantic hint renders EN and NB wording and survives a theme switch', () => {
  const english = seekToMode(
    start({ seed: sessionSeed, themeId: 'gaming.drone-power', locale: 'en' }),
    'quantities-to-named-equation',
  ).requestHint();
  const norwegian = seekToMode(
    start({ seed: sessionSeed, themeId: 'creator.followers', locale: 'nb' }),
    'quantities-to-named-equation',
  ).requestHint();
  const norwegianDrone = seekToMode(
    start({ seed: sessionSeed, themeId: 'gaming.drone-power', locale: 'nb' }),
    'quantities-to-named-equation',
  ).requestHint();
  expect(english.hint).toEqual(norwegian.hint);
  expect(norwegian.hint).toEqual(norwegianDrone.hint);
  expect(english.hint?.guidanceId).toBe('per-item-scaled-by-count');
});

test('withLocale keeps progress, answer log, and hint while changing presentation only', () => {
  const english = seekToMode(
    start({ seed: sessionSeed, themeId: 'gaming.drone-power', locale: 'en' }),
    'quantities-to-named-equation',
  );
  const withHint = english.requestHint();
  const wrongFirst = withHint.submit({ kind: 'text', input: 'wrong = wrong' });
  const norwegian = wrongFirst.withLocale('nb');
  expect(norwegian.status).toBe('active');
  expect(norwegian.currentIndex).toBe(wrongFirst.currentIndex);
  expect(norwegian.position).toBe(wrongFirst.position);
  expect(norwegian.answerLog).toEqual(wrongFirst.answerLog);
  expect(norwegian.hint).toEqual(wrongFirst.hint);
  expect(norwegian.replay.locale).toBe('nb');
  expect(norwegian.replay.themeId).toBe(wrongFirst.replay.themeId);
  expect(norwegian.screen?.context.locale).toBe('nb');
  expect(norwegian.screen?.screen.modeId).toBe(
    wrongFirst.screen?.screen.modeId,
  );
  expect(norwegian.screen?.context.story).not.toBe(
    wrongFirst.screen?.context.story,
  );
  const sameLocale = wrongFirst.withLocale('en');
  expect(sameLocale).toBe(wrongFirst);
});

test('withLocale preserves progress after next() on an active item', () => {
  const session = start();
  const advanced = session.submit(correctAnswerFor(session)).next();
  const norwegian = advanced.withLocale('nb');
  expect(norwegian.currentIndex).toBe(advanced.currentIndex);
  expect(norwegian.position).toBe(advanced.position);
  expect(norwegian.answerLog).toEqual(advanced.answerLog);
  expect(norwegian.screen?.screen.modeId).toBe(advanced.screen?.screen.modeId);
  expect(norwegian.screen?.context.replay?.seed).toBe(
    advanced.screen?.context.replay?.seed,
  );
});

test('the session core stays free of locale resources', () => {
  const source = readFileSync(
    new URL('./graybox-session.ts', import.meta.url),
    'utf8',
  );
  expect(source).not.toContain('puzzleResources');
  expect(source).not.toContain('hintText');
});

test('requesting a hint on an unsupported mode is a no-op', () => {
  let current = start();
  while (current.plan.items[current.currentIndex].modeId === 'quantities-to-named-equation') {
    current = current.submit(correctAnswerFor(current)).next();
  }
  const withoutHint = current.requestHint();
  expect(withoutHint.hint).toBeUndefined();
});

test('requesting a hint preserves learner input', () => {
  const current = seekToMode(start(), 'quantities-to-named-equation');
  const typed = current.submit({ kind: 'text', input: 'partial' });
  const withHint = typed.requestHint();
  const screen = withHint.screen?.screen;
  expect(
    screen !== undefined && screen.modeId === 'quantities-to-named-equation'
      ? screen.input.value
      : undefined,
  ).toBe('partial');
});

function correctAnswerFor(session: GrayboxSession):
  | LearnerAnswer
  | QuantitySelection {
  const task = session.screen?.screen;
  if (task === undefined) {
    throw new Error('The session has no active puzzle screen.');
  }
  switch (task.modeId) {
    case 'story-to-quantities': {
      const quantities = session.screen?.context.quantities ?? [];
      return {
        knownIds: quantities
          .filter((quantity) => quantity.given.kind === 'known')
          .map((quantity) => quantity.id),
        unknownId: quantities.find(
          (quantity) => quantity.given.kind === 'hidden',
        )?.id,
      };
    }
    case 'quantities-to-named-equation':
    case 'academic-notation-to-named-equation':
      return { kind: 'text', input: canonicalNamedEquation(session) };
    case 'named-equation-to-academic-notation':
      return {
        kind: 'text',
        input: formatAcademicInput(
          task.source.relation,
          task.target.symbols,
        ),
      };
  }
}

function canonicalNamedEquation(session: GrayboxSession): string {
  const quantities = session.screen?.context.quantities ?? [];
  const names = Object.fromEntries(
    quantities.map((quantity) => [quantity.role, quantity.variableName]),
  );
  const baseTerm = names.base === undefined ? '' : `${names.base} + `;
  return `${names.total} = ${baseTerm}${names.count} * ${names['per-item']}`;
}

function perModeCounts(modeIds: readonly string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const modeId of modeIds) {
    counts[modeId] = (counts[modeId] ?? 0) + 1;
  }
  return counts;
}
