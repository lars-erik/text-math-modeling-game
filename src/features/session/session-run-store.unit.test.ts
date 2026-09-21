import { expect, test } from 'vitest';
import {
  createInMemorySessionPersistence,
  type InMemorySessionPersistence,
} from './persistence/in-memory-session-repository';
import type {
  SessionHistoryRepository,
} from './persistence/session-history';
import type { UserProfileRepository } from './persistence/user-profile';
import {
  createSessionRunStore,
  type RunIdMemory,
  type SessionRunStore,
} from './session-run-store';
import {
  snapshotSessionRun,
  type GrayboxSession,
  type StartSessionOptions,
} from './graybox-session';
import { formatAcademicInput } from '../representations/academic-relation';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { QuantitySelection } from '../puzzle/modes';

const sessionOptions: StartSessionOptions = {
  seed: 918273,
  themeId: 'gaming.drone-power',
  locale: 'en',
};

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
        input: formatAcademicInput(task.source.relation, task.target.symbols),
      };
  }
}

function inMemoryRunIdMemory(): RunIdMemory & { value: string | undefined } {
  const memory = { value: undefined as string | undefined };
  return {
    value: undefined,
    get: () => memory.value,
    set: (runId) => {
      memory.value = runId;
    },
  };
}

type StoreHarness = {
  store: SessionRunStore;
  persistence: InMemorySessionPersistence;
  runIdMemory: RunIdMemory;
};

function harness(): StoreHarness {
  const persistence = createInMemorySessionPersistence();
  const runIdMemory = inMemoryRunIdMemory();
  return {
    store: createSessionRunStore({
      profileRepository: persistence.profileRepository,
      historyRepository: persistence.historyRepository,
      runIdMemory,
    }),
    persistence,
    runIdMemory,
  };
}

function reloadedStore(
  persistence: InMemorySessionPersistence,
  runIdMemory: RunIdMemory,
): SessionRunStore {
  return createSessionRunStore({
    profileRepository: persistence.profileRepository,
    historyRepository: persistence.historyRepository,
    runIdMemory,
  });
}

test('start records a new active run with a fresh run identity', () => {
  const h = harness();
  const session = h.store.start(sessionOptions);
  expect(session.runId).not.toBe('');
  expect(session.status).toBe('active');
  expect(h.persistence.profileRepository.loadProfile().activeSession?.runId)
    .toBe(session.runId);
  expect(h.runIdMemory.get()).toBe(session.runId);
});

test('provide returns the current in-memory run instead of starting a new one', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  const provided = h.store.provide(sessionOptions);
  expect(provided.runId).toBe(started.runId);
  expect(provided.currentIndex).toBe(started.currentIndex);
});

test('provide resumes the remembered run after a reload', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  const advanced = started
    .submit({ kind: 'text', input: 'wrong = wrong' })
    .submit(correctAnswerFor(started))
    .next();
  h.store.record(advanced);

  const reloaded = reloadedStore(h.persistence, h.runIdMemory);
  const provided = reloaded.provide(sessionOptions);
  expect(provided.runId).toBe(advanced.runId);
  expect(provided.status).toBe('active');
  expect(provided.currentIndex).toBe(advanced.currentIndex);
  expect(provided.answerLog).toEqual(advanced.answerLog);
  expect(provided).not.toBe(advanced);
});

test('provide starts a new run when no run is remembered, even if an active run exists', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  const advanced = started.submit(correctAnswerFor(started)).next();
  h.store.record(advanced);

  const freshTab = inMemoryRunIdMemory();
  const replayStore = reloadedStore(h.persistence, freshTab);
  const replayed = replayStore.provide(sessionOptions);
  expect(replayed.runId).not.toBe(started.runId);
  expect(replayed.currentIndex).toBe(0);
  expect(replayed.answerLog).toEqual([]);
  expect(freshTab.get()).toBe(replayed.runId);
  expect(h.persistence.profileRepository.loadProfile().activeSession?.runId)
    .toBe(replayed.runId);
});

test('starting a second run with the same seed replaces the active run without resuming the first', () => {
  const h = harness();
  const first = h.store.start(sessionOptions);
  const advanced = first.submit(correctAnswerFor(first)).next();
  h.store.record(advanced);

  const second = h.store.start(sessionOptions);
  expect(second.runId).not.toBe(first.runId);
  expect(second.currentIndex).toBe(0);
  expect(h.persistence.profileRepository.loadProfile().activeSession?.runId)
    .toBe(second.runId);
  expect(h.runIdMemory.get()).toBe(second.runId);

  const provided = h.store.provide(sessionOptions);
  expect(provided.runId).toBe(second.runId);
  expect(provided.currentIndex).toBe(0);
});

