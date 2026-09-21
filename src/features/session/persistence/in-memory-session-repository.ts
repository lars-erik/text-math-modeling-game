import {
  type CompletedSessionSummaryView,
  type SessionRepository,
  type SessionRunId,
  type SessionSnapshot,
  type StoredSessionSnapshot,
} from './session-snapshot';

export type InMemorySessionRepositoryOptions = {
  now?: () => number;
};

export function createInMemorySessionRepository(
  options: InMemorySessionRepositoryOptions = {},
): SessionRepository {
  const now = options.now ?? (() => Date.now());
  let active: SessionSnapshot | undefined;
  const completed = new Map<SessionRunId, SessionSnapshot>();
  return {
    loadActiveRun: (): StoredSessionSnapshot | undefined =>
      active === undefined
        ? undefined
        : { runId: active.runId, snapshot: clone(active) },
    saveActiveRun: (snapshot: SessionSnapshot): SessionRunId => {
      active = clone({ ...snapshot, updatedAt: now() });
      return active.runId;
    },
    saveCompletedRun: (snapshot: SessionSnapshot): SessionRunId => {
      const stored = clone({ ...snapshot, status: 'complete', updatedAt: now() });
      completed.set(stored.runId, stored);
      if (active?.runId === stored.runId) {
        active = undefined;
      }
      return stored.runId;
    },
    listCompletedRuns: (): readonly CompletedSessionSummaryView[] =>
      [...completed.values()]
        .sort((left, right) => right.updatedAt - left.updatedAt)
        .map((snapshot) => ({
          runId: snapshot.runId,
          seed: snapshot.seed,
          themeId: snapshot.themeId,
          locale: snapshot.locale,
          total: snapshot.answerLog.filter((entry) => entry.accepted).length,
          completedAt: snapshot.updatedAt,
        })),
    discardRun: (runId: SessionRunId): void => {
      if (active?.runId === runId) {
        active = undefined;
      }
      completed.delete(runId);
    },
  };
}

function clone(snapshot: SessionSnapshot): SessionSnapshot {
  return {
    ...snapshot,
    answerLog: snapshot.answerLog.map((entry) => ({
      ...entry,
      submission: { ...entry.submission },
    })),
  };
}
