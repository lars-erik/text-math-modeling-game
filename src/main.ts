import { startMathModelingApplication } from './application';

startMathModelingApplication({
  search: globalThis.location.search,
  root: document,
});

await import('./features/puzzle/ui/math-modeling-puzzle');