test('recording a completed run moves it to history and clears the active run', () => {
  const h = harness();
  let session = h.store.start(sessionOptions);
  for (let index = 0; index < session.plan.length; index += 1) {
    session = session.submit(correctAnswerFor(session)).next();
  }
  expect(session.status).toBe('complete');
  h.store.record(session);
  expect(h.persistence.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  const history = h.store.completedRuns();
  expect(history).toHaveLength(1);
  expect(history[0]?.runId).toBe(session.runId);
  expect(history[0]?.seed).toBe(sessionOptions.seed);
  expect(history[0]?.total).toBe(session.plan.length);
});

test('provide never reuses a completed run when the same seed and theme are requested again', () => {
  const h = harness();
  let session: GrayboxSession = h.store.start(sessionOptions);
  for (let index = 0; index < session.plan.length; index += 1) {
    session = session.submit(correctAnswerFor(session)).next();
  }
  expect(session.status).toBe('complete');
  h.store.record(session);

  const provided = h.store.provide(sessionOptions);
  expect(provided.status).toBe('active');
  expect(provided.runId).not.toBe(session.runId);
  expect(provided.currentIndex).toBe(0);
  expect(provided.answerLog).toEqual([]);
  const history = h.store.completedRuns();
  expect(history).toHaveLength(1);
  expect(history[0]?.runId).toBe(session.runId);
});

test('resumeActiveRun restores the active run and reports none after completion', () => {
  const h = harness();
  expect(h.store.resumeActiveRun()).toBeUndefined();
  const started = h.store.start(sessionOptions);
  const advanced = started.submit(correctAnswerFor(started)).next();
  h.store.record(advanced);

  const reloaded = reloadedStore(h.persistence, h.runIdMemory);
  const resumed = reloaded.resumeActiveRun();
  expect(resumed?.runId).toBe(advanced.runId);
  expect(resumed?.currentIndex).toBe(advanced.currentIndex);
  expect(h.runIdMemory.get()).toBe(advanced.runId);
  expect(reloaded.resumeActiveRun()?.runId).toBe(advanced.runId);

  let completed: GrayboxSession | undefined = advanced;
  while (completed?.status === 'active') {
    completed = completed.submit(correctAnswerFor(completed)).next();
  }
  h.store.record(completed!);
  const afterCompletion = reloadedStore(h.persistence, h.runIdMemory);
  expect(afterCompletion.resumeActiveRun()).toBeUndefined();
});

test('provide keeps the selected language when resuming with a different locale', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  const advanced = started.submit(correctAnswerFor(started)).next();
  h.store.record(advanced);

  const reloaded = reloadedStore(h.persistence, h.runIdMemory);
  const resumed = reloaded.provide({ ...sessionOptions, locale: 'nb' });
  expect(resumed.runId).toBe(advanced.runId);
  expect(resumed.replay.locale).toBe('nb');
  expect(resumed.answerLog).toEqual(advanced.answerLog);
  expect(reloaded.provide(sessionOptions).replay.locale).toBe('en');
});

test('provide starts a new run when the route selects a different seed', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  h.store.record(started.submit(correctAnswerFor(started)).next());

  const other = h.store.provide({ ...sessionOptions, seed: 4242 });
  expect(other.runId).not.toBe(started.runId);
  expect(other.replay.seed).toBe(4242);
  expect(h.persistence.profileRepository.loadProfile().activeSession?.seed)
    .toBe(4242);
});

test('provide starts a new run when the route selects the same seed with a different scenario', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  const advanced = started.submit(correctAnswerFor(started)).next();
  h.store.record(advanced);

  const otherTheme = h.store.provide({
    ...sessionOptions,
    themeId: 'creator.followers',
  });
  expect(otherTheme.runId).not.toBe(started.runId);
  expect(otherTheme.replay.themeId).toBe('creator.followers');
  expect(otherTheme.currentIndex).toBe(0);
  expect(otherTheme.answerLog).toEqual([]);
  expect(h.persistence.profileRepository.loadProfile().activeSession?.themeId)
    .toBe('creator.followers');

  const reloaded = reloadedStore(h.persistence, h.runIdMemory);
  const resumedWithOldTheme = reloaded.provide({
    ...sessionOptions,
    themeId: 'creator.followers',
  });
  expect(resumedWithOldTheme.runId).toBe(otherTheme.runId);
  expect(reloaded.provide({
    ...sessionOptions,
    themeId: 'gaming.drone-power',
  }).runId).not.toBe(advanced.runId);
});

test('the store never throws when the repositories reject writes', () => {
  const throwingProfile: UserProfileRepository = {
    loadProfile: () => {
      throw new Error('storage disabled');
    },
    saveProfile: () => {
      throw new Error('quota exceeded');
    },
  };
  const throwingHistory: SessionHistoryRepository = {
    listCompleted: () => {
      throw new Error('storage disabled');
    },
    saveCompleted: () => {
      throw new Error('quota exceeded');
    },
    removeCompleted: () => {
      throw new Error('storage disabled');
    },
  };
  const store = createSessionRunStore({
    profileRepository: throwingProfile,
    historyRepository: throwingHistory,
    runIdMemory: inMemoryRunIdMemory(),
  });
  const session = store.provide(sessionOptions);
  expect(session.status).toBe('active');
  expect(() => store.record(session.submit({ kind: 'text', input: 'a = b' })))
    .not.toThrow();
  expect(store.completedRuns()).toEqual([]);
  expect(store.resumeActiveRun()?.runId).toBe(session.runId);
  expect(store.currentRunId()).toBe(session.runId);
  expect(snapshotSessionRun(session).runId).toBe(session.runId);
});
