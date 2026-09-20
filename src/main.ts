import { startMathModelingApplication } from './application';
import { katexAcademicDisplayAdapter } from './features/puzzle/ui/katex-academic-display-adapter';

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

const { MathModelingPuzzle } = await import(
  './features/puzzle/ui/math-modeling-puzzle'
);
const puzzle = document.querySelector('math-modeling-puzzle');
if (puzzle instanceof MathModelingPuzzle) {
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
}
