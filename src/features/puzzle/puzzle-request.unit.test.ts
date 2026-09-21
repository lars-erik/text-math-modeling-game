import { describe, expect, test } from 'vitest';
import {
  isPuzzleSelectionRequest,
  isSessionSelectionRequest,
  type PuzzleSelectionRequest,
} from './puzzle-request';

const validPuzzleSelection: PuzzleSelectionRequest = {
  seed: 17,
  familyId: 'groups-total',
  themeId: 'gaming.drone-power',
  modeId: 'quantities-to-named-equation',
  locale: 'en',
};

describe('isPuzzleSelectionRequest', () => {
  test('accepts a complete puzzle selection request', () => {
    expect(isPuzzleSelectionRequest(validPuzzleSelection)).toBe(true);
  });

  test('accepts a request with the legacy-free default family id', () => {
    expect(
      isPuzzleSelectionRequest({
        ...validPuzzleSelection,
        familyId: 'total-from-parts',
      }),
    ).toBe(true);
  });

  test('rejects a request without a family id', () => {
    const { familyId: _omitted, ...withoutFamily } = validPuzzleSelection;
    expect(isPuzzleSelectionRequest(withoutFamily)).toBe(false);
  });

  test('rejects a request with an unknown family id', () => {
    expect(
      isPuzzleSelectionRequest({
        ...validPuzzleSelection,
        familyId: 'unknown-family',
      }),
    ).toBe(false);
  });

  test('rejects non-objects and requests with invalid fields', () => {
    expect(isPuzzleSelectionRequest(null)).toBe(false);
    expect(isPuzzleSelectionRequest(undefined)).toBe(false);
    expect(isPuzzleSelectionRequest('puzzle')).toBe(false);
    expect(
      isPuzzleSelectionRequest({
        ...validPuzzleSelection,
        seed: 'seventeen',
      }),
    ).toBe(false);
    expect(
      isPuzzleSelectionRequest({
        ...validPuzzleSelection,
        themeId: 'unknown.theme',
      }),
    ).toBe(false);
    expect(
      isPuzzleSelectionRequest({
        ...validPuzzleSelection,
        modeId: 'unknown-mode',
      }),
    ).toBe(false);
    expect(
      isPuzzleSelectionRequest({
        ...validPuzzleSelection,
        locale: 'fr',
      }),
    ).toBe(false);
  });
});

describe('isSessionSelectionRequest', () => {
  test('accepts a complete session selection request', () => {
    expect(
      isSessionSelectionRequest({
        seed: 17,
        themeId: 'gaming.drone-power',
        locale: 'nb',
      }),
    ).toBe(true);
  });

  test('rejects a request with an unknown theme', () => {
    expect(
      isSessionSelectionRequest({
        seed: 17,
        themeId: 'unknown.theme',
        locale: 'nb',
      }),
    ).toBe(false);
  });
});
