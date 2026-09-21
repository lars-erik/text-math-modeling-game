import { expect, test } from 'vitest';
import {
  createLocalStorageSessionPersistence,
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
  const persistence = createLocalStorageSessionPersistence({ storage });
  const session = startRun();
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(session),
  });

  expect(storage.backing.has(sessionStorageKeys.profile)).toBe(true);
  const raw = storage.backing.get(sessionStorageKeys.profile) ?? '';
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
  const persistence = createLocalStorageSessionPersistence({ storage });
  const session = startRun();
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(session),
  });

  const persistence2 = createLocalStorageSessionPersistence({ storage });
  const stored = persistence2.profileRepository.loadProfile().activeSession;
  expect(stored?.runId).toBe('run-one');
  expect(stored && restoreSessionRun(stored).kind).toBe('restored');
});

test('a completed run moves to history and is no longer offered as active', () => {
  const storage = memoryStorage();
  const persistence = createLocalStorageSessionPersistence({ storage });
  const session = startRun();
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(session),
  });
  const completed = snapshotSessionRun({
    ...session,
    status: 'complete',
  });
  persistence.historyRepository.saveCompleted(completed);
  expect(
    persistence.profileRepository.loadProfile().activeSession,
  ).toBeUndefined();
  const history = persistence.historyRepository.listCompleted();
  expect(history).toHaveLength(1);
  expect(history[0]?.runId).toBe('run-one');
  expect(history[0]?.seed).toBe(918273);
});

test('saving a completed run preserves earlier completion timestamps', () => {
  let clock = 1_000;
  const storage = memoryStorage();
  const persistence = createLocalStorageSessionPersistence({
    storage,
    now: () => clock,
  });
  persistence.historyRepository.saveCompleted(
    snapshotSessionRun(startRun('run-first')),
  );
  clock = 2_000;
  persistence.historyRepository.saveCompleted(
    snapshotSessionRun(startRun('run-second')),
  );
  clock = 3_000;
  persistence.historyRepository.saveCompleted(
    snapshotSessionRun(startRun('run-third')),
  );

  const persistence2 = createLocalStorageSessionPersistence({
    storage,
    now: () => clock,
  });
  const history = persistence2.historyRepository.listCompleted();
  expect(history.map((run) => run.completedAt)).toEqual([
    3_000,
    2_000,
    1_000,
  ]);

  clock = 4_000;
  persistence2.historyRepository.saveCompleted(
    snapshotSessionRun(startRun('run-fourth')),
  );
  const persistence3 = createLocalStorageSessionPersistence({ storage });
  expect(
    persistence3.historyRepository
      .listCompleted()
      .map((run) => [run.runId, run.completedAt]),
  ).toEqual([
    ['run-fourth', 4_000],
    ['run-third', 3_000],
    ['run-second', 2_000],
    ['run-first', 1_000],
  ]);
});

test('removing a completed run keeps the other history entries intact', () => {
  const storage = memoryStorage();
  const persistence = createLocalStorageSessionPersistence({ storage });
  persistence.historyRepository.saveCompleted(
    snapshotSessionRun(startRun('run-first')),
  );
  persistence.historyRepository.saveCompleted(
    snapshotSessionRun(startRun('run-second')),
  );
  persistence.historyRepository.removeCompleted('run-first');
  const history = persistence.historyRepository.listCompleted();
  expect(history).toHaveLength(1);
  expect(history[0]?.runId).toBe('run-second');
});

test('a profile from a different profile schema version is discarded without touching unrelated keys', () => {
  const storage = memoryStorage({
    'math-modeling-game:session:profile': JSON.stringify({
      schemaVersion: 99,
      activeSession: snapshotSessionRun(startRun()),
    }),
    'other-app:data': 'keep me',
  });
  const persistence = createLocalStorageSessionPersistence({ storage });
  expect(persistence.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  expect(storage.backing.has(sessionStorageKeys.profile)).toBe(false);
  expect(storage.backing.get('other-app:data')).toBe('keep me');
});

test('storage getters that throw are acquired safely and keep the app playable', () => {
  const storage = memoryStorage({ 'other-app:data': 'keep me' });
  const original = storage.getItem;
  storage.getItem = () => {
    throw new Error('blocked');
  };
  storage.setItem = () => {
    throw new Error('quota exceeded');
  };
  storage.removeItem = () => {
    throw new Error('blocked');
  };
  void original;
  const persistence = createLocalStorageSessionPersistence({ storage });
  expect(persistence.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  expect(() =>
    persistence.profileRepository.saveProfile({
      activeSession: snapshotSessionRun(startRun()),
    }),
  ).not.toThrow();
  expect(persistence.historyRepository.listCompleted()).toEqual([]);
});

test('schema version mismatch discards only application-owned records', () => {
  const storage = memoryStorage({
    'math-modeling-game:session:profile': JSON.stringify({
      schemaVersion: 1,
      activeSession: {
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
      },
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
  const persistence = createLocalStorageSessionPersistence({ storage });
  expect(persistence.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  expect(persistence.historyRepository.listCompleted()).toEqual([]);
  expect(storage.backing.get('other-app:data')).toBe('keep me');
  expect(storage.backing.has(sessionStorageKeys.profile)).toBe(false);
});

test('planner version mismatch discards incompatible records only', () => {
  const storage = memoryStorage();
  const persistence = createLocalStorageSessionPersistence({ storage });
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(startRun()),
  });
  const rawProfile = JSON.parse(
    storage.backing.get(sessionStorageKeys.profile) ?? '{}',
  ) as { activeSession: Record<string, unknown> };
  storage.backing.set(
    sessionStorageKeys.profile,
    JSON.stringify({
      ...rawProfile,
      activeSession: {
        ...rawProfile.activeSession,
        plannerVersion: 'old-planner',
      },
    }),
  );
  const persistence2 = createLocalStorageSessionPersistence({ storage });
  expect(persistence2.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  expect(storage.backing.has(sessionStorageKeys.profile)).toBe(false);
  expect(
    storage.backing.get('other-app:data') === undefined ||
      storage.backing.get('other-app:data') === 'keep me',
  ).toBe(true);
});

test('malformed JSON in one record is ignored without touching valid records', () => {
  const storage = memoryStorage();
  const persistence = createLocalStorageSessionPersistence({ storage });
  const session = startRun();
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(session),
  });
  storage.backing.set(sessionStorageKeys.profile, '{not json');
  const persistence2 = createLocalStorageSessionPersistence({ storage });
  expect(persistence2.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  expect(storage.backing.has(sessionStorageKeys.profile)).toBe(false);
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
  const persistence = createLocalStorageSessionPersistence({
    storage: failing,
  });
  expect(persistence.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  expect(() =>
    persistence.profileRepository.saveProfile({
      activeSession: snapshotSessionRun(startRun()),
    }),
  ).not.toThrow();
  expect(persistence.historyRepository.listCompleted()).toEqual([]);
});

test('unavailable storage keeps unrelated keys untouched and returns no runs', () => {
  const storage = memoryStorage({ 'other-app:data': 'keep me' });
  const persistence = createLocalStorageSessionPersistence({
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
  expect(persistence.profileRepository.loadProfile().activeSession)
    .toBeUndefined();
  persistence.profileRepository.saveProfile({
    activeSession: snapshotSessionRun(startRun()),
  });
  expect(storage.backing.get('other-app:data')).toBe('keep me');
  expect(sessionStorageKeys.profile).toContain('math-modeling-game:');
  expect(sessionSnapshotSchemaVersion).toBeGreaterThan(0);
});
