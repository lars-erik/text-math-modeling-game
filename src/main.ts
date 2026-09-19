import { startMathModelingApplication } from './application';

startMathModelingApplication({
  search: globalThis.location.search,
  root: document,
  replaceSearch: (search) => {
    globalThis.history.replaceState(
      null,
      '',
      `${globalThis.location.pathname}${search}${globalThis.location.hash}`,
    );
  },
});

await import('./features/puzzle/ui/math-modeling-puzzle');
