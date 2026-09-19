import { expect, test } from 'vitest';
import { page, type ScreenshotMatcherOptions } from 'vitest/browser';

import { startMathModelingApplication } from '../../../application';
import './math-modeling-puzzle';

const fullPageScreenshotOptions = {
  fullPage: true,
} as NonNullable<ScreenshotMatcherOptions['screenshotOptions']> & {
  fullPage: boolean;
};

test('approves the wide drone-power puzzle shell', async () => {
  await page.viewport(1280, 900);
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="reference"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search: '?seed=17&scenario=gaming.drone-power',
    root: document,
  });
  window.scrollTo(0, 0);

  const puzzle = page.getByRole('main', { name: 'Story to quantities' });
  await expect.element(puzzle).toBeVisible();
  await page.screenshot({
    ...fullPageScreenshotOptions,
    path: '../../../test-results/browser/screenshots/drone-power-wide.png',
  });
  await expect(page).toMatchScreenshot('drone-power-wide', {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
    screenshotOptions: fullPageScreenshotOptions,
  });
});

test('approves the narrow Norwegian creator puzzle shell', async () => {
  await page.viewport(390, 844);
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="reference"
      locale="nb"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search: '?seed=321&scenario=creator.followers&locale=nb',
    root: document,
  });
  window.scrollTo(0, 0);

  const puzzle = page.getByRole('main', {
    name: 'Fra fortelling til størrelser',
  });
  await expect.element(puzzle).toBeVisible();
  await page.screenshot({
    ...fullPageScreenshotOptions,
    path: '../../../test-results/browser/screenshots/creator-narrow-nb.png',
  });
  await expect(page).toMatchScreenshot('creator-narrow-nb', {
    comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
    screenshotOptions: fullPageScreenshotOptions,
  });

  await page.viewport(1280, 720);
});
