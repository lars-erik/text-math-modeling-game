import { test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import {
  formatAcademicInput,
  renderToString,
} from '../representations/academic-relation';
import { createAcademicSymbolMap } from '../representations/academic-symbol-map';
import { formatNamedRelation } from '../representations/named-relation';
import { substituteVisibleValues } from '../representations/substitute-visible-values';
import { verifyApproval } from '../../testing/approvals';
import { composePuzzle, presentTheme, submitPuzzle } from './compose-puzzle';
import { printScreen } from './print-screen';

test('approves the substituted named and academic representations', () => {
  const relation = substituteVisibleValues(totalFromPartsProblem);
  const presentation = presentTheme(
    'gaming.drone-power',
    totalFromPartsProblem,
    'en',
    0,
  );
  const names = Object.fromEntries(
    presentation.facts.map((fact) => [fact.canonicalId, fact.variableName]),
  );
  const symbols = createAcademicSymbolMap(totalFromPartsProblem);

  verifyApproval(
    import.meta.url,
    'academic-representations',
    [
      `named: ${formatNamedRelation(relation, names)}`,
      `academic-input: ${formatAcademicInput(relation, symbols)}`,
      `academic-display: ${renderToString(relation, symbols)}`,
      '',
    ].join('\n'),
  );
});

test('approves the forward academic-notation puzzle transcript', () => {
  const options = {
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power' as const,
    modeId: 'named-equation-to-academic-notation' as const,
    locale: 'en' as const,
    storySeed: 0,
  };
  const start = composePuzzle(options);
  const submitted = submitPuzzle({
    ...options,
    answer: { kind: 'text', input: '210 = 30 + 4*p' },
  });
  verifyApproval(
    import.meta.url,
    'named-to-academic-transcript',
    `=== Start ===\n${printScreen(start)}=== Submit ===\n${printScreen(submitted)}`,
  );
});

test('approves the reverse named-equation puzzle transcript', () => {
  const options = {
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power' as const,
    modeId: 'academic-notation-to-named-equation' as const,
    locale: 'en' as const,
    storySeed: 0,
  };
  const start = composePuzzle(options);
  const submitted = submitPuzzle({
    ...options,
    answer: {
      kind: 'text',
      input: 'totalPower = basePower + droneCount * dronePower',
    },
  });
  verifyApproval(
    import.meta.url,
    'academic-to-named-transcript',
    `=== Start ===\n${printScreen(start)}=== Submit ===\n${printScreen(submitted)}`,
  );
});
