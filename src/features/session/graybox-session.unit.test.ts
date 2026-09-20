import { expect, test } from 'vitest';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../problem-generation/generate-total-from-parts';
import { composePuzzle } from '../puzzle/compose-puzzle';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { QuantitySelection } from '../puzzle/modes';
import { modeIds } from '../puzzle/modes';
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

function emptyCounts(): Record<string, number> {
  return Object.fromEntries(modeIds.map((modeId) => [modeId, 0]));
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
  expect(session.completedCounts).toEqual(emptyCounts());
  expect(session.availableNext).toBe(false);
});

test('wrong submit keeps the learner on the same item with preserved input', () => {
  const session = start();
  const submitted = session.submit({ kind: 'text', input: 'wrong = wrong' });
  expect(submitted.currentIndex).toBe(0);
  expect(submitted.position).toBe(1);
  expect(submitted.status).toBe('active');
  expect(submitted.completedCounts).toEqual(emptyCounts());
  expect(submitted.availableNext).toBe(false);
  expect(submitted.screen?.feedback).toBeDefined();
  expect(submitted.completedItems).toEqual([]);
});

test('correct submit accepts the item and exposes next without counting it', () => {
  const session = start();
  const submitted = session.submit(correctAnswerFor(session));
  expect(submitted.currentIndex).toBe(0);
  expect(submitted.completedItems).toEqual([]);
  expect(submitted.completedCounts).toEqual(emptyCounts());
  expect(submitted.availableNext).toBe(true);
  expect(submitted.status).toBe('active');
  expect(submitted.screen?.feedback?.kind).toBe('accepted');
});

test('next() counts the accepted item and advances to the next planned item', () => {
  const session = start();
  const advanced = session.submit(correctAnswerFor(session)).next();
  expect(advanced.completedItems).toEqual([
    { index: 1, modeId: session.plan.items[0].modeId },
  ]);
  expect(advanced.completedCounts).toEqual({
    ...emptyCounts(),
    [session.plan.items[0].modeId]: 1,
  });
  expect(advanced.currentIndex).toBe(1);
  expect(advanced.availableNext).toBe(false);
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
  expect(submitted.hint?.content).toBe(withHint.hint?.content);
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
      expect(finished.completedCounts).toEqual(
        perModeCounts(session.plan.items.map((item) => item.modeId)),
      );
      expect(finished.summary?.total).toBe(session.plan.length);
      return;
    }
    session = submitted.next();
  }
  throw new Error('The fixed session plan unexpectedly ran out of items.');
});

test('completed counts per representation edge stay exact after next()', () => {
  const session = start();
  const advanced = session.submit(correctAnswerFor(session)).next();
  expect(advanced.completedCounts).toEqual({
    ...emptyCounts(),
    [session.plan.items[0].modeId]: 1,
  });
  const advancedAgain = advanced
    .submit(correctAnswerFor(advanced))
    .next();
  expect(advancedAgain.completedCounts).toEqual({
    ...emptyCounts(),
    [session.plan.items[0].modeId]: 1,
    [session.plan.items[1].modeId]: 1,
  });
});

test('a session item composed directly matches the playback item', () => {
  const session = start();
  const item = session.plan.items[0];
  const direct = composePuzzle({
    problem: generateTotalFromPartsCase({
      seed: item.problemSeed,
      config: defaultTotalFromPartsGenerationConfig,
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
  expect(corrected.completedItems).toEqual(current.completedItems);
  const advanced = corrected.next();
  expect(advanced.completedItems).toEqual([
    ...current.completedItems,
    { index: item.index, modeId: item.modeId },
  ]);
});

test('requests a hint without submitting', () => {
  const current = seekToMode(start(), 'quantities-to-named-equation');
  const withHint = current.requestHint();
  expect(withHint.hint?.kind).toBe('structured');
  expect(withHint.hint?.modeId).toBe('quantities-to-named-equation');
  expect(withHint.hint?.content).toBe(
    'The total contains the base amount once, plus one unit value per item.',
  );
  expect(withHint.currentIndex).toBe(current.currentIndex);
  expect(withHint.completedItems).toEqual(current.completedItems);
  expect(withHint.screen?.feedback).toBeUndefined();
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
  expect(english.hint?.kind).toBe(norwegian.hint?.kind);
  expect(english.hint?.modeId).toBe(norwegian.hint?.modeId);
  expect(english.hint?.content).toBe(
    'The total contains the base amount once, plus one unit value per item.',
  );
  expect(norwegian.hint?.content).toBe(
    'Totalen inneholder grunnbeløpet én gang, pluss én enhetsverdi per enhet.',
  );
  expect(norwegianDrone.hint?.content).toBe(norwegian.hint?.content);
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
    case 'story-to-quantities':
      return {
        knownIds: ['base', 'count', 'total'],
        unknownId: 'unitValue',
      };
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
  return `${names.total} = ${names.base} + ${names.count} * ${names['per-item']}`;
}

function perModeCounts(modeIds: readonly string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const modeId of modeIds) {
    counts[modeId] = (counts[modeId] ?? 0) + 1;
  }
  return counts;
}
