import type { CompletedSessionSummary } from './persistence/session-history';
import type { SessionHistoryRepository } from './persistence/session-history';
import type { UserProfileRepository } from './persistence/user-profile';
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
  completedRuns: () => readonly CompletedSessionSummary[];
  currentRunId: () => SessionRunId | undefined;
};

export type SessionRunStoreOptions = {
  profileRepository: UserProfileRepository;
  historyRepository: SessionHistoryRepository;
  runIdMemory: RunIdMemory;
};

export function createSessionRunStore(
  options: SessionRunStoreOptions,
): SessionRunStore {
  const { profileRepository, historyRepository, runIdMemory } = options;
  let current: GrayboxSession | undefined;

  const sameRunInputs = (
    session: GrayboxSession,
    wanted: StartSessionOptions,
  ): boolean =>
    session.replay.seed === wanted.seed &&
    session.replay.themeId === wanted.themeId;

  const safeSave = (session: GrayboxSession): void => {
    try {
      const snapshot = snapshotSessionRun(session);
      if (snapshot.status === 'complete') {
        historyRepository.saveCompleted(snapshot);
      } else {
        profileRepository.saveProfile({ activeSession: snapshot });
      }
    } catch {
      return;
    }
  };

  const restoreFromProfile = (): GrayboxSession | undefined => {
    try {
      const profile = profileRepository.loadProfile();
      if (profile.activeSession === undefined) {
        return undefined;
      }
      const restored = restoreSessionRun(profile.activeSession);
      return restored.kind === 'restored' ? restored.session : undefined;
    } catch {
      return undefined;
    }
  };

  const startNewRun = (startOptions: StartSessionOptions): GrayboxSession => {
    current = startSessionRun(startOptions, createNewRunId());
    runIdMemory.set(current.runId);
    safeSave(current);
    return current;
  };

  return {
    start(startOptions) {
      return startNewRun(startOptions);
    },
    provide(provideOptions) {
      if (current !== undefined) {
        if (sameRunInputs(current, provideOptions)) {
          return current.replay.locale === provideOptions.locale
            ? current
            : withLocale(current, provideOptions.locale);
        }
        return startNewRun(provideOptions);
      }
      const rememberedRunId = runIdMemory.get();
      const active = restoreFromProfile();
      if (
        rememberedRunId !== undefined &&
        active !== undefined &&
        active.runId === rememberedRunId &&
        sameRunInputs(active, provideOptions)
      ) {
        current = active;
        if (current.replay.locale !== provideOptions.locale) {
          current = withLocale(current, provideOptions.locale);
          safeSave(current);
        }
        return current;
      }
      return startNewRun(provideOptions);
    },
    resumeActiveRun() {
      if (current !== undefined && current.status === 'active') {
        return current;
      }
      const rememberedRunId = runIdMemory.get();
      const active = restoreFromProfile();
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
        return historyRepository.listCompleted();
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
