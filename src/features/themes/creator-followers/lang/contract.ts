export type QuantityResource = {
  variableName: string;
  label: string;
};

export type NounForms = {
  singular: string;
  plural: string;
};

export type CreatorFollowersLocaleResources = {
  quantities: {
    startingFollowers: QuantityResource;
    promotedPostCount: QuantityResource;
    followersPerPost: QuantityResource;
    finalFollowers: QuantityResource;
  };
  nouns: {
    creator: NounForms;
    post: NounForms;
  };
  units: {
    followers: string;
    posts: string;
    followersPerPost: string;
  };
  formatNumber: (value: number, sentenceInitial: boolean) => string;
  fragments: {
    baseFact: {
      startingAudience: (values: {
        noun: string;
        value: string;
        unit: string;
      }) => string;
    };
    countFact: {
      promotedPosts: (values: { count: string; noun: string }) => string;
    };
    perItemFact: {
      followersPerPost: (values: { value: string; unit: string }) => string;
    };
    totalFact: {
      finalAudience: (values: { value: string; unit: string }) => string;
      postGains: (values: { value: string; unit: string }) => string;
    };
    question: {
      followersPerPost: (values: { noun: string }) => string;
      startingFollowers: (values: { noun: string }) => string;
      promotedPostCount: (values: { noun: string }) => string;
      finalFollowers: (values: { noun: string }) => string;
      totalPostGains: (values: { noun: string }) => string;
    };
  };
};
