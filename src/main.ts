import { startMathModelingApplication } from './application';
import './features/navigation/ui/home-screen';
import { katexAcademicDisplayAdapter } from './features/puzzle/ui/katex-academic-display-adapter';
import {
  createLocalStorageSessionPersistence,
  type BrowserStorageLike,
} from './features/session/persistence/local-storage-session-repository';
import { createStorageRunIdMemory } from './features/session/persistence/browser-run-id-memory';
import { createSessionRunStore } from './features/session/session-run-store';

// comment to trigger build - delete this line

function safeStorage(name: 'localStorage' | 'sessionStorage'): BrowserStorageLike | undefined {
  try {
    const storage = (globalThis as Record<string, unknown>)[name];
    if (
      typeof storage === 'object' &&
      storage !== null &&
      typeof (storage as BrowserStorageLike).getItem === 'function'
    ) {
      return storage as BrowserStorageLike;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

startMathModelingApplication({
  hash: globalThis.location.hash,
  root: document,
  sessionRunStore: createSessionRunStore({
    ...createLocalStorageSessionPersistence({
      storage: safeStorage('localStorage'),
    }),
    runIdMemory: createStorageRunIdMemory(safeStorage('sessionStorage')),
  }),
});

const { MathModelingPuzzle } = await import(
  './features/puzzle/ui/math-modeling-puzzle'
);
const puzzle = document.querySelector('math-modeling-puzzle');
if (puzzle instanceof MathModelingPuzzle) {
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
}
