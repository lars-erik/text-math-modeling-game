import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import {
  navigatePuzzleRequestEvent,
  navigateSessionRequestEvent,
  type NavigatePuzzleRequest,
  type NavigateSessionRequest,
} from '../navigation-request';
import './home-screen';

test('home offers semantic puzzle and session navigation', async () => {
  document.body.innerHTML = '<home-screen locale="en"></home-screen>';
  const home = document.querySelector('home-screen');
  expect(home).not.toBeNull();
  const requests: Array<
    NavigatePuzzleRequest | NavigateSessionRequest
  > = [];
  home?.addEventListener(navigatePuzzleRequestEvent, (event) => {
    requests.push((event as CustomEvent<NavigatePuzzleRequest>).detail);
  });
  home?.addEventListener(navigateSessionRequestEvent, (event) => {
    requests.push((event as CustomEvent<NavigateSessionRequest>).detail);
  });
  await userEvent.click(page.getByRole('button', { name: 'Start puzzle' }));
  await userEvent.click(page.getByRole('button', { name: 'Start session' }));
  expect(requests).toEqual([
    { seed: 17, themeId: 'gaming.drone-power', modeId: 'story-to-quantities' },
    { seed: 918273, themeId: 'gaming.drone-power' },
  ]);
});

test('home renders localized Norwegian labels', async () => {
  document.body.innerHTML = '<home-screen locale="nb"></home-screen>';
  const home = document.querySelector('home-screen');
  await (home as unknown as { updateComplete: Promise<unknown> })
    .updateComplete;
  expect(page.getByRole('heading', { name: 'Matemodelleringsoppgaver' }));
  expect(
    document.querySelector('home-screen')?.shadowRoot?.textContent ?? '',
  ).toContain('Start oppgave');
});
