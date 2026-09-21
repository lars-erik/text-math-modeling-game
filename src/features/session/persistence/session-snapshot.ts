import type { PuzzleLocale } from '../../puzzle/lang';
import type { ThemeId } from '../../themes';
import type { ModeSubmission } from '../../puzzle/modes';
import type { SessionItemLog } from '../graybox-session';

export const sessionSnapshotSchemaVersion = 1;

export type SessionRunId = string;

export type SnapshotSubmission =
  | { kind: 'quantity-selection'; knownIds: readonly string[]; unknownId?: string }
  | {
      kind: 'named-equation';
      answerKind: 'text' | 'relation-choice';
      input: string;
      choiceId?: string;
      problemDsl: string;
    }
  | { kind: 'academic-notation'; input: string; problemDsl: string };

export type SnapshotItemLog = {
  itemIndex: number;
  modeId: string;
  submission: SnapshotSubmission;
  accepted: boolean;
};

export type SessionSnapshot = {
  schemaVersion: number;
  plannerVersion: string;
  runId: SessionRunId;
  seed: number;
  themeId: ThemeId;
  locale: PuzzleLocale;
  status: 'active' | 'complete';
  currentIndex: number;
  currentCompleted: boolean;
  hintGuidanceId: string | undefined;
  answerLog: readonly SnapshotItemLog[];
  updatedAt: number;
};

export type StoredSessionSnapshot = {
  runId: SessionRunId;
  snapshot: SessionSnapshot;
};

export type CompletedSessionSummaryView = {
  runId: SessionRunId;
  seed: number;
  themeId: ThemeId;
  locale: PuzzleLocale;
  total: number;
  completedAt: number;
};

export type SessionRepository = {
  loadActiveRun: () => StoredSessionSnapshot | undefined;
  saveActiveRun: (snapshot: SessionSnapshot) => SessionRunId;
  listCompletedRuns: () => readonly CompletedSessionSummaryView[];
  saveCompletedRun: (snapshot: SessionSnapshot) => SessionRunId;
  discardRun: (runId: SessionRunId) => void;
};

export function createNewRunId(): SessionRunId {
  const random =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `run-${random}`;
}

export function snapshotFromItemLog(
  entry: SessionItemLog,
): SnapshotItemLog {
  return {
    itemIndex: entry.itemIndex,
    modeId: entry.modeId,
    submission: snapshotSubmissionFromSubmission(entry.submission),
    accepted: entry.accepted,
  };
}

export function snapshotSubmissionFromSubmission(
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
      return {
        kind: 'named-equation',
        answerKind: submission.answerKind,
        input: submission.input,
        ...(submission.choiceId === undefined
          ? {}
          : { choiceId: submission.choiceId }),
        problemDsl: '',
      };
    case 'academic-notation':
      return {
        kind: 'academic-notation',
        input: submission.input,
        problemDsl: '',
      };
  }
}
