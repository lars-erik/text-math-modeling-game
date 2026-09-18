export type QuantityResource = {
  variableName: string;
  label: string;
};

export type NounForms = {
  singular: string;
  plural: string;
};

export type ScenarioLocaleResources = {
  quantities: {
    basePower: QuantityResource;
    droneCount: QuantityResource;
    dronePower: QuantityResource;
    totalPower: QuantityResource;
  };
  nouns: {
    ship: NounForms;
    drone: NounForms;
  };
  units: {
    count: string;
    power: string;
    powerPerDrone: string;
  };
  formatNumber: (value: number, sentenceInitial: boolean) => string;
  fragments: {
    baseFact: {
      basicSystems: (values: {
        noun: string;
        value: string;
        unit: string;
      }) => string;
    };
    countFact: {
      activeDrones: (values: { count: string; noun: string }) => string;
    };
    totalFact: {
      combinedDraw: (values: { value: string; unit: string }) => string;
    };
    question: {
      perDronePower: (values: { noun: string }) => string;
    };
  };
};
