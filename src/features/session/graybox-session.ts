import {
  defaultProblemFamilyId,
  generateFamilyCase,
} from '../problem-generation/problem-families';
import type {
  GuidanceEntry,
  GuidanceId,
  Problem,
} from '../problem-model/problem';
import {
  composePuzzle,
  submitPuzzle,
  type PuzzleScreen,
} from '../puzzle/compose-puzzle';
import { selectGuidanceForMode } from '../puzzle/modes';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { ModeSubmission, QuantitySelection } from '../puzzle/modes';
import type { PuzzleLocale } from '../puzzle/lang';
import type { ThemeId } from '../themes';
import { isModeId, modeIds, type ModeId } from '../puzzle/modes';
import { createNewRunId, type SessionRunId } from './session-run-id';
import {
  sessionSnapshotSchemaVersion,
  type SessionSnapshot,
  type SnapshotSubmission,
} from './persistence/session-snapshot';
import {
  planSession,
  sessionPlannerVersion,
  type SessionPlan,
} from './plan-session';

export type SessionReplay = {
  seed: number;
  plannerVersion: string;
  themeId: ThemeId;
  locale: PuzzleLocale;
};

export type SessionItemLog = {
  itemIndex: number;
  modeId: ModeId;
  submission: ModeSubmission;
  accepted: boolean;
};

export type SessionCompletionSummary = {
  total: number;
  counts: Readonly<Record<ModeId, number>>;
};

export type SessionHint = {
  guidanceId: GuidanceId;
};

export type GrayboxSession = {
  replay: SessionReplay;
  runId: SessionRunId;
  plan: SessionPlan;
  status: 'active' | 'complete';
  currentIndex: number;
  position: number;
  total: number;
  screen: PuzzleScreen | undefined;
  currentProblem: Problem | undefined;
  hint: SessionHint | undefined;
  answerLog: readonly SessionItemLog[];
  availableNext: boolean;
  summary: SessionCompletionSummary | undefined;
  submit: (answer: LearnerAnswer | QuantitySelection) => GrayboxSession;
  requestHint: () => GrayboxSession;
  next: () => GrayboxSession;
  withLocale: (locale: PuzzleLocale) => GrayboxSession;
};

export type StartSessionOptions = {
  seed: number;
  themeId: ThemeId;
  locale: PuzzleLocale;
};

export function startSession(options: StartSessionOptions): GrayboxSession {
  return startSessionRun(options, createNewRunId());
}

export function startSessionRun(
  options: StartSessionOptions,
  runId: SessionRunId,
): GrayboxSession {
  const plan = planSession({ seed: options.seed });
  return createActiveSession(
    { ...options, runId },
    plan,
    0,
    [],
    undefined,
    undefined,
  );
}

export type RestoreSessionRunResult =
  | { kind: 'restored'; session: GrayboxSession }
  | {
      kind: 'incompatible';
      reason: 'schema-version' | 'planner-version' | 'invalid-snapshot';
    };

export function snapshotSessionRun(session: GrayboxSession): SessionSnapshot {
  return {
    schemaVersion: sessionSnapshotSchemaVersion,
    plannerVersion: sessionPlannerVersion,
    runId: session.runId,
    seed: session.replay.seed,
    themeId: session.replay.themeId,
    locale: session.replay.locale,
    status: session.status,
    currentIndex: session.currentIndex,
    currentCompleted:
      session.status === 'complete' ? true : session.availableNext,
    hintGuidanceId: session.hint?.guidanceId,
    answerLog: session.answerLog.map(toSnapshotItemLog),
    updatedAt: Date.now(),
  };
}

