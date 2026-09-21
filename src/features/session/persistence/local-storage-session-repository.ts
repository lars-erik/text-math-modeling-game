import {
  sessionPlannerVersion,
} from '../plan-session';
import {
  sessionSnapshotSchemaVersion,
  type CompletedSessionSummaryView,
  type SessionRepository,
  type SessionRunId,
  type SessionSnapshot,
  type StoredSessionSnapshot,
} from './session-snapshot';

export const sessionStorageKeys = {
  activeRun: 'math-modeling-game:session:active-run',
  completedRuns: 'math-modeling-game:session:completed-runs',
} as const;

export type BrowserStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type LocalStorageSessionRepositoryOptions = {
  storage?: BrowserStorageLike;
  schemaVersion?: number;
  plannerVersion?: string;
  now?: () => number;
};

export function createLocalStorageSessionRepository(
  options: LocalStorageSessionRepositoryOptions = {},
): SessionRepository {
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

  const readCompleted = (): readonly SessionSnapshot[] =>
    parseSnapshotList(readRaw(sessionStorageKeys.completedRuns));

  const isCompatible = (snapshot: SessionSnapshot): boolean =>
    snapshot.schemaVersion === schemaVersion &&
    snapshot.plannerVersion === plannerVersion;

  const writeActive = (snapshot: SessionSnapshot): boolean =>
    writeRaw(
      sessionStorageKeys.activeRun,
      JSON.stringify({ ...snapshot, updatedAt: now() }),
    );

  const writeCompleted = (snapshots: readonly SessionSnapshot[]): boolean =>
    writeRaw(
      sessionStorageKeys.completedRuns,
      JSON.stringify(
        snapshots.map((snapshot) => ({ ...snapshot, updatedAt: now() })),
      ),
    );

  const readValidActive = (): SessionSnapshot | undefined => {
    const raw = readRaw(sessionStorageKeys.activeRun);
    if (raw === null || raw === '') {
      return undefined;
    }
    const snapshot = parseSnapshot(raw);
    if (snapshot === undefined || !isCompatible(snapshot)) {
      removeRaw(sessionStorageKeys.activeRun);
      return undefined;
    }
    return snapshot;
  };

  const readValidCompleted = (): readonly SessionSnapshot[] => {
    const raw = readRaw(sessionStorageKeys.completedRuns);
    if (raw === null || raw === '') {
      return [];
    }
    const parsed = parseSnapshotList(raw);
    const valid = parsed.filter(isCompatible);
    if (valid.length !== parsed.length) {
      writeCompleted(valid);
    }
    return valid;
  };

  return {
    loadActiveRun: (): StoredSessionSnapshot | undefined => {
      const snapshot = readValidActive();
      return snapshot === undefined
        ? undefined
        : { runId: snapshot.runId, snapshot };
    },
    saveActiveRun: (snapshot: SessionSnapshot): SessionRunId => {
      writeActive(snapshot);
      if (readRaw(sessionStorageKeys.completedRuns) === null) {
        writeCompleted([]);
      }
      return snapshot.runId;
    },
    saveCompletedRun: (snapshot: SessionSnapshot): SessionRunId => {
      const stored = { ...snapshot, status: 'complete' as const };
      const active = readValidActive();
      if (active !== undefined && active.runId !== stored.runId) {
        writeActive(active);
      } else if (active?.runId === stored.runId) {
        removeRaw(sessionStorageKeys.activeRun);
      }
      const existing = readValidCompleted().filter(
        (candidate) => candidate.runId !== stored.runId,
      );
      writeCompleted([...existing, { ...stored, updatedAt: now() }]);
      return stored.runId;
    },
    listCompletedRuns: (): readonly CompletedSessionSummaryView[] =>
      readValidCompleted()
        .map((snapshot) => toSummary(snapshot))
        .sort((left, right) => right.completedAt - left.completedAt),
    discardRun: (runId: SessionRunId): void => {
      const active = readValidActive();
      if (active?.runId === runId) {
        removeRaw(sessionStorageKeys.activeRun);
      }
      const remaining = readValidCompleted().filter(
        (candidate) => candidate.runId !== runId,
      );
      writeCompleted(remaining);
    },
  };
}

function toSummary(snapshot: SessionSnapshot): CompletedSessionSummaryView {
  return {
    runId: snapshot.runId,
    seed: snapshot.seed,
    themeId: snapshot.themeId,
    locale: snapshot.locale,
    total: snapshot.answerLog.filter((entry) => entry.accepted).length,
    completedAt: snapshot.updatedAt,
  };
}

function parseSnapshot(raw: string | null): SessionSnapshot | undefined {
  if (raw === null || raw === '') {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSnapshotShape(parsed)) {
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
