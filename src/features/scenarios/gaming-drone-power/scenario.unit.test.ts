import { expect, test } from 'vitest';

import {
  totalFromPartsAnswerKey,
  totalFromPartsProblem,
} from '../../problem-model/total-from-parts.fixture';
import {
  bindDronePowerAnswerKey,
  bindDronePowerScenario,
  planDronePowerStory,
} from './scenario';

test('binds the visible base fact to canonical drone-power semantics', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);

  expect(binding.facts[0]).toEqual({
    id: 'basePower',
    sourceId: 'base',
    role: 'base',
    visibility: 'known',
    value: 30,
    dimension: 'power',
    unitKey: 'power',
  });
});

test('binds every shape role while keeping the hidden value out of the ledger', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);

  expect(binding.facts).toEqual([
    expect.objectContaining({ id: 'basePower' }),
    {
      id: 'droneCount',
      sourceId: 'count',
      role: 'count',
      visibility: 'known',
      value: 4,
      dimension: 'item',
      unitKey: 'count',
    },
    {
      id: 'dronePower',
      sourceId: 'unitValue',
      role: 'unitValue',
      visibility: 'hidden',
      dimension: 'powerPerItem',
      unitKey: 'powerPerDrone',
    },
    {
      id: 'totalPower',
      sourceId: 'total',
      role: 'total',
      visibility: 'known',
      value: 210,
      dimension: 'power',
      unitKey: 'power',
    },
  ]);
});

test('plans the story with locale-independent semantic keys and fact references', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);

  expect(planDronePowerStory(binding, 17)).toEqual({
    scenarioId: 'gaming.drone-power',
    seed: 17,
    sentences: [
      { fragmentKey: 'baseFact.basicSystems', factId: 'basePower', nounKey: 'ship' },
      { fragmentKey: 'countFact.activeDrones', factId: 'droneCount', nounKey: 'drone' },
      { fragmentKey: 'totalFact.combinedDraw', factId: 'totalPower' },
    ],
    question: {
      fragmentKey: 'question.perDronePower',
      factId: 'dronePower',
      nounKey: 'drone',
    },
  });
});

test('scenario binding preserves equation structure with canonical power quantity IDs', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);

  expect(binding.problem.relation).toEqual({
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
  });
  expect(binding.problem.quantities.map(({ id, dimension }) => ({ id, dimension }))).toEqual([
    { id: 'basePower', dimension: 'power' },
    { id: 'droneCount', dimension: 'item' },
    { id: 'dronePower', dimension: 'powerPerItem' },
    { id: 'totalPower', dimension: 'power' },
  ]);
});

test('binds the private answer key to canonical scenario IDs without exposing it as a fact', () => {
  const binding = bindDronePowerScenario(totalFromPartsProblem);

  expect(bindDronePowerAnswerKey(totalFromPartsAnswerKey, binding)).toEqual({
    bindings: {
      basePower: 30,
      droneCount: 4,
      dronePower: 45,
      totalPower: 210,
    },
  });
  expect(binding.facts.find((fact) => fact.id === 'dronePower')).not.toHaveProperty('value');
});
