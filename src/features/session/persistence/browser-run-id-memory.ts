import type { RunIdMemory } from '../session-run-store';
import type { SessionRunId } from '../session-run-id';
import type { BrowserStorageLike } from './local-storage-session-repository';

export const runIdMemoryKey = 'math-modeling-game:session:current-run-id';

export function createStorageRunIdMemory(
  storage: BrowserStorageLike | undefined,
): RunIdMemory {
  return {
    get: () => {
      try {
        return storage?.getItem(runIdMemoryKey) ?? undefined;
      } catch {
        return undefined;
      }
    },
    set: (runId: SessionRunId) => {
      try {
        storage?.setItem(runIdMemoryKey, runId);
      } catch {
        return;
      }
    },
  };
}
