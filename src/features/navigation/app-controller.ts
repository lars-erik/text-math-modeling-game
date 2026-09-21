import { formatHash, parseHash, type Route } from './hash-route';
import type { HistoryAdapter } from './history-adapter';

export type ViewElement = {
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  hidden: boolean;
};

export type ViewBinding = {
  tagName: string;
  attributeByParam: Readonly<Record<string, string>>;
};

export type AppControllerOptions = {
  initialHash: string;
  getHash: () => string;
  basePath: string;
  root: { querySelector: (tagName: string) => ViewElement | null };
  history: HistoryAdapter;
  views: Readonly<Record<string, ViewBinding>>;
};

export type AppController = {
  currentRoute: () => Route;
  navigate: (route: Route) => void;
};

export function startAppController(
  options: AppControllerOptions,
): AppController {
  const { views } = options;
  const attributeNamesByTag = new Map<string, Set<string>>();
  for (const binding of Object.values(views)) {
    const names =
      attributeNamesByTag.get(binding.tagName) ?? new Set<string>();
    for (const attribute of Object.values(binding.attributeByParam)) {
      names.add(attribute);
    }
    attributeNamesByTag.set(binding.tagName, names);
  }

  const bindingFor = (routeName: string): ViewBinding => {
    const binding = views[routeName];
    if (binding === undefined) {
      throw new Error(
        `No view is bound for route ${JSON.stringify(routeName)}.`,
      );
    }
    return binding;
  };

  const elementFor = (binding: ViewBinding): ViewElement => {
    const element = options.root.querySelector(binding.tagName);
    if (element === null) {
      throw new Error(
        `No element matches ${JSON.stringify(binding.tagName)}.`,
      );
    }
    return element;
  };

  let current: Route = parseHash(options.initialHash);

  const applyRoute = (route: Route): void => {
    const binding = bindingFor(route.name);
    const element = elementFor(binding);
    for (const other of Object.values(views)) {
      if (other.tagName === binding.tagName) {
        continue;
      }
      const otherElement = options.root.querySelector(other.tagName);
      if (otherElement !== null) {
        const otherAttributes = attributeNamesByTag.get(other.tagName) ?? [];
        for (const attribute of otherAttributes) {
          otherElement.removeAttribute(attribute);
        }
        otherElement.hidden = true;
      }
    }
    const appliedAttributes = new Set<string>();
    for (const [param, attribute] of Object.entries(
      binding.attributeByParam,
    )) {
      const value = route.routeParams.get(param);
      if (value !== undefined) {
        element.setAttribute(attribute, String(value));
        appliedAttributes.add(attribute);
      }
    }
    const elementAttributes =
      attributeNamesByTag.get(binding.tagName) ?? new Set<string>();
    for (const attribute of elementAttributes) {
      if (!appliedAttributes.has(attribute)) {
        element.removeAttribute(attribute);
      }
    }
    element.hidden = false;
    current = { name: route.name, routeParams: new Map(route.routeParams) };
  };

  applyRoute(current);
  if (options.initialHash === '') {
    options.history.replace(formatHash(current), options.basePath);
  }

  options.history.onRoutePopped(() => {
    const popped = parseHash(options.getHash());
    if (formatHash(popped) === formatHash(current)) {
      return;
    }
    applyRoute(popped);
  });

  return {
    currentRoute: () => ({
      name: current.name,
      routeParams: new Map(current.routeParams),
    }),
    navigate: (route: Route) => {
      const binding = bindingFor(route.name);
      elementFor(binding);
      applyRoute(route);
      options.history.push(formatHash(route), options.basePath);
    },
  };
}
