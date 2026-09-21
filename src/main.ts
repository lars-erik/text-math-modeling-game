import { startMathModelingApplication } from './application';
import './features/navigation/ui/home-screen';
import { katexAcademicDisplayAdapter } from './features/puzzle/ui/katex-academic-display-adapter';

startMathModelingApplication({
  hash: globalThis.location.hash,
  root: document,
});

const { MathModelingPuzzle } = await import(
  './features/puzzle/ui/math-modeling-puzzle'
);

const puzzle = document.querySelector('math-modeling-puzzle');
if (puzzle instanceof MathModelingPuzzle) {
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
}