export function restoreSessionRun(
  snapshot: SessionSnapshot,
): RestoreSessionRunResult {
  if (snapshot.schemaVersion !== sessionSnapshotSchemaVersion) {
    return { kind: 'incompatible', reason: 'schema-version' };
  }
  if (snapshot.plannerVersion !== sessionPlannerVersion) {
    return { kind: 'incompatible', reason: 'planner-version' };
  }
  const options: StartSessionOptions | undefined = toSessionOptions(snapshot);
  if (options === undefined) {
    return { kind: 'incompatible', reason: 'invalid-snapshot' };
  }
  const plan = planSession({ seed: options.seed });
  const restoredLog: SessionItemLog[] = [];
  for (const entry of snapshot.answerLog) {
    const item = plan.items[entry.itemIndex - 1];
    if (
      item === undefined ||
      item.modeId !== entry.modeId ||
      !isModeId(entry.modeId)
    ) {
      return { kind: 'incompatible', reason: 'invalid-snapshot' };
    }
    const restored = restoreSubmission(
      entry.submission,
      options,
      plan,
      entry.itemIndex - 1,
    );
    if (restored === undefined) {
      return { kind: 'incompatible', reason: 'invalid-snapshot' };
    }
    restoredLog.push({
      itemIndex: entry.itemIndex,
      modeId: entry.modeId,
      submission: restored.submission,
      accepted: restored.accepted,
    });
  }
  if (
    snapshot.status === 'active' &&
    (!Number.isSafeInteger(snapshot.currentIndex) ||
      snapshot.currentIndex < 0 ||
      snapshot.currentIndex >= plan.length)
  ) {
    return { kind: 'incompatible', reason: 'invalid-snapshot' };
  }
  const deduplicatedLog = latestAnswerPerItem(restoredLog);
  if (snapshot.status === 'complete') {
    if (!isGenuinelyComplete(deduplicatedLog, plan)) {
      return { kind: 'incompatible', reason: 'invalid-snapshot' };
    }
    return {
      kind: 'restored',
      session: createCompletedSession(
        { ...options, runId: snapshot.runId },
        plan,
        deduplicatedLog,
        undefined,
      ),
    };
  }
  if (!hasGenuineProgression(deduplicatedLog, snapshot.currentIndex)) {
    return { kind: 'incompatible', reason: 'invalid-snapshot' };
  }
  const currentItem = plan.items[snapshot.currentIndex];
  const currentLogEntry = deduplicatedLog.find(
    (entry) => entry.itemIndex === currentItem?.index,
  );
  const currentAccepted = currentLogEntry !== undefined && currentLogEntry.accepted;
  const hint =
    snapshot.hintGuidanceId === undefined
      ? undefined
      : { guidanceId: snapshot.hintGuidanceId };
  const session = createActiveSession(
    { ...options, runId: snapshot.runId },
    plan,
    snapshot.currentIndex,
    deduplicatedLog,
    restoredScreen(
      options,
      plan,
      snapshot.currentIndex,
      deduplicatedLog,
    ),
    hint,
    currentAccepted,
  );
  return { kind: 'restored', session };
}

type SessionCompositionOptions = StartSessionOptions & {
  runId: SessionRunId;
};

function toSessionOptions(
  snapshot: SessionSnapshot,
): StartSessionOptions | undefined {
  if (
    !Number.isSafeInteger(snapshot.seed) ||
    snapshot.seed < 0 ||
    snapshot.status !== 'active' &&
      snapshot.status !== 'complete'
  ) {
    return undefined;
  }
  return {
    seed: snapshot.seed,
    themeId: snapshot.themeId,
    locale: snapshot.locale,
  };
}

function toSnapshotItemLog(entry: SessionItemLog): SessionSnapshot['answerLog'][number] {
  return {
    itemIndex: entry.itemIndex,
    modeId: entry.modeId,
    accepted: entry.accepted,
    submission: snapshotSubmission(entry.submission),
  };
}

function snapshotSubmission(
  submission: ModeSubmission,
): SnapshotSubmission {
  switch (submission.kind) {
    case 'quantity-selection':
      return {
        kind: 'quantity-selection',
        knownIds: [...submission.knownIds],
        ...(submission.unknownId === undefined
          ? {}
          : { unknownId: submission.unknownId }),
      };
    case 'named-equation':
    case 'academic-notation':
      return submission.kind === 'named-equation'
        ? {
            kind: 'named-equation',
            answerKind: submission.answerKind,
            input: submission.input,
            ...(submission.choiceId === undefined
              ? {}
              : { choiceId: submission.choiceId }),
          }
        : { kind: 'academic-notation', input: submission.input };
  }
}

