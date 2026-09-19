import { en } from './en';
import { nb } from './nb';

export type PuzzleLocale = 'en' | 'nb';
export const puzzleResources = { en, nb } as const;

export function isPuzzleLocale(value: string): value is PuzzleLocale {
  return value === 'en' || value === 'nb';
}
