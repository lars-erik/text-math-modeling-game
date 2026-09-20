import type { GrayboxSession } from './graybox-session';
import type { SessionPlan } from './plan-session';

export type TranscriptStep = {
  session: GrayboxSession;
  submitted: GrayboxSession;
  advanced: GrayboxSession | undefined;
};

export type SessionTranscript = {
  steps: readonly TranscriptStep[];
  summary: GrayboxSession;
};

export function printSessionTranscript(transcript: SessionTranscript): string {
  const lines: string[] = [];
  const first = transcript.steps[0];
  if (first === undefined) {
    throw new Error('A session transcript requires at least one step.');
  }
  lines.push(
    `session seed=${first.session.replay.seed} planner=${first.session.replay.plannerVersion} theme=${first.session.replay.themeId} locale=${first.session.replay.locale}`,
  );
  lines.push(...printPlan(first.session.plan));
  for (const step of transcript.steps) {
    lines.push(...printStep(step));
  }
  lines.push(...printSummary(transcript.summary));
  return `${lines.join('\n')}\n`;
}

function printPlan(plan: SessionPlan): string[] {
  return [
    `plan length=${plan.length}`,
    ...plan.items.map(
      (item) =>
        `  item ${item.index}/${plan.length} problem-seed=${item.problemSeed} mode=${item.modeId}`,
    ),
  ];
}

function printStep(step: TranscriptStep): string[] {
  const session = step.session;
  const submitted = step.submitted;
  const screen = session.screen;
  if (screen === undefined) {
    throw new Error('An active session step requires a puzzle screen.');
  }
  const lines = [
    `item ${session.position}/${session.total}`,
    `mode ${screen.screen.modeId} edge ${screen.screen.source.kind} -> ${screen.screen.target.kind}`,
    `problem ${screen.context.replay?.seed} generator=${screen.context.replay?.generatorVersion}`,
    `submit ${describeSubmission(submitted)}`,
    `result ${describeResult(submitted)}`,
    `transition ${describeTransition(step)}`,
  ];
  if (submitted.hint !== undefined) {
    lines.push(`hint ${submitted.hint.modeId}: ${submitted.hint.content}`);
  }
  return lines;
}

function describeSubmission(submitted: GrayboxSession): string {
  const submission = submitted.screen?.submission;
  if (submission === undefined) {
    return 'none';
  }
  switch (submission.kind) {
    case 'quantity-selection':
      return `quantity-selection known=[${submission.knownIds.join(', ')}] unknown=${submission.unknownId ?? 'none'}`;
    case 'named-equation':
      return `named-equation ${JSON.stringify(submission.input)}`;
    case 'academic-notation':
      return `academic-notation ${JSON.stringify(submission.input)}`;
  }
}

function describeResult(submitted: GrayboxSession): string {
  const feedback = submitted.screen?.feedback;
  if (feedback === undefined) {
    return 'none';
  }
  const suffix = feedback.message === undefined ? '' : `: ${feedback.message}`;
  return `${feedback.kind}${suffix}`;
}

function describeTransition(step: TranscriptStep): string {
  const advanced = step.advanced;
  if (advanced === undefined) {
    return 'stayed-on-item';
  }
  if (advanced.status === 'complete') {
    return 'completed-session';
  }
  return 'item-completed';
}

function printSummary(session: GrayboxSession): string[] {
  const summary = session.summary;
  if (summary === undefined) {
    throw new Error('The session summary requires a completed session.');
  }
  return [
    'session complete',
    `completed ${summary.total}`,
    ...Object.entries(summary.counts).map(
      ([modeId, count]) => `  ${modeId}: ${count}`,
    ),
  ];
}
