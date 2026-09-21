import type { CreatorFollowersLocaleResources } from './contract';

const smallNumbers = [
  'null',
  'ett',
  'to',
  'tre',
  'fire',
  'fem',
  'seks',
  'sju',
  'åtte',
  'ni',
  'ti',
] as const;

export const nb = {
  quantities: {
    startingFollowers: {
      variableName: 'startFoelgere',
      label: 'følgere ved start',
    },
    promotedPostCount: {
      variableName: 'promoterteInnlegg',
      label: 'antall promoterte innlegg',
    },
    followersPerPost: {
      variableName: 'foelgerePerInnlegg',
      label: 'følgere per innlegg',
    },
    finalFollowers: {
      variableName: 'sluttFoelgere',
      label: 'følgere til slutt',
    },
  },
  nouns: {
    creator: { singular: 'innholdsskaper', plural: 'innholdsskapere' },
    post: { singular: 'innlegg', plural: 'innlegg' },
  },
  units: {
    followers: 'følgere',
    posts: 'innlegg',
    followersPerPost: 'følgere/innlegg',
  },
  formatNumber(value: number, _sentenceInitial: boolean) {
    return smallNumbers[value] ?? String(value);
  },
  fragments: {
    baseFact: {
      startingAudience: ({ noun, value, unit }) =>
        `En ${noun} starter med ${value} ${unit}.`,
    },
    countFact: {
      promotedPosts: ({ count, noun }) =>
        `${count.charAt(0).toUpperCase()}${count.slice(1)} promoterte ${noun} gir like mange nye følgere hver.`,
    },
    totalFact: {
      finalAudience: ({ value, unit }) =>
        `Innholdsskaperen ender med ${value} ${unit}.`,
      postGains: ({ value, unit }) =>
        `Innleggene gir til sammen ${value} nye ${unit}.`,
    },
    question: {
      followersPerPost: ({ noun }) =>
        `Hvor mange følgere gir hvert ${noun}?`,
    },
  },
} satisfies CreatorFollowersLocaleResources;
