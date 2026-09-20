import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from './math-modeling-puzzle';
import { katexAcademicDisplayAdapter } from './katex-academic-display-adapter';
import './math-modeling-puzzle';

test('approves the wide drone-power puzzle shell', async () => {
  await page.viewport(1280, 900);
  document.body.innerHTML = `
    <math-modeling-puzzle
      seed="17"
      theme="gaming.drone-power"
      mode="story-to-quantities"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search: '?seed=17&scenario=gaming.drone-power',
    root: document,
  });
  window.scrollTo(0, 0);
  const puzzle = page.getByRole('main');
  await expect.element(puzzle).toBeVisible();
  await expect(page).toMatchScreenshot('drone-power-wide', {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.02 },
    screenshotOptions: { fullPage: true },
  });
});

test('approves the narrow Norwegian creator puzzle shell', async () => {
  await page.viewport(390, 844);
  document.body.innerHTML = `
    <math-modeling-puzzle
      seed="321"
      theme="creator.followers"
      mode="quantities-to-named-equation"
      locale="nb"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search:
      '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=nb',
    root: document,
  });
  window.scrollTo(0, 0);
  const puzzle = page.getByRole('main');
  await expect.element(puzzle).toBeVisible();
  await expect(page).toMatchScreenshot('creator-narrow-nb', {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.02 },
    screenshotOptions: { fullPage: true },
  });
});

test('approves academic notation rendered with the pluggable KaTeX adapter', async () => {
  await page.viewport(1100, 900);
  document.body.innerHTML = `
    <math-modeling-puzzle
      seed="321"
      theme="creator.followers"
      mode="academic-notation-to-named-equation"
      locale="nb"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search:
      '?seed=321&scenario=creator.followers&task=academic-notation-to-named-equation&locale=nb',
    root: document,
  });
  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);
  const puzzleElement = element as MathModelingPuzzle;
  puzzleElement.academicDisplayAdapter = katexAcademicDisplayAdapter;
  await puzzleElement.updateComplete;
  window.scrollTo(0, 0);
  const puzzle = page.getByRole('main');
  await expect.element(puzzle).toBeVisible();
  await expect.element(page.getByLabelText('67 = 25 + 6p')).toBeVisible();
  await expect(page).toMatchScreenshot('academic-notation-creator-nb', {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.02 },
    screenshotOptions: { fullPage: true },
  });
});