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
import type { QuantitySelection } from '../puzzle/modes';
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

export type CompletedSessionItem = {
  index: number;
  modeId: ModeId;
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
  hint: SessionHint | undefined;
  completedItems: readonly CompletedSessionItem[];
  completedCounts: Readonly<Record<ModeId, number>>;
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
  completedItems: readonly CompletedSessionItem[];
  currentScreen: PuzzleScreen | undefined;
  currentProblem: Problem | undefined;
  hint: SessionHint | undefined;
  currentCompleted: boolean;
};

function createActiveSession(
  options: StartSessionOptions,
  plan: SessionPlan,
  currentIndex: number,
  completedItems: readonly CompletedSessionItem[],
  currentScreen: PuzzleScreen | undefined,
  hint: SessionHint | undefined,
  currentCompleted = false,
): GrayboxSession {
  const state: InternalSessionState = {
    options,
    plan,
    currentIndex,
    completedItems,
    currentScreen: currentScreen ?? composeItemScreen(options, plan, currentIndex),
    currentProblem:
      currentScreen === undefined
        ? generateItemProblem(plan, currentIndex)
        : undefined,
    hint,
    currentCompleted,
  };
  if (state.currentScreen === undefined) {
    return createCompletedSession(options, plan, completedItems, undefined);
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
    hint,
    completedItems,
    completedCounts: countByMode(completedItems),
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
      const nextCompletedItems = accepted
        ? [
            ...completedItems,
            {
              index: plan.items[currentIndex].index,
              modeId: plan.items[currentIndex].modeId,
            },
          ]
        : completedItems;
      const sessionComplete = accepted && currentIndex + 1 === plan.length;
      if (sessionComplete) {
        return createCompletedSession(
          options,
          plan,
          nextCompletedItems,
          submittedScreen,
        );
      }
      return createActiveSession(
        options,
        plan,
        currentIndex,
        nextCompletedItems,
        submittedScreen,
        hint,
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
        completedItems,
        state.currentScreen,
        { kind: 'structured', modeId: plan.items[currentIndex].modeId, content },
        currentCompleted,
      );
    },
    next() {
      if (!state.currentCompleted || currentIndex + 1 >= plan.length) {
        return this;
      }
      return createActiveSession(
        options,
        plan,
        currentIndex + 1,
        completedItems,
        undefined,
        undefined,
      );
    },
  };
}

function createCompletedSession(
  options: StartSessionOptions,
  plan: SessionPlan,
  completedItems: readonly CompletedSessionItem[],
  finalScreen: PuzzleScreen | undefined,
): GrayboxSession {
  const counts = countByMode(completedItems);
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
    hint: undefined,
    completedItems,
    completedCounts: counts,
    availableNext: false,
    summary: { total: completedItems.length, counts },
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

function countByMode(
  completedItems: readonly CompletedSessionItem[],
): Readonly<Record<ModeId, number>> {
  const counts = {} as Record<ModeId, number>;
  for (const modeId of modeIds) {
    counts[modeId] = 0;
  }
  for (const item of completedItems) {
    counts[item.modeId] += 1;
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