type RestoredSubmission = {
  submission: ModeSubmission;
  accepted: boolean;
};

function restoreSubmission(
  submission: SnapshotSubmission,
  options: StartSessionOptions,
  plan: SessionPlan,
  itemIndex: number,
): RestoredSubmission | undefined {
  const item = plan.items[itemIndex];
  if (item === undefined) {
    return undefined;
  }
  switch (submission.kind) {
    case 'quantity-selection': {
      const answer = submissionToAnswer(submission);
      if (answer === undefined) {
        return undefined;
      }
      const screen = submitPuzzle({
        problem: generateItemProblem(plan, itemIndex),
        themeId: options.themeId,
        modeId: item.modeId,
        locale: options.locale,
        storySeed: item.problemSeed,
        answer,
      });
      if (screen.submission === undefined) {
        return undefined;
      }
      return {
        submission: screen.submission,
        accepted: acceptedKinds.has(screen.feedback?.kind ?? 'none'),
      };
    }
    case 'named-equation':
    case 'academic-notation': {
      const answer = submissionToAnswer(submission);
      if (answer === undefined) {
        return undefined;
      }
      const screen = submitPuzzle({
        problem: generateItemProblem(plan, itemIndex),
        themeId: options.themeId,
        modeId: item.modeId,
        locale: options.locale,
        storySeed: item.problemSeed,
        answer,
      });
      if (screen.submission === undefined) {
        return undefined;
      }
      return {
        submission: screen.submission,
        accepted: acceptedKinds.has(screen.feedback?.kind ?? 'none'),
      };
    }
  }
}

function isGenuinelyComplete(
  log: readonly SessionItemLog[],
  plan: SessionPlan,
): boolean {
  return (
    log.length === plan.length &&
    log.every(
      (entry) =>
        entry.accepted &&
        entry.itemIndex >= 1 &&
        entry.itemIndex <= plan.length,
    )
  );
}

function hasGenuineProgression(
  log: readonly SessionItemLog[],
  currentIndex: number,
): boolean {
  for (const entry of log) {
    if (entry.itemIndex > currentIndex + 1) {
      return false;
    }
  }
  for (let itemIndex = 1; itemIndex <= currentIndex; itemIndex += 1) {
    const latest = log.find((entry) => entry.itemIndex === itemIndex);
    if (latest === undefined || !latest.accepted) {
      return false;
    }
  }
  return true;
}

function submissionToAnswer(
  submission: SnapshotSubmission,
): LearnerAnswer | QuantitySelection | undefined {
  switch (submission.kind) {
    case 'quantity-selection':
      return {
        knownIds: submission.knownIds,
        ...(submission.unknownId === undefined
          ? {}
          : { unknownId: submission.unknownId }),
      };
    case 'named-equation':
      return { kind: 'text', input: submission.input };
    case 'academic-notation':
      return { kind: 'text', input: submission.input };
  }
}

function restoredScreen(
  options: StartSessionOptions,
  plan: SessionPlan,
  currentIndex: number,
  answerLog: readonly SessionItemLog[],
): PuzzleScreen | undefined {
  const item = plan.items[currentIndex];
  if (item === undefined) {
    return undefined;
  }
  const logEntry = answerLog.find(
    (entry) => entry.itemIndex === item.index,
  );
  if (logEntry === undefined) {
    return composeItemScreen(options, plan, currentIndex);
  }
  const problem = generateItemProblem(plan, currentIndex);
  const answer = submissionToAnswer(
    snapshotSubmission(logEntry.submission),
  );
  if (answer === undefined) {
    return composeItemScreen(options, plan, currentIndex);
  }
  return submitPuzzle({
    problem,
    themeId: options.themeId,
    modeId: item.modeId,
    locale: options.locale,
    storySeed: item.problemSeed,
    answer,
  });
}

