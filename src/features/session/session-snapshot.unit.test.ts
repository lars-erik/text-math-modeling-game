import { expect, test } from 'vitest';
import { createInMemorySessionPersistence } from './persistence/in-memory-session-repository';
import {
  startSessionRun,
  snapshotSessionRun,
  restoreSessionRun,
  type GrayboxSession,
} from './graybox-session';
import { sessionPlannerVersion } from './plan-session';
import { sessionSnapshotSchemaVersion } from './persistence/session-snapshot';
import { formatAcademicInput } from '../representations/academic-relation';
import type { PuzzleLocale } from '../puzzle/lang';
import type { ThemeId } from '../themes';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { QuantitySelection } from '../puzzle/modes';

const sessionSeed = 918273;

const sessionOptions = {
  seed: sessionSeed,
  themeId: 'gaming.drone-power' as ThemeId,
  locale: 'en' as PuzzleLocale,
};

function startRun(
  options = sessionOptions,
  runId = 'run-one',
): GrayboxSession {
  return startSessionRun(options, runId);
}

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
    case 'academic-notation-to-named-equation': {
      const quantities = session.screen?.context.quantities ?? [];
      const names = Object.fromEntries(
        quantities.map((quantity) => [quantity.role, quantity.variableName]),
      );
      return {
        kind: 'text',
        input: `${names.total} = ${names.base} + ${names.count} * ${names['per-item']}`,
      };
    }
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

test('an active session snapshot round-trips through an in-memory repository', () => {
  const persistence = createInMemorySessionPersistence();
  const session = startRun();
  const submitted = session.submit({ kind: 'text', input: 'wrong = wrong' });
  const advanced = submitted.submit(correctAnswerFor(submitted)).next();
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(advanced),
  });

  const stored = persistence.profileRepository.loadProfile().activeSession;
  expect(stored?.runId).toBe('run-one');
  const restored = restoreSessionRun(stored!);
  expect(restored.kind).toBe('restored');
  const session2 = restored.kind === 'restored' ? restored.session : undefined!;
  expect(session2.runId).toBe('run-one');
  expect(session2.status).toBe('active');
  expect(session2.currentIndex).toBe(advanced.currentIndex);
  expect(session2.answerLog).toEqual(advanced.answerLog);
  expect(session2.replay).toEqual(advanced.replay);
});

test('a snapshot is plain JSON data with schema and planner versions', () => {
  const session = startRun();
  const snapshot = snapshotSessionRun(session);
  expect(snapshot.schemaVersion).toBe(sessionSnapshotSchemaVersion);
  expect(snapshot.plannerVersion).toBe(sessionPlannerVersion);
  const serialized = JSON.parse(JSON.stringify(snapshot));
  expect(serialized).toEqual({
    ...snapshot,
    answerLog: snapshot.answerLog.map((entry) => ({
      ...entry,
      submission: { ...entry.submission },
    })),
  });
  expect(JSON.stringify(snapshot)).not.toContain('answerKey');
  expect(JSON.stringify(snapshot)).not.toContain('"relation"');
  expect(JSON.stringify(snapshot)).not.toContain('guidance');
});

test('restoring an active run preserves the current item, latest answers, hint and next availability', () => {
  const current = seekToMode(startRun(), 'quantities-to-named-equation');
  const withHint = current.requestHint();
  const submitted = withHint.submit({ kind: 'text', input: 'wrong = wrong' });
  const snapshot = snapshotSessionRun(submitted);
  const restored = restoreSessionRun(snapshot);
  expect(restored.kind).toBe('restored');
  const session2 = restored.kind === 'restored' ? restored.session : undefined!;
  expect(session2.status).toBe('active');
  expect(session2.currentIndex).toBe(submitted.currentIndex);
  expect(session2.position).toBe(submitted.position);
  expect(session2.answerLog).toEqual(submitted.answerLog);
  expect(session2.hint).toEqual(submitted.hint);
  expect(session2.availableNext).toBe(false);
  expect(session2.screen?.screen.modeId).toBe(submitted.screen?.screen.modeId);
  expect(session2.screen?.feedback?.kind).toBe(
    submitted.screen?.feedback?.kind,
  );
  expect(session2.screen?.screen.modeId).toBe('quantities-to-named-equation');
  const modeInput = session2.screen?.screen;
  expect(
    modeInput !== undefined &&
      modeInput.modeId === 'quantities-to-named-equation'
      ? modeInput.input.value
      : undefined,
  ).toBe('wrong = wrong');
});

