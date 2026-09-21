import { sessionPlannerVersion } from '../plan-session';
import {
  sessionSnapshotSchemaVersion,
  type SessionSnapshot,
} from './session-snapshot';
import type {
  CompletedSessionSummary,
  SessionHistoryRepository,
} from './session-history';
import type { UserProfile, UserProfileRepository } from './user-profile';

const userProfileSchemaVersion = 1;

export const sessionStorageKeys = {
  profile: 'math-modeling-game:session:profile',
  completedRuns: 'math-modeling-game:session:completed-runs',
} as const;

export type BrowserStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type LocalStorageSessionPersistenceOptions = {
  storage?: BrowserStorageLike;
  schemaVersion?: number;
  plannerVersion?: string;
  now?: () => number;
};

export type LocalStorageSessionPersistence = {
  profileRepository: UserProfileRepository;
  historyRepository: SessionHistoryRepository;
};

export function createLocalStorageSessionPersistence(
  options: LocalStorageSessionPersistenceOptions = {},
): LocalStorageSessionPersistence {
  const storage = options.storage;
  const schemaVersion = options.schemaVersion ?? sessionSnapshotSchemaVersion;
  const plannerVersion = options.plannerVersion ?? sessionPlannerVersion;
  const now = options.now ?? (() => Date.now());

  const readRaw = (key: string): string | null => {
    try {
      return storage === undefined ? null : storage.getItem(key);
    } catch {
      return null;
    }
  };
  const writeRaw = (key: string, value: string): boolean => {
    try {
      storage?.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };
  const removeRaw = (key: string): void => {
    try {
      storage?.removeItem(key);
    } catch {
      return;
    }
  };

  const isCompatible = (snapshot: SessionSnapshot): boolean =>
    snapshot.schemaVersion === schemaVersion &&
    snapshot.plannerVersion === plannerVersion;

  const readValidCompleted = (): readonly SessionSnapshot[] => {
    const raw = readRaw(sessionStorageKeys.completedRuns);
    if (raw === null || raw === '') {
      return [];
    }
    const parsed = parseSnapshotList(raw);
    const valid = parsed.filter(isCompatible);
    if (valid.length !== parsed.length) {
      writeCompletedSnapshots(valid);
    }
    return valid;
  };

  const writeCompletedSnapshots = (
    snapshots: readonly SessionSnapshot[],
  ): boolean =>
    writeRaw(sessionStorageKeys.completedRuns, JSON.stringify(snapshots));

  return {
    profileRepository: {
      loadProfile: (): UserProfile => {
        const raw = readRaw(sessionStorageKeys.profile);
        if (raw === null || raw === '') {
          return {};
        }
        const profile = parseProfile(raw);
        if (
          profile === undefined ||
          profile.schemaVersion !== userProfileSchemaVersion ||
          profile.activeSession === undefined ||
          !isCompatible(profile.activeSession)
        ) {
          removeRaw(sessionStorageKeys.profile);
          return {};
        }
        return { activeSession: profile.activeSession };
      },
      saveProfile(profile: UserProfile): void {
        if (profile.activeSession === undefined) {
          removeRaw(sessionStorageKeys.profile);
          return;
        }
        writeRaw(
          sessionStorageKeys.profile,
          JSON.stringify({
            schemaVersion: userProfileSchemaVersion,
            activeSession: { ...profile.activeSession, updatedAt: now() },
          }),
        );
      },
    },
    historyRepository: {
      saveCompleted(snapshot: SessionSnapshot): void {
        const stored: SessionSnapshot = {
          ...snapshot,
          status: 'complete',
          updatedAt: now(),
        };
        const profile = parseProfile(
          readRaw(sessionStorageKeys.profile) ?? '',
        );
        if (profile?.activeSession?.runId === stored.runId) {
          removeRaw(sessionStorageKeys.profile);
        }
        const existing = readValidCompleted().filter(
          (candidate) => candidate.runId !== stored.runId,
        );
        writeCompletedSnapshots([...existing, stored]);
      },
      listCompleted: (): readonly CompletedSessionSummary[] =>
        readValidCompleted()
          .map(toSummary)
          .sort((left, right) => right.completedAt - left.completedAt),
      removeCompleted(runId: string): void {
        const profile = parseProfile(
          readRaw(sessionStorageKeys.profile) ?? '',
        );
        if (profile?.activeSession?.runId === runId) {
          removeRaw(sessionStorageKeys.profile);
        }
        const remaining = readValidCompleted().filter(
          (candidate) => candidate.runId !== runId,
        );
        writeCompletedSnapshots(remaining);
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

type StoredProfile = {
  schemaVersion: number;
  activeSession?: SessionSnapshot;
};

function parseProfile(raw: string): StoredProfile | undefined {
  if (raw === null || raw === '') {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isProfileShape(parsed)) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function parseSnapshotList(raw: string | null): readonly SessionSnapshot[] {
  if (raw === null || raw === '') {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isSnapshotShape);
  } catch {
    return [];
  }
}

function isProfileShape(value: unknown): value is StoredProfile {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Partial<StoredProfile>;
  return (
    typeof candidate.schemaVersion === 'number' &&
    (candidate.activeSession === undefined ||
      isSnapshotShape(candidate.activeSession))
  );
}

function isSnapshotShape(value: unknown): value is SessionSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Partial<SessionSnapshot>;
  return (
    typeof candidate.schemaVersion === 'number' &&
    typeof candidate.plannerVersion === 'string' &&
    typeof candidate.runId === 'string' &&
    typeof candidate.seed === 'number' &&
    typeof candidate.themeId === 'string' &&
    (candidate.locale === 'en' || candidate.locale === 'nb') &&
    (candidate.status === 'active' || candidate.status === 'complete') &&
    typeof candidate.currentIndex === 'number' &&
    typeof candidate.currentCompleted === 'boolean' &&
    (candidate.hintGuidanceId === undefined ||
      typeof candidate.hintGuidanceId === 'string') &&
    Array.isArray(candidate.answerLog) &&
    candidate.answerLog.every(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as { itemIndex?: unknown }).itemIndex === 'number' &&
        typeof (entry as { modeId?: unknown }).modeId === 'string' &&
        typeof (entry as { accepted?: unknown }).accepted === 'boolean',
    ) &&
    typeof candidate.updatedAt === 'number'
  );
}
