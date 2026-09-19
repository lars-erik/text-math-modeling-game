export {
  isThemeId,
  themeIds,
  type Theme,
  type ThemeFact,
  type ThemeId,
  type ThemePresentation,
} from './theme';
export { dronePowerTheme } from './gaming-drone-power/theme';
export { creatorFollowersTheme } from './creator-followers/theme';
import type { Theme, ThemeId } from './theme';
import { dronePowerTheme } from './gaming-drone-power/theme';
import { creatorFollowersTheme } from './creator-followers/theme';

export const themes: Readonly<Record<ThemeId, Theme>> = {
  'gaming.drone-power': dronePowerTheme,
  'creator.followers': creatorFollowersTheme,
};
