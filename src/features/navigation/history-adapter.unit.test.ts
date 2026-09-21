import { expect, test, vi } from 'vitest';
import {
  browserHistoryAdapter,
  historyAdapterWith,
  type HistoryAdapter,
} from './history-adapter';

type RecordedWrite = { url: string; mode: 'push' | 'replace' };

function recordingAdapter(
  onWrite: (write: RecordedWrite) => void,
): HistoryAdapter {
  return historyAdapterWith({
    push: (hash, basePath) => onWrite({ url: `${basePath}${hash}`, mode: 'push' }),
    replace: (hash, basePath) =>
      onWrite({ url: `${basePath}${hash}`, mode: 'replace' }),
    onRoutePopped: () => {},
  });
}

test('writes hash routes against the deployment base path', () => {
  const writes: RecordedWrite[] = [];
  const adapter = recordingAdapter((write) => writes.push(write));
  adapter.push(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=en',
    '/text-math-modeling-game/',
  );
  expect(writes).toEqual([
    {
      url: '/text-math-modeling-game/#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=en',
      mode: 'push',
    },
  ]);
  adapter.replace('#home?language=nb', '/text-math-modeling-game/pr-36/');
  expect(writes[1]).toEqual({
    url: '/text-math-modeling-game/pr-36/#home?language=nb',
    mode: 'replace',
  });
});

test('the browser adapter delegates to pushState, replaceState and popstate', () => {
  const pushState = vi.fn();
  const replaceState = vi.fn();
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();
  const adapter = browserHistoryAdapter({
    history: { pushState, replaceState } as unknown as Pick<
      History,
      'pushState' | 'replaceState'
    >,
    window: {
      addEventListener,
      removeEventListener,
    } as unknown as Pick<Window, 'addEventListener' | 'removeEventListener'>,
  });
  adapter.push('#home', '/');
  expect(pushState).toHaveBeenCalledWith(null, '', '/#home');
  adapter.replace('#home?language=nb', '/base/');
  expect(replaceState).toHaveBeenCalledWith(
    null,
    '',
    '/base/#home?language=nb',
  );
  expect(addEventListener).toHaveBeenCalledTimes(2);
  expect(addEventListener.mock.calls.map((call) => call[0])).toEqual(
    expect.arrayContaining(['popstate', 'hashchange']),
  );
  const popped: string[] = [];
  adapter.onRoutePopped(() => popped.push('popped'));
  adapter.dispose?.();
  expect(removeEventListener).toHaveBeenCalledWith(
    'popstate',
    expect.any(Function),
  );
  expect(removeEventListener).toHaveBeenCalledWith(
    'hashchange',
    expect.any(Function),
  );
});

test('route change notifications reach registered listeners from both browser events', () => {
  const listeners: Array<() => void> = [];
  const adapter = browserHistoryAdapter({
    window: {
      addEventListener: (_: string, listener: () => void) =>
        listeners.push(listener),
      removeEventListener: () => {},
    } as unknown as Pick<Window, 'addEventListener' | 'removeEventListener'>,
  });
  const popped: string[] = [];
  adapter.onRoutePopped(() => popped.push('one'));
  expect(listeners).toHaveLength(2);
  for (const listener of [...listeners]) {
    listener();
  }
  expect(popped).toEqual(['one', 'one']);
});

test('an external hash edit emits hashchange and restores the route without new writes', () => {
  const listeners: Array<() => void> = [];
  const adapter = browserHistoryAdapter({
    window: {
      addEventListener: (_: string, listener: () => void) =>
        listeners.push(listener),
      removeEventListener: () => {},
    } as unknown as Pick<Window, 'addEventListener' | 'removeEventListener'>,
  });
  expect(listeners).toHaveLength(2);
});
