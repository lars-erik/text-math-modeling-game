export const navigateHomeRequestEvent = 'navigate-home-request';

export type NavigateHomeRequest = {
  reason?: string;
};

export const navigatePuzzleRequestEvent = 'navigate-puzzle-request';

export type NavigatePuzzleRequest = {
  seed?: number;
  themeId?: string;
  modeId?: string;
};

export const navigateSessionRequestEvent = 'navigate-session-request';

export type NavigateSessionRequest = {
  seed?: number;
  themeId?: string;
};
