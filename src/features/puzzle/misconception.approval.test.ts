import { test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { composePuzzle, submitPuzzle } from './compose-puzzle';
import { printScreen } from './print-screen';
import { verifyApproval } from '../../testing/approvals';

test('approves the structured misconception transcript', () => {
  const options = {
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power' as const,
    modeId: 'quantities-to-named-equation' as const,
    locale: 'en' as const,
    storySeed: 0,
  };
  const start = composePuzzle(options);
  const submitted = submitPuzzle({
    ...options,
    answer: {
      kind: 'text',
      input: 'totalPower = droneCount * (basePower + dronePower)',
    },
  });
  verifyApproval(
    import.meta.url,
    'misconception-transcript',
    `=== Start ===\n${printScreen(start)}=== Submit ===\n${printScreen(submitted)}`,
  );
});

test('approves the academic-syntax misconception transcript with the same diagnostic', () => {
  const options = {
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power' as const,
    modeId: 'quantities-to-named-equation' as const,
    locale: 'en' as const,
    storySeed: 0,
  };
  const submitted = submitPuzzle({
    ...options,
    answer: { kind: 'text', input: 'totalPower = droneCount * (basePower + dronePower)' },
  });
  const academic = submitPuzzle({
    ...options,
    modeId: 'academic-notation-to-named-equation' as const,
    answer: { kind: 'text', input: 'totalPower = droneCount * (basePower + dronePower)' },
  });
  verifyApproval(
    import.meta.url,
    'academic-misconception-parity',
    [
      `=== Named ===\n${printScreen(submitted)}`,
      `=== Academic ===\n${printScreen(academic)}`,
    ].join(''),
  );
});
