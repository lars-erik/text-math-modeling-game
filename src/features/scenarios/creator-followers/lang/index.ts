import { en } from './en';
import { nb } from './nb';

export const supportedLocales = ['en', 'nb'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const creatorFollowersResources = { en, nb } as const;
