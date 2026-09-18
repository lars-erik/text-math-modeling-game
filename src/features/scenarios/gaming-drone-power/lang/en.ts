import type { ScenarioLocaleResources } from './contract';

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
    basePower: { variableName: 'basePower', label: 'base power' },
    droneCount: { variableName: 'droneCount', label: 'number of drones' },
    dronePower: { variableName: 'dronePower', label: 'power per drone' },
    totalPower: { variableName: 'totalPower', label: 'total power' },
  },
  nouns: {
    ship: { singular: 'ship', plural: 'ships' },
    drone: { singular: 'drone', plural: 'drones' },
  },
  units: {
    count: 'drones',
    power: 'MW',
    powerPerDrone: 'MW/drone',
  },
  formatNumber(value: number, sentenceInitial: boolean) {
    const formatted = smallNumbers[value] ?? String(value);
    return sentenceInitial
      ? `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}`
      : formatted;
  },
  fragments: {
    baseFact: {
      basicSystems: ({ noun, value, unit }) =>
        `A ${noun} uses ${value} ${unit} for basic systems.`,
    },
    countFact: {
      activeDrones: ({ count, noun, isSingular }) =>
        `${count} identical ${noun} ${isSingular ? 'is' : 'are'} active.`,
    },
    totalFact: {
      combinedDraw: ({ value, unit }) =>
        `Together they draw ${value} ${unit}.`,
    },
    question: {
      perDronePower: ({ noun }) =>
        `How much power does one ${noun} draw?`,
    },
  },
} satisfies ScenarioLocaleResources;
