import type { SessionSnapshot } from './session-snapshot';

export type UserProfile = {
  activeSession?: SessionSnapshot;
};

export type UserProfileRepository = {
  loadProfile: () => UserProfile;
  saveProfile: (profile: UserProfile) => void;
};
