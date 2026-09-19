import type { PuzzleLocale } from './lang';
import type { SkinId } from '../skins';
import { isSkinId } from '../skins';
import type { ModeId } from './modes';
import { isModeId } from './modes';

export const puzzleSelectionRequestEvent = 'puzzle-selection-request';

export type PuzzleSelectionRequest = {
  seed: number;
  skinId: SkinId;
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
    typeof request.skinId === 'string' &&
    isSkinId(request.skinId) &&
    typeof request.modeId === 'string' &&
    isModeId(request.modeId) &&
    (request.locale === 'en' || request.locale === 'nb')
  );
}
