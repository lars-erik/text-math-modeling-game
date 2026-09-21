export type HistoryAdapter = {
  push: (hash: string, basePath: string) => void;
  replace: (hash: string, basePath: string) => void;
  onRoutePopped: (listener: () => void) => void;
  dispose?: () => void;
};

export type BrowserHistoryAdapterOptions = {
  history?: Pick<History, 'pushState' | 'replaceState'>;
  window?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
};

export function browserHistoryAdapter(
  options: BrowserHistoryAdapterOptions = {},
): HistoryAdapter {
  const history = options.history ?? globalThis.history;
  const browserWindow = options.window ?? globalThis;
  const popListeners: Array<() => void> = [];
  const popstateListener = () => {
    for (const listener of popListeners) {
      listener();
    }
  };
  const canListen =
    typeof browserWindow.addEventListener === 'function' &&
    typeof browserWindow.removeEventListener === 'function';
  if (canListen) {
    browserWindow.addEventListener('popstate', popstateListener);
  }
  return {
    push: (hash: string, basePath: string) => {
      history.pushState(null, '', `${basePath}${hash}`);
    },
    replace: (hash: string, basePath: string) => {
      history.replaceState(null, '', `${basePath}${hash}`);
    },
    onRoutePopped: (listener: () => void) => {
      popListeners.push(listener);
    },
    dispose: () => {
      if (canListen) {
        browserWindow.removeEventListener('popstate', popstateListener);
      }
    },
  };
}

export function historyAdapterWith(
  overrides: HistoryAdapter,
): HistoryAdapter {
  return overrides;
}
