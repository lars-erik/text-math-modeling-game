import type { LearnerNameMap } from './parse-named-relation';

export const englishLearnerNames = {
  basePower: 'base',
  droneCount: 'count',
  dronePower: 'unitValue',
  totalPower: 'total',
} as const satisfies LearnerNameMap;

export const norwegianLearnerNames = {
  droneAntall: 'count',
  droneEffekt: 'unitValue',
  grunnEffekt: 'base',
  totalEffekt: 'total',
} as const satisfies LearnerNameMap;
