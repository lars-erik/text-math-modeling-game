import { en } from './en';
import { nb } from './nb';
export {
  isPuzzleLocale,
  puzzleLocales,
  type PuzzleLocale,
} from '../../localization/locale';

export const puzzleResources = { en, nb } as const;
