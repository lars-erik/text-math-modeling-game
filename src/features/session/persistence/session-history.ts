import type { SessionSnapshot } from './session-snapshot';

export type CompletedSessionSummary = {
  runId: string;
  seed: number;
  themeId: SessionSnapshot['themeId'];
  locale: SessionSnapshot['locale'];
  total: number;
  completedAt: number;
};

export type SessionHistoryRepository = {
  listCompleted: () => readonly CompletedSessionSummary[];
  saveCompleted: (snapshot: SessionSnapshot) => void;
  removeCompleted: (runId: string) => void;
};
