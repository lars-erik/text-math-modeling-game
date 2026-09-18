import { expect, test } from 'vitest';

import { parseProblem } from './parse-problem';

const referenceDsl = `problem drone-power {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity basePower: power = 30
    quantity droneCount: item = 4
    quantity dronePower: powerPerItem = ?
    quantity totalPower: power = 210

    equation {
        totalPower = basePower + droneCount * dronePower
    }

    scenario gaming.drone-power
    symbol dronePower = p
}
`;

test('parses the complete reference problem DSL into the domain model', () => {
  expect(parseProblem(referenceDsl)).toEqual({
    kind: 'success',
    problem: {
      id: 'drone-power',
      concepts: [
        'arithmetic.addition',
        'arithmetic.multiplication',
        'algebra.variable',
        'linear.one-unknown',
      ],
      quantities: [
        {
          id: 'basePower',
          dimension: 'power',
          given: { kind: 'known', value: 30 },
        },
        {
          id: 'droneCount',
          dimension: 'item',
          given: { kind: 'known', value: 4 },
        },
        {
          id: 'dronePower',
          dimension: 'powerPerItem',
          given: { kind: 'hidden' },
        },
        {
          id: 'totalPower',
          dimension: 'power',
          given: { kind: 'known', value: 210 },
        },
      ],
      relation: {
        kind: 'equation',
        left: { kind: 'quantity', id: 'totalPower' },
        right: {
          kind: 'add',
          left: { kind: 'quantity', id: 'basePower' },
          right: {
            kind: 'multiply',
            left: { kind: 'quantity', id: 'droneCount' },
            right: { kind: 'quantity', id: 'dronePower' },
          },
        },
      },
      scenarioId: 'gaming.drone-power',
      academicSymbols: { dronePower: 'p' },
    },
  });
});
