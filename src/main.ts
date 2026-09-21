import { startMathModelingApplication } from './application';
import './features/navigation/ui/home-screen';
import { katexAcademicDisplayAdapter } from './features/puzzle/ui/katex-academic-display-adapter';
import {
  createLocalStorageSessionRepository,
} from './features/session/persistence/local-storage-session-repository';
import { createStorageRunIdMemory } from './features/session/persistence/browser-run-id-memory';
import { createSessionRunStore } from './features/session/session-run-store';

startMathModelingApplication({
  hash: globalThis.location.hash,
  root: document,
  sessionRunStore: createSessionRunStore({
    repository: createLocalStorageSessionRepository({
      storage: globalThis.localStorage,
    }),
    runIdMemory: createStorageRunIdMemory(globalThis.sessionStorage),
  }),
});

const { MathModelingPuzzle } = await import(
  './features/puzzle/ui/math-modeling-puzzle'
);

const puzzle = document.querySelector('math-modeling-puzzle');
if (puzzle instanceof MathModelingPuzzle) {
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
}
