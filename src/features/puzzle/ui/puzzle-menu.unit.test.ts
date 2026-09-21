import { expect, test } from 'vitest';
import { PuzzleMenu } from './puzzle-menu';

function simulateFamilyChange(
  menu: PuzzleMenu,
  previousFamilyId: PuzzleMenu['familyId'],
): void {
  const willUpdate = (
    menu as unknown as {
      willUpdate: (changed: Map<string, unknown>) => void;
    }
  ).willUpdate;
  willUpdate.call(menu, new Map([['familyId', previousFamilyId]]));
}

test('changing the family normalizes an unsupported hidden role to the default', () => {
  const menu = new PuzzleMenu();
  menu.familyId = 'total-from-parts';
  menu.hiddenRole = 'base';
  simulateFamilyChange(menu, 'total-from-parts');
  expect(menu.hiddenRole).toBe('base');
  menu.familyId = 'groups-total';
  simulateFamilyChange(menu, 'total-from-parts');
  expect(menu.hiddenRole).toBe('per-item');
});

test('a supported hidden role is preserved when the family changes', () => {
  const menu = new PuzzleMenu();
  menu.familyId = 'total-from-parts';
  menu.hiddenRole = 'count';
  menu.familyId = 'groups-total';
  simulateFamilyChange(menu, 'total-from-parts');
  expect(menu.hiddenRole).toBe('count');
});
