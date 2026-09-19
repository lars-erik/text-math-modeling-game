export const puzzleLocales = ['en', 'nb'] as const;

export type PuzzleLocale = (typeof puzzleLocales)[number];

export function isPuzzleLocale(value: string): value is PuzzleLocale {
  return (puzzleLocales as readonly string[]).includes(value);
}