function latestAnswerPerItem(
  log: readonly SessionItemLog[],
): SessionItemLog[] {
  const latest = new Map<number, SessionItemLog>();
  for (const entry of log) {
    latest.set(entry.itemIndex, entry);
  }
  return [...latest.values()].sort(
    (left, right) => left.itemIndex - right.itemIndex,
  );
}

type InternalSessionState = {
  options: SessionCompositionOptions;
  plan: SessionPlan;
  currentIndex: number;
  answerLog: readonly SessionItemLog[];
  currentScreen: PuzzleScreen | undefined;
  currentProblem: Problem | undefined;
  hint: SessionHint | undefined;
  currentCompleted: boolean;
};

function createActiveSession(
  options: SessionCompositionOptions,
  plan: SessionPlan,
  currentIndex: number,
  answerLog: readonly SessionItemLog[],
  currentScreen: PuzzleScreen | undefined,
  hint: SessionHint | undefined,
  currentCompleted = false,
): GrayboxSession {
  const state: InternalSessionState = {
    options,
    plan,
    currentIndex,
    answerLog,
    currentScreen: currentScreen ?? composeItemScreen(options, plan, currentIndex),
    currentProblem:
      currentScreen === undefined
        ? generateItemProblem(plan, currentIndex)
        : undefined,
    hint,
    currentCompleted,
  };
  if (state.currentScreen === undefined) {
    return createCompletedSession(options, plan, answerLog, undefined);
  }
  return {
    replay: {
      seed: options.seed,
      plannerVersion: sessionPlannerVersion,
      themeId: options.themeId,
      locale: options.locale,
    },
    runId: options.runId,
    plan,
    status: 'active',
    currentIndex,
    position: currentIndex + 1,
    total: plan.length,
    screen: state.currentScreen,
    currentProblem: requireProblem(state),
    hint,
    answerLog,
    availableNext: state.currentCompleted,
    summary: undefined,
    submit(answer) {
      const submittedScreen = submitPuzzle({
        problem: requireProblem(state),
        themeId: options.themeId,
        modeId: plan.items[currentIndex].modeId,
        locale: options.locale,
        storySeed: plan.items[currentIndex].problemSeed,
        answer,
      });
      const accepted =
        acceptedKinds.has(submittedScreen.feedback?.kind ?? 'none');
      return createActiveSession(
        options,
        plan,
        currentIndex,
        upsertAnswerLog(answerLog, {
          itemIndex: plan.items[currentIndex].index,
          modeId: plan.items[currentIndex].modeId,
          submission: requireSubmission(submittedScreen),
          accepted,
        }),
        submittedScreen,
        accepted ? undefined : hint,
        accepted,
      );
    },
    requestHint() {
      const selected = selectGuidanceForMode({
        modeId: plan.items[currentIndex].modeId,
        guidance: requireProblem(state).guidance ?? [],
      });
      if (selected === undefined || hint?.guidanceId === selected.id) {
        return this;
      }
      return createActiveSession(
        options,
        plan,
        currentIndex,
        answerLog,
        state.currentScreen,
        { guidanceId: selected.id },
        currentCompleted,
      );
    },
    next() {
      if (!state.currentCompleted) {
        return this;
      }
      if (currentIndex + 1 >= plan.length) {
        return createCompletedSession(
          options,
          plan,
          answerLog,
          state.currentScreen,
        );
      }
      return createActiveSession(
        options,
        plan,
        currentIndex + 1,
        answerLog,
        undefined,
        undefined,
      );
    },
    withLocale(locale) {
      if (locale === options.locale) {
        return this;
      }
      const recomposed = createActiveSession(
        { ...options, locale },
        plan,
        currentIndex,
        answerLog,
        recomposeScreenWithLocale(
          state,
          options,
          locale,
        ),
        hint,
        state.currentCompleted,
      );
      return recomposed;
    },
  };
}

