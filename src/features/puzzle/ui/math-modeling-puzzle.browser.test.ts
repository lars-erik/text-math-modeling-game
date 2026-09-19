import { expect, test } from 'vitest';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from './math-modeling-puzzle';
import './math-modeling-puzzle';

function mountPuzzle(search: string): MathModelingPuzzle {
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

function shellText(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  return shell?.shadowRoot?.textContent ?? '';
}

function storyOf(puzzle: MathModelingPuzzle): string {
  return (
    puzzle.shadowRoot?.querySelector('div[slot="source"] p')?.textContent ?? ''
  );
}

test('switches tasks and input modes while the story stays visible and the math is identical', async () => {
  const puzzle = mountPuzzle(
    '?seed=17&scenario=gaming.drone-power&task=story-to-quantities',
  );
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain('Story to quantities');
  const story = storyOf(puzzle);
  expect(story.length).toBeGreaterThan(0);
  expect(puzzle.shadowRoot?.textContent).toContain('?');

  const menu = puzzle.shadowRoot?.querySelector('puzzle-menu');
  const taskSelect = menu?.shadowRoot?.querySelector(
    'select[name="task"]',
  ) as HTMLSelectElement | null;
  expect(taskSelect).not.toBeNull();
  taskSelect!.value = 'quantities-to-named-equation';
  menu?.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(shellText(puzzle)).toContain('Quantities to named equation');
  expect(storyOf(puzzle)).toBe(story);

  const textInput = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(textInput).not.toBeNull();
  await textInput!.updateComplete;

  const multipleChoiceButton = Array.from(
    puzzle.shadowRoot?.querySelectorAll<HTMLButtonElement>('nav button') ?? [],
  ).find((button) => button.textContent?.trim() === 'Multiple choice');
  expect(multipleChoiceButton).toBeDefined();
  multipleChoiceButton!.click();
  await puzzle.updateComplete;

  expect(storyOf(puzzle)).toBe(story);
  const choiceInput = puzzle.shadowRoot?.querySelector(
    'named-equation-choice-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(choiceInput).not.toBeNull();
  await choiceInput!.updateComplete;
  const labels = Array.from(
    choiceInput!.shadowRoot?.querySelectorAll('label') ?? [],
  ).map((label) => label.textContent?.trim());
  expect(labels).toEqual([
    'totalPower = basePower + droneCount * dronePower',
    'totalPower = droneCount * (basePower + dronePower)',
  ]);

  const distractorRadio = choiceInput!.shadowRoot?.querySelector(
    'input[value="factor-into-group"]',
  ) as HTMLInputElement | null;
  expect(distractorRadio).not.toBeNull();
  distractorRadio!.checked = true;
  choiceInput!.shadowRoot?.querySelector('form')?.requestSubmit();
  await Promise.all([
    puzzle.updateComplete,
    choiceInput!.updateComplete,
    new Promise((resolve) => setTimeout(resolve, 50)),
  ]);
  await puzzle.updateComplete;
  expect(shellText(puzzle)).toContain(
    'The equation grouping does not match the quantity model.',
  );
  const checkedRadio = choiceInput!.shadowRoot?.querySelector(
    'input[value="factor-into-group"]',
  ) as HTMLInputElement | null;
  expect(checkedRadio?.checked).toBe(true);
  const textButton = Array.from(
    puzzle.shadowRoot?.querySelectorAll<HTMLButtonElement>('nav button') ?? [],
  ).find((button) => button.textContent?.trim() === 'Text input');
  expect(textButton).toBeDefined();
  textButton!.click();
  await puzzle.updateComplete;
  expect(
    puzzle.shadowRoot?.querySelector('named-equation-text-input'),
  ).not.toBeNull();
  expect(storyOf(puzzle)).toBe(story);
});

test('replays the same problem from the URL state', async () => {
  const search =
    '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=en';
  const first = mountPuzzle(search);
  await first.updateComplete;
  const firstStory = storyOf(first);
  const firstQuantities = Array.from(
    first.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => item.textContent);

  const second = mountPuzzle(search);
  await second.updateComplete;
  expect(storyOf(second)).toBe(firstStory);
  expect(
    Array.from(
      second.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
    ).map((item) => item.textContent),
  ).toEqual(firstQuantities);
  expect(second.shadowRoot?.textContent).toContain('67');
});
