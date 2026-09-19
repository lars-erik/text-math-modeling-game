import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from './math-modeling-puzzle';
import './math-modeling-puzzle';

function mountPuzzle(search: string): MathModelingPuzzle {
  document.body.innerHTML = `
    <math-modeling-puzzle
      seed="17"
      skin="gaming.drone-power"
      mode="story-to-quantities"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search,
    root: document,
    replaceSearch: (next) => {
      window.history.replaceState(null, '', next);
    },
  });
  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);
  return element as MathModelingPuzzle;
}

test('switches tasks and input modes while the story stays visible and the math is identical', async () => {
  const puzzle = mountPuzzle(
    '?seed=17&scenario=gaming.drone-power&task=story-to-quantities',
  );
  await puzzle.updateComplete;

  await expect
    .element(page.getByRole('heading', { level: 1, name: 'Story to quantities' }))
    .toBeVisible();
  const story = puzzle.shadowRoot?.querySelector('div[slot="source"] p')?.textContent ?? '';
  expect(story.length).toBeGreaterThan(0);
  expect(puzzle.shadowRoot?.textContent).toContain('?');

  await userEvent.selectOptions(
    page.getByLabelText('Task'),
    'quantities-to-named-equation',
  );
  await userEvent.click(page.getByRole('button', { name: 'Show puzzle' }));
  await puzzle.updateComplete;

  await expect
    .element(
      page.getByRole('heading', {
        level: 1,
        name: 'Quantities to named equation',
      }),
    )
    .toBeVisible();
  expect(
    puzzle.shadowRoot?.querySelector('div[slot="source"] p')?.textContent,
  ).toBe(story);
  await expect.element(page.getByLabelText('Named equation')).toBeVisible();

  await userEvent.click(page.getByRole('button', { name: 'Multiple choice' }));
  await puzzle.updateComplete;
  await expect
    .element(
      page.getByText('totalPower = basePower + droneCount * dronePower'),
    )
    .toBeVisible();
  expect(
    puzzle.shadowRoot?.querySelector('div[slot="source"] p')?.textContent,
  ).toBe(story);

  await userEvent.click(
    page.getByText('totalPower = droneCount * (basePower + dronePower)'),
  );
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await puzzle.updateComplete;
  expect(puzzle.shadowRoot?.textContent).toContain(
    'The equation grouping does not match the quantity model.',
  );

  await userEvent.click(page.getByRole('button', { name: 'Text input' }));
  await puzzle.updateComplete;
  await expect.element(page.getByLabelText('Named equation')).toBeVisible();
});

test('replays the same problem from the URL state', async () => {
  const search =
    '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=en';
  const first = mountPuzzle(search);
  await first.updateComplete;
  const firstStory =
    first.shadowRoot?.querySelector('div[slot="source"] p')?.textContent ?? '';
  const firstQuantities = Array.from(
    first.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => item.textContent);

  const second = mountPuzzle(search);
  await second.updateComplete;
  expect(
    second.shadowRoot?.querySelector('div[slot="source"] p')?.textContent,
  ).toBe(firstStory);
  expect(
    Array.from(
      second.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
    ).map((item) => item.textContent),
  ).toEqual(firstQuantities);
  expect(second.shadowRoot?.textContent).toContain('67');
});
