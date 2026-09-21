export type HomeSessionRunsView = {
  activeRun: { seed: number; position: number; total: number } | undefined;
  completedRuns: readonly {
    runId: string;
    seed: number;
    total: number;
  }[];
};

export function emptySessionRunsView(): HomeSessionRunsView {
  return { activeRun: undefined, completedRuns: [] };
}
