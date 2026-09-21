export type RouteParamValue = string | number | boolean;

export type RouteParams = Map<string, RouteParamValue>;

export type Route = {
  name: string;
  routeParams: RouteParams;
};

const routeNamePattern = /^[a-z][a-z0-9-]*$/;

export function parseHash(hash: string): Route {
  const withoutHash = hash.startsWith('#') ? hash.slice(1) : hash;
  if (withoutHash === '') {
    return { name: 'home', routeParams: new Map() };
  }
  const queryIndex = withoutHash.indexOf('?');
  const name =
    queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
  if (!routeNamePattern.test(name)) {
    throw new Error(`Invalid route name ${JSON.stringify(name)}.`);
  }
  const query =
    queryIndex === -1 ? '' : withoutHash.slice(queryIndex + 1);
  const routeParams: RouteParams = new Map();
  for (const [key, value] of new URLSearchParams(query)) {
    routeParams.set(key, value);
  }
  return { name, routeParams: new Map(routeParams) };
}

export function formatHash(route: Route): string {
  if (!routeNamePattern.test(route.name)) {
    throw new Error(`Invalid route name ${JSON.stringify(route.name)}.`);
  }
  const parameters = new URLSearchParams();
  for (const [key, value] of route.routeParams) {
    parameters.set(key, String(value));
  }
  const query = parameters.toString();
  return query === '' ? `#${route.name}` : `#${route.name}?${query}`;
}
