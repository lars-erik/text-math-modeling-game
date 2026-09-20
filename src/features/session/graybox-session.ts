import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../problem-generation/generate-total-from-parts';
import type { Problem } from '../problem-model/problem';
import {
  composePuzzle,
  submitPuzzle,
  type PuzzleScreen,
} from '../puzzle/compose-puzzle';
import type { LearnerAnswer } from '../puzzle/learner-answer';
import type { ModeSubmission, QuantitySelection } from '../puzzle/modes';
import { modeIds, type ModeId } from '../puzzle/modes';
import { puzzleResources, type PuzzleLocale } from '../puzzle/lang';
import type { ThemeId } from '../themes';
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
  kind: 'structured';
  modeId: ModeId;
  content: string;
};

export type GrayboxSession = {
  replay: SessionReplay;
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
};

export type StartSessionOptions = {
  seed: number;
  themeId: ThemeId;
  locale: PuzzleLocale;
};

export function startSession(options: StartSessionOptions): GrayboxSession {
  const plan = planSession({ seed: options.seed });
  return createActiveSession(options, plan, 0, [], undefined, undefined);
}
type InternalSessionState = {
  options: StartSessionOptions;
  plan: SessionPlan;
  currentIndex: number;
  answerLog: readonly SessionItemLog[];
  currentScreen: PuzzleScreen | undefined;
  currentProblem: Problem | undefined;
  hint: SessionHint | undefined;
  currentCompleted: boolean;
};

function createActiveSession(
  options: StartSessionOptions,
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
      const content = hintText(
        plan.items[currentIndex].modeId,
        options.locale,
      );
      if (content === undefined) {
        return this;
      }
      return createActiveSession(
        options,
        plan,
        currentIndex,
        answerLog,
        state.currentScreen,
        { kind: 'structured', modeId: plan.items[currentIndex].modeId, content },
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
  };
}

function createCompletedSession(
  options: StartSessionOptions,
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
  };
}

const acceptedKinds = new Set(['accepted', 'quantity-selection-accepted']);

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

function generateItemProblem(plan: SessionPlan, index: number): Problem {
  return generateTotalFromPartsCase({
    seed: plan.items[index].problemSeed,
    config: defaultTotalFromPartsGenerationConfig,
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

function hintText(modeId: ModeId, locale: PuzzleLocale): string | undefined {
  if (modeId !== 'quantities-to-named-equation') {
    return undefined;
  }
  return puzzleResources[locale].session.hintText;
}