test('restoring an accepted item keeps its accepted screen and next availability', () => {
  const session = startRun();
  const submitted = session.submit(correctAnswerFor(session));
  const snapshot = snapshotSessionRun(submitted);
  const restored = restoreSessionRun(snapshot);
  expect(restored.kind).toBe('restored');
  const session2 = restored.kind === 'restored' ? restored.session : undefined!;
  expect(session2.availableNext).toBe(true);
  expect(session2.screen?.feedback?.kind).toBe(
    submitted.screen?.feedback?.kind,
  );
  expect(session2.answerLog).toEqual(submitted.answerLog);
  expect(session2.answerLog[0]?.accepted).toBe(true);
});

test('a restored session continues deterministically from its position', () => {
  const session = startRun();
  const advanced = session.submit(correctAnswerFor(session)).next();
  const restored = restoreSessionRun(snapshotSessionRun(advanced));
  const session2 = restored.kind === 'restored' ? restored.session : undefined!;
  const continued = session2.submit(correctAnswerFor(session2));
  expect(continued.answerLog.map((entry) => entry.itemIndex)).toEqual(
    [1, 2],
  );
  expect(continued.answerLog[1]?.accepted).toBe(true);
  expect(advanced.submit(correctAnswerFor(advanced)).answerLog).toEqual(
    continued.answerLog,
  );
});

test('a completed run restores as complete with its summary and never as active', () => {
  let session: GrayboxSession = startRun();
  for (let index = 0; index < session.plan.length; index += 1) {
    const submitted = session.submit(correctAnswerFor(session));
    session = index === session.plan.length - 1
      ? submitted.next()
      : submitted.next();
  }
  expect(session.status).toBe('complete');
  const snapshot = snapshotSessionRun(session);
  expect(snapshot.status).toBe('complete');
  const restored = restoreSessionRun(snapshot);
  expect(restored.kind).toBe('restored');
  const session2 = restored.kind === 'restored' ? restored.session : undefined!;
  expect(session2.status).toBe('complete');
  expect(session2.summary).toEqual(session.summary);
  expect(session2.answerLog).toEqual(session.answerLog);
  expect(() => session2.submit({ kind: 'text', input: 'a = b' })).toThrowError();
});

test('schema and planner version mismatches are reported as incompatible', () => {
  const snapshot = snapshotSessionRun(startRun());
  expect(
    restoreSessionRun({ ...snapshot, schemaVersion: snapshot.schemaVersion + 1 })
      .kind,
  ).toBe('incompatible');
  expect(
    restoreSessionRun({ ...snapshot, plannerVersion: 'other-planner' }).kind,
  ).toBe('incompatible');
});

test('invalid snapshots are rejected instead of restoring a broken run', () => {
  const snapshot = snapshotSessionRun(startRun());
  expect(
    restoreSessionRun({ ...snapshot, currentIndex: 99 }).kind,
  ).toBe('incompatible');
  expect(
    restoreSessionRun({
      ...snapshot,
      answerLog: [
        {
          itemIndex: 1,
          modeId: 'story-to-quantities',
          accepted: false,
          submission: {
            kind: 'named-equation',
            answerKind: 'text',
            input: 'wrong = wrong',
          },
        },
      ],
    }).kind,
  ).toBe('incompatible');
});

test('two runs with the same seed keep distinct run identities', () => {
  const first = startRun(sessionOptions, 'run-alpha');
  const second = startRun(sessionOptions, 'run-beta');
  const firstAdvanced = first.submit(correctAnswerFor(first));
  const secondAdvanced = second.submit({ kind: 'text', input: 'x = y' });
  expect(firstAdvanced.runId).not.toBe(secondAdvanced.runId);
  expect(snapshotSessionRun(firstAdvanced).runId).toBe('run-alpha');
  expect(snapshotSessionRun(secondAdvanced).runId).toBe('run-beta');
  const repository = createInMemorySessionPersistence();
  repository.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(secondAdvanced),
  });
  expect(repository.profileRepository.loadProfile().activeSession?.runId)
    .toBe('run-beta');
});
