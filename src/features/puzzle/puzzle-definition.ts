export const puzzleTasks = [
  'story-to-quantities',
  'quantities-to-named-equation',
] as const;

export type PuzzleTask = (typeof puzzleTasks)[number];

export function isPuzzleTask(value: string): value is PuzzleTask {
  return puzzleTasks.some((task) => task === value);
}
