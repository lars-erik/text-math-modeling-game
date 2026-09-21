import type { CompletedSessionSummaryView } from './persistence/session-snapshot';
import type { SessionRepository } from './persistence/session-snapshot';
import {
  restoreSessionRun,
  snapshotSessionRun,
  startSessionRun,
  type GrayboxSession,
  type StartSessionOptions,
} from './graybox-session';
import { createNewRunId, type SessionRunId } from './session-run-id';

export type RunIdMemory = {
  get: () => SessionRunId | undefined;
  set: (runId: SessionRunId) => void;
};

export type SessionRunStore = {
  start: (options: StartSessionOptions) => GrayboxSession;
  provide: (options: StartSessionOptions) => GrayboxSession;
  resumeActiveRun: () => GrayboxSession | undefined;
  record: (session: GrayboxSession) => void;
  completedRuns: () => readonly CompletedSessionSummaryView[];
  currentRunId: () => SessionRunId | undefined;
};

export type SessionRunStoreOptions = {
  repository: SessionRepository;
  runIdMemory: RunIdMemory;
};

export function createSessionRunStore(
  options: SessionRunStoreOptions,
): SessionRunStore {
  const { repository, runIdMemory } = options;
  let current: GrayboxSession | undefined;

  const safeSave = (session: GrayboxSession): void => {
    try {
      const snapshot = snapshotSessionRun(session);
      if (snapshot.status === 'complete') {
        repository.saveCompletedRun(snapshot);
      } else {
        repository.saveActiveRun(snapshot);
      }
    } catch {
      return;
    }
  };

  const restoreFromRepository = ():
    | GrayboxSession
    | undefined => {
    try {
      const stored = repository.loadActiveRun();
      if (stored === undefined) {
        return undefined;
      }
      const restored = restoreSessionRun(stored.snapshot);
      return restored.kind === 'restored' ? restored.session : undefined;
    } catch {
      return undefined;
    }
  };

  return {
    start(startOptions) {
      current = startSessionRun(startOptions, createNewRunId());
      runIdMemory.set(current.runId);
      safeSave(current);
      return current;
    },
    provide(provideOptions) {
      if (current !== undefined) {
        if (current.replay.seed === provideOptions.seed) {
          return current.replay.locale === provideOptions.locale
            ? current
            : withLocale(current, provideOptions.locale);
        }
        current = startSessionRun(provideOptions, createNewRunId());
        runIdMemory.set(current.runId);
        safeSave(current);
        return current;
      }
      const rememberedRunId = runIdMemory.get();
      const active = restoreFromRepository();
      if (
        rememberedRunId !== undefined &&
        active !== undefined &&
        active.runId === rememberedRunId &&
        active.replay.seed === provideOptions.seed
      ) {
        current = active;
        if (current.replay.locale !== provideOptions.locale) {
          current = withLocale(current, provideOptions.locale);
          safeSave(current);
        }
        return current;
      }
      current = startSessionRun(provideOptions, createNewRunId());
      runIdMemory.set(current.runId);
      safeSave(current);
      return current;
    },
    resumeActiveRun() {
      if (current !== undefined && current.status === 'active') {
        return current;
      }
      const rememberedRunId = runIdMemory.get();
      const active = restoreFromRepository();
      if (active === undefined || active.status !== 'active') {
        return undefined;
      }
      if (rememberedRunId !== undefined && active.runId !== rememberedRunId) {
        return undefined;
      }
      current = active;
      runIdMemory.set(active.runId);
      return active;
    },
    record(session) {
      current = session;
      runIdMemory.set(session.runId);
      safeSave(session);
    },
    completedRuns() {
      try {
        return repository.listCompletedRuns();
      } catch {
        return [];
      }
    },
    currentRunId: () => current?.runId,
  };
}

function withLocale(
  session: GrayboxSession,
  locale: StartSessionOptions['locale'],
): GrayboxSession {
  return session.withLocale(locale);
}
