import { test } from 'vitest';
import { verifyApproval } from '../../testing/approvals';
import {
  printSessionTranscript,
  type TranscriptStep,
} from './print-session-transcript';
import { startSession } from './graybox-session';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { QuantitySelection } from '../puzzle/modes';
import { formatAcademicInput } from '../representations/academic-relation';
import type { GrayboxSession } from './graybox-session';

const sessionSeed = 918273;

function correctAnswerFor(session: GrayboxSession):
  | LearnerAnswer
  | QuantitySelection {
  const task = session.screen?.screen;
  if (task === undefined) {
    throw new Error('The session has no active puzzle screen.');
  }
  switch (task.modeId) {
    case 'story-to-quantities':
      return {
        knownIds: ['base', 'count', 'total'],
        unknownId: 'unitValue',
      };
    case 'quantities-to-named-equation':
    case 'academic-notation-to-named-equation':
      return { kind: 'text', input: canonicalNamedEquation(session) };
    case 'named-equation-to-academic-notation':
      return {
        kind: 'text',
        input: formatAcademicInput(
          task.source.relation,
          task.target.symbols,
        ),
      };
  }
}

function canonicalNamedEquation(session: GrayboxSession): string {
  const quantities = session.screen?.context.quantities ?? [];
  const names = Object.fromEntries(
    quantities.map((quantity) => [quantity.role, quantity.variableName]),
  );
  return `${names.total} = ${names.base} + ${names.count} * ${names['per-item']}`;
}

function seekToMode(
  session: GrayboxSession,
  modeId: 'quantities-to-named-equation',
): GrayboxSession {
  let current = session;
  while (current.plan.items[current.currentIndex].modeId !== modeId) {
    current = current.submit(correctAnswerFor(current)).next();
  }
  return current;
}

test('approves a graybox session transcript with wrong answers, a misconception, a correction, and a hint', () => {
  const steps: TranscriptStep[] = [];
  const session = seekToMode(
    startSession({
      seed: sessionSeed,
      themeId: 'gaming.drone-power',
      locale: 'en',
    }),
    'quantities-to-named-equation',
  );

  const wrong = session.submit({ kind: 'text', input: 'wrong = wrong' });
  steps.push({ session, submitted: wrong, advanced: undefined });
  expectRejection(wrong);

  const misconception = wrong.submit({
    kind: 'text',
    input: 'totalPower = droneCount * (basePower + dronePower)',
  });
  steps.push({ session: wrong, submitted: misconception, advanced: undefined });
  expectRejection(misconception);

  const hinted = misconception.requestHint();
  const corrected = hinted.submit({ kind: 'text', input: 'totalPower = basePower + droneCount * dronePower' });
  steps.push({
    session: hinted,
    submitted: corrected,
    advanced: undefined,
  });

  let current = corrected;
  while (current.status === 'active') {
    const submitted = current.submit(correctAnswerFor(current));
    if (!submitted.availableNext) {
      steps.push({ session: current, submitted, advanced: undefined });
      break;
    }
    const advanced = submitted.next();
    steps.push({ session: current, submitted, advanced });
    if (advanced.status === 'complete') {
      current = advanced;
      break;
    }
    current = advanced;
  }

  verifyApproval(
    import.meta.url,
    'graybox-session-recovery-transcript',
    printSessionTranscript({ steps, summary: current }),
  );
});

function expectRejection(step: GrayboxSession): void {
  if (step.screen?.feedback?.kind === 'accepted') {
    throw new Error('Expected the wrong-answer path to be rejected.');
  }
}
