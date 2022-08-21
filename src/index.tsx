import React, {
  createContext,
  createElement,
  useContext,
  useSyncExternalStore,
} from "react";

//#region Route
type RouteProps = {
  path: string;
  children: (() => JSX.Element) | React.ReactNode;
};

function Route(props: RouteProps) {
  const pathname = usePathname();
  const parentPath = useRoute();

  const path =
    parentPath != null
      ? // -1 to get rid of the star
        parentPath.substring(0, parentPath.length - 1) + props.path
      : props.path;

  if (!isRouteMatch(path, pathname)) {
    return null;
  }

  if (props.children instanceof Function) {
    return (
      <RouteContext.Provider value={path}>
        {createElement(props.children)}
      </RouteContext.Provider>
    );
  }
  return (
    <RouteContext.Provider value={path}>{props.children}</RouteContext.Provider>
  );
}

//#endregion

//#region Navigate

function Navigate(props: NavigateProps) {
  navigate(props.href);
  return null;
}

//#endregion

//#region Link
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  replace?: boolean;
  state?: any;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef({ onClick, replace, state, href, ...rest }, ref) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          if (href) {
            navigate(href, state, replace);
          }
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

//#endregion

//#region Route Match

// escapes a regexp string (borrowed from path-to-regexp sources)
// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202
const escapeRx = (str: string) =>
  str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

// returns a segment representation in RegExp based on flags
// adapted and simplified version from path-to-regexp sources
const rxForSegment = (repeat: boolean, optional: boolean, prefix: number) => {
  let capture = repeat ? "((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)" : "([^\\/]+?)";
  if (optional && prefix) {
    capture = `(?:\\/${capture})`;
  }
  if (optional) {
    return `${capture}?`;
  }
  return capture;
};

type PathToRegex = {
  keys: string[];
  regexp: RegExp;
};

const pathToRegexp = (pattern: string): PathToRegex => {
  const groupRx = /:([\w]+)([?+*]?)/g;

  let match = null;
  let lastIndex = 0;
  const keys = [];
  let result = "";

  while ((match = groupRx.exec(pattern)) !== null) {
    const [_, segment, mod] = match;

    // :foo  [1]      (  )
    // :foo? [0 - 1]  ( o)
    // :foo+ [1 - ∞]  (r )
    // :foo* [0 - ∞]  (ro)
    const repeat = mod === "+" || mod === "*";
    const optional = mod === "?" || mod === "*";
    const prefix = optional && pattern[match.index - 1] === "/" ? 1 : 0;

    const prev = pattern.substring(lastIndex, match.index - prefix);

    keys.push(segment);
    lastIndex = groupRx.lastIndex;

    result += escapeRx(prev) + rxForSegment(repeat, optional, prefix);
  }

  result += escapeRx(pattern.substring(lastIndex));

  const subUrl = result.endsWith("*");
  if (subUrl) {
    result = result.substring(0, result.length - 4);
  }
  return {
    keys,
    regexp: new RegExp(`^${result}(?:\\/)?${subUrl ? "" : "$"}`, "i"),
  };
};

let cache: { [pattern: string]: PathToRegex } = {};

// obtains a cached regexp version of the pattern
const getRegexp = (pattern: string) =>
  cache[pattern] || (cache[pattern] = pathToRegexp(pattern));

// The pattern is the given route from the <Route /> component.
// The path is the current location path.
export function isRouteMatch(pattern: string, path: string): boolean {
  const { regexp } = getRegexp(pattern);
  return regexp.exec(path) != null;
}

export function routeMatch(
  pattern: string,
  path: string
):
  | [false, null]
  | [
      true,
      {
        [paramName: string]: string;
      }
    ] {
  const { regexp, keys } = getRegexp(pattern);
  const out = regexp.exec(path);

  if (!out) {
    return [false, null];
  }

  // formats an object with matched params
  const params = keys.reduce(
    (paramValues: { [paramName: string]: string }, key, i) => {
      paramValues[key] = out[i + 1];
      return paramValues;
    },
    {}
  );

  return [true, params];
}

//#endregion

const NAVIGATION_EVENT_NAME = "navigation-changed";
const EVENTS = [
  NAVIGATION_EVENT_NAME,
  "popstate",
  "pushState",
  "replaceState",
  "hashchange",
];

const navigationEvent = new CustomEvent(NAVIGATION_EVENT_NAME);

//#region navigate, hooks
export function navigate(
  path: string,
  data?: {} | null,
  replace: boolean = false
) {
  if (replace) {
    window.history.replaceState(data ?? null, "", path);
  } else {
    window.history.pushState(data ?? null, "", path);
  }

  window.dispatchEvent(navigationEvent);
}

type NavigateProps = {
  href: string;
};

function subscribe(callback: () => void): () => void {
  for (const event of EVENTS) {
    window.addEventListener(event, callback);
  }
  return () => {
    for (const event of EVENTS) {
      window.removeEventListener(event, callback);
    }
  };
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

export function useSearch(): string {
  return useSyncExternalStore(subscribe, () => window.location.search);
}

export function useLocationState<State, Select>(
  selectFunction: (state: State) => Select
): Select {
  return useSyncExternalStore(subscribe, () => {
    const state = window.history.state as State;
    return state && selectFunction(state);
  });
}

export const RouteContext = createContext<string | null>(null);
export function useRoute(): string | null {
  return useContext(RouteContext);
}

export function useParams() {
  const routePath = useRoute();
  const currentPath = usePathname();
  if (!routePath) {
    throw new Error("useParams can only be used inside a route.");
  }
  const rm = routeMatch(routePath, currentPath);
  if (!rm[0]) {
    throw new Error("Unexpected mismatch of route.");
  }
  return rm[1];
}

export function useHash() {
  return useSyncExternalStore(subscribe, () => window.location.hash);
}

//#endregion

//#region Switch

type SwitchProps = {
  children: React.ReactNode;
};

const Switch = (props: SwitchProps) => {
  let parentPath = useRoute();
  if (parentPath) {
    parentPath = parentPath.substring(0, parentPath.length - 1);
  }
  const pathname = usePathname();
  const element = GetFirstMatchingChild(props.children, pathname, parentPath);
  if (element == null) {
    return null;
  }
  return <>{element}</>;
};

function GetFirstMatchingChild(
  children: React.ReactNode,
  path: string,
  parentPath: string | null
): React.ReactNode | null {
  return GetChildren(children).find(
    (x) =>
      x.type === Route &&
      isRouteMatch((parentPath ?? "") + (x.props as RouteProps).path, path)
  );
}

function GetChildren(
  node: React.ReactNode
): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>[] {
  const result = new Array<
    React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
  >();
  React.Children.toArray(node).forEach((child) => {
    if (React.isValidElement(child)) {
      if (child.type === React.Fragment) {
        GetChildren(child.props.children);
      } else {
        result.push(child);
      }
    }
  });

  return result;
}
//#endregion

export { Switch, Route, Link, Navigate };
