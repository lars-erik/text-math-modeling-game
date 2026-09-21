import type { PuzzleLocale } from '../../puzzle/lang';
import type { ThemeId } from '../../themes';

export const sessionSnapshotSchemaVersion = 1;

export type SessionRunId = string;

export type SnapshotSubmission =
  | { kind: 'quantity-selection'; knownIds: readonly string[]; unknownId?: string }
  | {
      kind: 'named-equation';
      answerKind: 'text' | 'relation-choice';
      input: string;
      choiceId?: string;
    }
  | { kind: 'academic-notation'; input: string }
  | { kind: 'story-choice'; choiceId: string };

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


