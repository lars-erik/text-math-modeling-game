import type { ScenarioLocaleResources } from './contract';

const smallNumbers = [
  'null',
  'én',
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
    basePower: { variableName: 'grunnEffekt', label: 'grunnleggende effekt' },
    droneCount: { variableName: 'droneAntall', label: 'antall droner' },
    dronePower: { variableName: 'droneEffekt', label: 'effekt per drone' },
    totalPower: { variableName: 'totalEffekt', label: 'samlet effekt' },
  },
  nouns: {
    ship: { singular: 'skip', plural: 'skip' },
    drone: { singular: 'drone', plural: 'droner' },
  },
  units: {
    count: 'droner',
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
        `Et ${noun} bruker ${value} ${unit} til grunnleggende systemer.`,
    },
    countFact: {
      activeDrones: ({ count, noun }) =>
        `${count} identiske ${noun} er aktive.`,
    },
    totalFact: {
      combinedDraw: ({ value, unit }) =>
        `Til sammen trekker de ${value} ${unit}.`,
    },
    question: {
      perDronePower: ({ noun }) =>
        `Hvor mye effekt trekker én ${noun}?`,
    },
  },
} satisfies ScenarioLocaleResources;