function createCompletedSession(
  options: SessionCompositionOptions,
  plan: SessionPlan,
  answerLog: readonly SessionItemLog[],
  finalScreen: PuzzleScreen | undefined,
): GrayboxSession {
  const counts = countByMode(
    answerLog.filter((entry) => entry.accepted).map((entry) => entry.modeId),
  );
  return {
    replay: {
      seed: options.seed,
      plannerVersion: sessionPlannerVersion,
      themeId: options.themeId,
      locale: options.locale,
    },
    runId: options.runId,
    plan,
    status: 'complete',
    currentIndex: plan.length - 1,
    position: plan.length,
    total: plan.length,
    screen: finalScreen,
    currentProblem: undefined,
    hint: undefined,
    answerLog,
    availableNext: false,
    summary: {
      total: answerLog.filter((entry) => entry.accepted).length,
      counts,
    },
    submit: () => {
      throw new Error('The session is complete; there is nothing to submit.');
    },
    requestHint: () => {
      throw new Error('The session is complete; there is no hint to request.');
    },
    next: () => {
      throw new Error('The session is complete; there is no next item.');
    },
    withLocale: (locale) =>
      createCompletedSession(
        { ...options, locale },
        plan,
        answerLog,
        finalScreen,
      ),
  };
}

const acceptedKinds = new Set(['accepted', 'quantity-selection-accepted']);

export function guidanceEntryForHint(
  session: GrayboxSession,
): GuidanceEntry | undefined {
  if (session.hint === undefined || session.currentProblem === undefined) {
    return undefined;
  }
  return session.currentProblem.guidance?.find(
    (entry) => entry.id === session.hint?.guidanceId,
  );
}

function upsertAnswerLog(
  answerLog: readonly SessionItemLog[],
  entry: SessionItemLog,
): readonly SessionItemLog[] {
  const existing = answerLog.findIndex(
    (candidate) => candidate.itemIndex === entry.itemIndex,
  );
  if (existing === -1) {
    return [...answerLog, entry];
  }
  return answerLog.map((candidate, index) =>
    index === existing ? entry : candidate,
  );
}

function requireSubmission(screen: PuzzleScreen): ModeSubmission {
  if (screen.submission === undefined) {
    throw new Error('A submitted session item requires a submission.');
  }
  return screen.submission;
}

function countByMode(
  modeIdList: readonly ModeId[],
): Readonly<Record<ModeId, number>> {
  const counts = {} as Record<ModeId, number>;
  for (const modeId of modeIds) {
    counts[modeId] = 0;
  }
  for (const item of modeIdList) {
    counts[item] += 1;
  }
  return counts;
}

function recomposeScreenWithLocale(
  state: InternalSessionState,
  options: StartSessionOptions,
  locale: PuzzleLocale,
): PuzzleScreen | undefined {
  const item = state.plan.items[state.currentIndex];
  if (item === undefined) {
    return undefined;
  }
  return composePuzzle({
    problem: requireProblem(state),
    themeId: options.themeId,
    modeId: item.modeId,
    locale,
    storySeed: item.problemSeed,
  });
}

function generateItemProblem(plan: SessionPlan, index: number): Problem {
  return generateFamilyCase(defaultProblemFamilyId, {
    seed: plan.items[index].problemSeed,
  }).problem;
}

function composeItemScreen(
  options: StartSessionOptions,
  plan: SessionPlan,
  index: number,
): PuzzleScreen | undefined {
  if (index >= plan.length) {
    return undefined;
  }
  return composePuzzle({
    problem: generateItemProblem(plan, index),
    themeId: options.themeId,
    modeId: plan.items[index].modeId,
    locale: options.locale,
    storySeed: plan.items[index].problemSeed,
  });
}

function requireProblem(state: InternalSessionState): Problem {
  if (state.currentProblem === undefined) {
    return generateItemProblem(state.plan, state.currentIndex);
  }
  return state.currentProblem;
}
