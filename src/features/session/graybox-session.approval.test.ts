import { test } from 'vitest';
import { verifyApproval } from '../../testing/approvals';
import { printSessionTranscript, type TranscriptStep } from './print-session-transcript';
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

test('approves a full fixed-seed graybox session transcript', () => {
  const steps: TranscriptStep[] = [];
  let session = startSession({
    seed: sessionSeed,
    themeId: 'gaming.drone-power',
    locale: 'en',
  });
  while (session.status === 'active') {
    const submitted = session.submit(correctAnswerFor(session));
    steps.push({ session, submitted });
    if (submitted.status === 'complete') {
      session = submitted;
      break;
    }
    session = submitted.next();
  }
  verifyApproval(
    import.meta.url,
    'graybox-session-transcript',
    printSessionTranscript({
      steps,
      summary: session,
    }),
  );
});
