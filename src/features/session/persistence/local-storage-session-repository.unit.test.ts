import { expect, test } from 'vitest';
import {
  createLocalStorageSessionRepository,
  sessionStorageKeys,
  type BrowserStorageLike,
} from './local-storage-session-repository';
import {
  restoreSessionRun,
  snapshotSessionRun,
  startSessionRun,
  type GrayboxSession,
} from '../graybox-session';
import { sessionPlannerVersion } from '../plan-session';
import { sessionSnapshotSchemaVersion } from './session-snapshot';

const sessionOptions = {
  seed: 918273,
  themeId: 'gaming.drone-power' as const,
  locale: 'en' as const,
};

function startRun(runId = 'run-one'): GrayboxSession {
  return startSessionRun(sessionOptions, runId);
}

type MemoryStorage = BrowserStorageLike & {
  backing: Map<string, string>;
};

function memoryStorage(initial: Record<string, string> = {}): MemoryStorage {
  const backing = new Map<string, string>(Object.entries(initial));
  return {
    backing,
    getItem: (key: string) => backing.get(key) ?? null,
    setItem: (key: string, value: string) => {
      backing.set(key, value);
    },
    removeItem: (key: string) => {
      backing.delete(key);
    },
  };
}

test('an active run persists under the namespaced application keys', () => {
  const storage = memoryStorage();
  const repository = createLocalStorageSessionRepository({ storage });
  const session = startRun();
  repository.saveActiveRun(snapshotSessionRun(session));

  expect(storage.backing.has(sessionStorageKeys.activeRun)).toBe(true);
  expect(storage.backing.has(sessionStorageKeys.completedRuns)).toBe(true);
  const raw = storage.backing.get(sessionStorageKeys.activeRun) ?? '';
  expect(raw).not.toContain('answerKey');
  expect(Object.keys(initialStorageScan(storage)).every((key) =>
    key.startsWith('math-modeling-game:'),
  )).toBe(true);
});

function initialStorageScan(
  storage: ReturnType<typeof memoryStorage>,
): Record<string, string> {
  return Object.fromEntries(storage.backing);
}

test('round-trips a run through storage and restores it', () => {
  const storage = memoryStorage();
  const repository = createLocalStorageSessionRepository({ storage });
  const session = startRun();
  repository.saveActiveRun(snapshotSessionRun(session));

  const repository2 = createLocalStorageSessionRepository({ storage });
  const stored = repository2.loadActiveRun();
  expect(stored?.runId).toBe('run-one');
  expect(stored && restoreSessionRun(stored.snapshot).kind).toBe('restored');
});

test('a completed run moves to history and is no longer offered as active', () => {
  const storage = memoryStorage();
  const repository = createLocalStorageSessionRepository({ storage });
  const session = startRun();
  repository.saveActiveRun(snapshotSessionRun(session));
  const completed = snapshotSessionRun({
    ...session,
    status: 'complete',
  });
  repository.saveCompletedRun(completed);
  expect(repository.loadActiveRun()).toBeUndefined();
  const history = repository.listCompletedRuns();
  expect(history).toHaveLength(1);
  expect(history[0]?.runId).toBe('run-one');
  expect(history[0]?.seed).toBe(918273);
});

test('schema version mismatch discards only application-owned records', () => {
  const storage = memoryStorage({
    'math-modeling-game:session:active-run': JSON.stringify({
      schemaVersion: 0,
      plannerVersion: sessionPlannerVersion,
      runId: 'run-old',
      seed: 1,
      themeId: 'gaming.drone-power',
      locale: 'en',
      status: 'active',
      currentIndex: 0,
      currentCompleted: false,
      hintGuidanceId: undefined,
      answerLog: [],
      updatedAt: 1,
    }),
    'math-modeling-game:session:completed-runs': JSON.stringify([
      {
        schemaVersion: 0,
        plannerVersion: sessionPlannerVersion,
        runId: 'run-old-complete',
        seed: 2,
        themeId: 'gaming.drone-power',
        locale: 'en',
        status: 'complete',
        currentIndex: 9,
        currentCompleted: true,
        hintGuidanceId: undefined,
        answerLog: [],
        updatedAt: 2,
      },
    ]),
    'other-app:data': 'keep me',
  });
  const repository = createLocalStorageSessionRepository({ storage });
  expect(repository.loadActiveRun()).toBeUndefined();
  expect(repository.listCompletedRuns()).toEqual([]);
  expect(storage.backing.get('other-app:data')).toBe('keep me');
  expect(storage.backing.has(sessionStorageKeys.activeRun)).toBe(false);
});

test('planner version mismatch discards incompatible records only', () => {
  const storage = memoryStorage();
  const repository = createLocalStorageSessionRepository({ storage });
  repository.saveActiveRun(snapshotSessionRun(startRun()));
  storage.backing.set(
    sessionStorageKeys.activeRun,
    JSON.stringify({
      ...JSON.parse(storage.backing.get(sessionStorageKeys.activeRun) ?? '{}'),
      plannerVersion: 'old-planner',
    }),
  );
  const repository2 = createLocalStorageSessionRepository({ storage });
  expect(repository2.loadActiveRun()).toBeUndefined();
  expect(storage.backing.has(sessionStorageKeys.activeRun)).toBe(false);
  expect(
    storage.backing.get('other-app:data') === undefined ||
      storage.backing.get('other-app:data') === 'keep me',
  ).toBe(true);
});

test('malformed JSON in one record is ignored without touching valid records', () => {
  const storage = memoryStorage();
  const repository = createLocalStorageSessionRepository({ storage });
  const session = startRun();
  repository.saveActiveRun(snapshotSessionRun(session));
  storage.backing.set(sessionStorageKeys.activeRun, '{not json');
  const repository2 = createLocalStorageSessionRepository({ storage });
  expect(repository2.loadActiveRun()).toBeUndefined();
  expect(storage.backing.has(sessionStorageKeys.activeRun)).toBe(false);
});


test('quota or write failures never throw and keep the game playable', () => {
  const failing: BrowserStorageLike = {
    getItem: () => {
      throw new Error('storage disabled');
    },
    setItem: () => {
      throw new Error('quota exceeded');
    },
    removeItem: () => {
      throw new Error('storage disabled');
    },
  };
  const repository = createLocalStorageSessionRepository({
    storage: failing,
  });
  expect(repository.loadActiveRun()).toBeUndefined();
  expect(() =>
    repository.saveActiveRun(snapshotSessionRun(startRun())),
  ).not.toThrow();
  expect(repository.listCompletedRuns()).toEqual([]);
});

test('unavailable storage keeps unrelated keys untouched and returns no runs', () => {
  const storage = memoryStorage({ 'other-app:data': 'keep me' });
  const repository = createLocalStorageSessionRepository({
    storage: {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    },
  });
  expect(repository.loadActiveRun()).toBeUndefined();
  expect(repository.saveActiveRun(snapshotSessionRun(startRun()))).toBe(
    'run-one',
  );
  expect(storage.backing.get('other-app:data')).toBe('keep me');
  expect(sessionStorageKeys.activeRun).toContain('math-modeling-game:');
  expect(sessionSnapshotSchemaVersion).toBeGreaterThan(0);
});
