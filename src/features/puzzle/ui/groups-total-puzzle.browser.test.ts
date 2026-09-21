import { expect, test } from 'vitest';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from './math-modeling-puzzle';
import { katexAcademicDisplayAdapter } from './katex-academic-display-adapter';
import './math-modeling-puzzle';
import '../../navigation/ui/home-screen';

function mountPuzzle(hash: string): MathModelingPuzzle {
  document.body.innerHTML = `
    <home-screen hidden></home-screen>
    <math-modeling-puzzle
      seed="17"
      theme="gaming.drone-power"
      mode="quantities-to-named-equation"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    hash,
    root: document,
  });
  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);
  const puzzle = element as MathModelingPuzzle;
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
  return puzzle;
}

function shellText(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  return shell?.shadowRoot?.textContent ?? '';
}

function storyOf(puzzle: MathModelingPuzzle): string {
  return (
    puzzle.shadowRoot?.querySelector('div[slot="source"] p')?.textContent ??
    ''
  );
}

function quantityLines(puzzle: MathModelingPuzzle): string[] {
  return Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
}

async function submitText(puzzle: MathModelingPuzzle, value: string) {
  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;
  const input = inputComponent!.shadowRoot?.querySelector(
    'input[type="text"]',
  ) as HTMLInputElement;
  input.value = value;
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
}

test('a groups-total puzzle replays from its canonical hash and accepts a correct equation', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&family=groups-total&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await puzzle.updateComplete;

  const story = storyOf(puzzle);
  expect(story).toContain('drones draw');
  expect(story).not.toContain('basic systems');

  const quantities = quantityLines(puzzle);
  expect(quantities).toEqual([
    'droneCount = 9',
    'dronePower = ?',
    'totalPower = 63',
  ]);

  await submitText(puzzle, 'totalPower = droneCount * dronePower');
  expect(shellText(puzzle)).toContain(
    'The equation matches the quantity model.',
  );
});

test('a groups-total puzzle accepts reversed sides and rejects a wrong structure', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&family=groups-total&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await puzzle.updateComplete;

  await submitText(puzzle, 'droneCount * dronePower = totalPower');
  expect(shellText(puzzle)).toContain(
    'The equation matches the quantity model.',
  );

  await submitText(puzzle, 'totalPower = droneCount + dronePower');
  expect(shellText(puzzle)).not.toContain(
    'The equation matches the quantity model.',
  );
});

test('the groups-total family menu selection navigates through the canonical hash', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=en',
  );
  await puzzle.updateComplete;
  expect(puzzle.family).toBe('total-from-parts');
  expect(storyOf(puzzle)).toContain('basic systems');

  const menu = puzzle.shadowRoot?.querySelector('puzzle-menu');
  const familySelect = menu?.shadowRoot?.querySelector(
    'select[name="family"]',
  ) as HTMLSelectElement | null;
  expect(familySelect).not.toBeNull();
  expect(familySelect!.value).toBe('total-from-parts');
  familySelect!.value = 'groups-total';
  menu?.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 250));

  expect(globalThis.location.hash).toContain('family=groups-total');
  expect(storyOf(puzzle)).toContain('drones draw');
  expect(storyOf(puzzle)).not.toContain('basic systems');
});

test('the puzzle stays on the default family for legacy routes', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await puzzle.updateComplete;
  expect(puzzle.family).toBe('total-from-parts');
  expect(storyOf(puzzle)).toContain('basic systems');
  const quantities = quantityLines(puzzle);
  expect(quantities).toHaveLength(4);
});
