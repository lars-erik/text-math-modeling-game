import type { PuzzleLocale } from './lang';
import type { ThemeId } from '../themes';
import { isThemeId } from '../themes';
import type { ModeId } from './modes';
import { isModeId } from './modes';

export const puzzleSelectionRequestEvent = 'puzzle-selection-request';

export type PuzzleSelectionRequest = {
  seed: number;
  themeId: ThemeId;
  modeId: ModeId;
  locale: PuzzleLocale;
};

export function isPuzzleSelectionRequest(
  value: unknown,
): value is PuzzleSelectionRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const request = value as Partial<PuzzleSelectionRequest>;
  return (
    typeof request.seed === 'number' &&
    typeof request.themeId === 'string' &&
    isThemeId(request.themeId) &&
    typeof request.modeId === 'string' &&
    isModeId(request.modeId) &&
    (request.locale === 'en' || request.locale === 'nb')
  );
}
