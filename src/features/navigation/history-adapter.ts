export type HistoryAdapter = {
  push: (hash: string, basePath: string) => void;
  replace: (hash: string, basePath: string) => void;
  onRoutePopped: (listener: () => void) => void;
  dispose?: () => void;
};

export type BrowserHistoryAdapterOptions = {
  history?: Pick<History, 'pushState' | 'replaceState'>;
  window?: Pick<
    Window,
    'addEventListener' | 'removeEventListener'
  > & Record<string, unknown>;
};

const routeChangeEvents = ['popstate', 'hashchange'] as const;

export function browserHistoryAdapter(
  options: BrowserHistoryAdapterOptions = {},
): HistoryAdapter {
  const history = options.history ?? globalThis.history;
  const browserWindow = options.window ?? globalThis;
  const routeChangeListeners: Array<() => void> = [];
  const routeChangeListener = () => {
    for (const listener of routeChangeListeners) {
      listener();
    }
  };
  const canListen =
    typeof browserWindow.addEventListener === 'function' &&
    typeof browserWindow.removeEventListener === 'function';
  if (canListen) {
    for (const event of routeChangeEvents) {
      browserWindow.addEventListener(event, routeChangeListener);
    }
  }
  return {
    push: (hash: string, basePath: string) => {
      history.pushState(null, '', `${basePath}${hash}`);
    },
    replace: (hash: string, basePath: string) => {
      history.replaceState(null, '', `${basePath}${hash}`);
    },
    onRoutePopped: (listener: () => void) => {
      routeChangeListeners.push(listener);
    },
    dispose: () => {
      if (canListen) {
        for (const event of routeChangeEvents) {
          browserWindow.removeEventListener(event, routeChangeListener);
        }
      }
    },
  };
}

export function historyAdapterWith(
  overrides: HistoryAdapter,
): HistoryAdapter {
  return overrides;
}
