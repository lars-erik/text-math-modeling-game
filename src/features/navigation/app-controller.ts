import { formatHash, parseHash, type Route } from './hash-route';
import type { HistoryAdapter } from './history-adapter';

export type ViewElement = {
  hidden: boolean;
};

export type Destination = {
  view: ViewElement;
  apply: (route: Route) => void;
};

export type AppControllerOptions = {
  initialHash: string;
  getHash: () => string;
  basePath: string;
  history: HistoryAdapter;
  destinations: Readonly<Record<string, Destination>>;
};

export type AppController = {
  currentRoute: () => Route;
  navigate: (route: Route) => void;
};

export function startAppController(
  options: AppControllerOptions,
): AppController {
  const { destinations } = options;

  const destinationFor = (routeName: string): Destination => {
    const destination = destinations[routeName];
    if (destination === undefined) {
      throw new Error(
        `No destination is bound for route ${JSON.stringify(routeName)}.`,
      );
    }
    return destination;
  };

  let current: Route = parseHash(options.initialHash);

  const applyRoute = (route: Route): void => {
    const destination = destinationFor(route.name);
    destination.apply(route);
    for (const other of Object.values(destinations)) {
      other.view.hidden = true;
    }
    destination.view.hidden = false;
    current = { name: route.name, routeParams: new Map(route.routeParams) };
  };

  applyRoute(current);
  if (options.initialHash === '') {
    options.history.replace(formatHash(current), options.basePath);
  }

  options.history.onRouteChanged(() => {
    const changed = parseHash(options.getHash());
    if (formatHash(changed) === formatHash(current)) {
      return;
    }
    applyRoute(changed);
  });

  return {
    currentRoute: () => ({
      name: current.name,
      routeParams: new Map(current.routeParams),
    }),
    navigate: (route: Route) => {
      destinationFor(route.name);
      applyRoute(route);
      options.history.push(formatHash(route), options.basePath);
    },
  };
}
