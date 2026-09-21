import type { SessionSnapshot } from './session-snapshot';
import type {
  CompletedSessionSummary,
  SessionHistoryRepository,
} from './session-history';
import type { UserProfile, UserProfileRepository } from './user-profile';

export type InMemoryPersistenceOptions = {
  now?: () => number;
};

export type InMemorySessionPersistence = {
  profileRepository: UserProfileRepository;
  historyRepository: SessionHistoryRepository;
};

export function createInMemorySessionPersistence(
  options: InMemoryPersistenceOptions = {},
): InMemorySessionPersistence {
  const now = options.now ?? (() => Date.now());
  let profile: UserProfile = {};
  const completed = new Map<string, SessionSnapshot>();
  return {
    profileRepository: {
      loadProfile: (): UserProfile =>
        profile.activeSession === undefined
          ? {}
          : { activeSession: clone(profile.activeSession) },
      saveProfile(next: UserProfile): void {
        profile =
          next.activeSession === undefined
            ? {}
            : {
                activeSession: clone({
                  ...next.activeSession,
                  updatedAt: now(),
                }),
              };
      },
    },
    historyRepository: {
      saveCompleted(snapshot: SessionSnapshot): void {
        completed.set(snapshot.runId, clone({
          ...snapshot,
          status: 'complete',
          updatedAt: now(),
        }));
        if (profile.activeSession?.runId === snapshot.runId) {
          profile = {};
        }
      },
      listCompleted: (): readonly CompletedSessionSummary[] =>
        [...completed.values()]
          .sort((left, right) => right.updatedAt - left.updatedAt)
          .map(toSummary),
      removeCompleted(runId: string): void {
        completed.delete(runId);
      },
    },
  };
}

function toSummary(snapshot: SessionSnapshot): CompletedSessionSummary {
  return {
    runId: snapshot.runId,
    seed: snapshot.seed,
    themeId: snapshot.themeId,
    locale: snapshot.locale,
    total: snapshot.answerLog.filter((entry) => entry.accepted).length,
    completedAt: snapshot.updatedAt,
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
