import { en } from './en';
import { nb } from './nb';

export const supportedLocales = ['en', 'nb'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const dronePowerResources = { en, nb } as const;
