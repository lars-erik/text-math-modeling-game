import { expect, test } from 'vitest';
import { createInMemorySessionRepository } from './persistence/session-repository';
import type { SessionRepository } from './persistence/session-snapshot';
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
  repository: SessionRepository;
  runIdMemory: RunIdMemory;
};

function harness(): StoreHarness {
  const repository = createInMemorySessionRepository();
  const runIdMemory = inMemoryRunIdMemory();
  return {
    store: createSessionRunStore({ repository, runIdMemory }),
    repository,
    runIdMemory,
  };
}

function reloadedStore(
  repository: SessionRepository,
  runIdMemory: RunIdMemory,
): SessionRunStore {
  return createSessionRunStore({ repository, runIdMemory });
}

test('start records a new active run with a fresh run identity', () => {
  const h = harness();
  const session = h.store.start(sessionOptions);
  expect(session.runId).not.toBe('');
  expect(session.status).toBe('active');
  expect(h.repository.loadActiveRun()?.runId).toBe(session.runId);
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

  const reloaded = reloadedStore(h.repository, h.runIdMemory);
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
  const replayStore = reloadedStore(h.repository, freshTab);
  const replayed = replayStore.provide(sessionOptions);
  expect(replayed.runId).not.toBe(started.runId);
  expect(replayed.currentIndex).toBe(0);
  expect(replayed.answerLog).toEqual([]);
  expect(freshTab.get()).toBe(replayed.runId);
  expect(h.repository.loadActiveRun()?.runId).toBe(replayed.runId);
});

test('starting a second run with the same seed replaces the active run without resuming the first', () => {
  const h = harness();
  const first = h.store.start(sessionOptions);
  const advanced = first.submit(correctAnswerFor(first)).next();
  h.store.record(advanced);

  const second = h.store.start(sessionOptions);
  expect(second.runId).not.toBe(first.runId);
  expect(second.currentIndex).toBe(0);
  expect(h.repository.loadActiveRun()?.runId).toBe(second.runId);
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
  expect(h.repository.loadActiveRun()).toBeUndefined();
  const history = h.store.completedRuns();
  expect(history).toHaveLength(1);
  expect(history[0]?.runId).toBe(session.runId);
  expect(history[0]?.seed).toBe(sessionOptions.seed);
  expect(history[0]?.total).toBe(session.plan.length);
});

test('resumeActiveRun restores the active run and reports none after completion', () => {
  const h = harness();
  expect(h.store.resumeActiveRun()).toBeUndefined();
  const started = h.store.start(sessionOptions);
  const advanced = started.submit(correctAnswerFor(started)).next();
  h.store.record(advanced);

  const reloaded = reloadedStore(h.repository, h.runIdMemory);
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
  const afterCompletion = reloadedStore(h.repository, h.runIdMemory);
  expect(afterCompletion.resumeActiveRun()).toBeUndefined();
});

test('provide keeps the selected language when resuming with a different locale', () => {
  const h = harness();
  const started = h.store.start(sessionOptions);
  const advanced = started.submit(correctAnswerFor(started)).next();
  h.store.record(advanced);

  const reloaded = reloadedStore(h.repository, h.runIdMemory);
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
  expect(h.repository.loadActiveRun()?.snapshot.seed).toBe(4242);
});

test('the store never throws when the repository rejects writes', () => {
  const repository: SessionRepository = {
    loadActiveRun: () => {
      throw new Error('storage disabled');
    },
    saveActiveRun: () => {
      throw new Error('quota exceeded');
    },
    saveCompletedRun: () => {
      throw new Error('quota exceeded');
    },
    listCompletedRuns: () => {
      throw new Error('storage disabled');
    },
    discardRun: () => {
      throw new Error('storage disabled');
    },
  };
  const store = createSessionRunStore({
    repository,
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
