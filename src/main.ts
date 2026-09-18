import { referencePuzzle } from './features/puzzle/reference-puzzle';

globalThis.mathModelingPuzzles = {
  reference: referencePuzzle,
};

await import('./features/puzzle/ui/math-modeling-puzzle');
