import type { CreatorFollowersLocaleResources } from './contract';

const smallNumbers = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
] as const;

export const en = {
  quantities: {
    startingFollowers: {
      variableName: 'startingFollowers',
      label: 'starting followers',
    },
    promotedPostCount: {
      variableName: 'promotedPostCount',
      label: 'number of promoted posts',
    },
    followersPerPost: {
      variableName: 'followersPerPost',
      label: 'followers per post',
    },
    finalFollowers: {
      variableName: 'finalFollowers',
      label: 'final followers',
    },
  },
  nouns: {
    creator: { singular: 'creator', plural: 'creators' },
    post: { singular: 'post', plural: 'posts' },
  },
  units: {
    followers: 'followers',
    posts: 'posts',
    followersPerPost: 'followers/post',
  },
  formatNumber(value: number, _sentenceInitial: boolean) {
    return smallNumbers[value] ?? String(value);
  },
  fragments: {
    baseFact: {
      startingAudience: ({ noun, value, unit }) =>
        `A ${noun} starts with ${value} ${unit}.`,
    },
    countFact: {
      promotedPosts: ({ count, noun }) =>
        `Each of ${count} promoted ${noun} gains the same number of followers.`,
    },
    totalFact: {
      finalAudience: ({ value, unit }) =>
        `The creator finishes with ${value} ${unit}.`,
      postGains: ({ value, unit }) =>
        `The posts bring in ${value} new ${unit} in total.`,
    },
    question: {
      followersPerPost: ({ noun }) =>
        `How many followers does each ${noun} gain?`,
      startingFollowers: ({ noun }) =>
        `How many followers does the ${noun} start with?`,
      promotedPostCount: ({ noun }) =>
        `How many promoted ${noun} are there?`,
      finalFollowers: ({ noun }) =>
        `How many followers does the ${noun} finish with?`,
    },
  },
} satisfies CreatorFollowersLocaleResources;
