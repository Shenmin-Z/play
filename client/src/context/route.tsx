import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

const ROUTE_MAP = {
  home: ["home"],
  "play-button": ["tools", "play-button"],
  "repeat-pattern": ["tools", "repeat-pattern"],
  chat: ["tools", "chat"],
  about: ["about"]
};

type ROUTE_MAP = typeof ROUTE_MAP;
type FRAGMENT = keyof ROUTE_MAP;
type RouteContext = ROUTE_MAP[FRAGMENT];
let RouteContext = createContext<RouteContext>(["home"]);

let getRoute = (): [string] | [string, string] => {
  let fragment = window.location.hash.substr(1);
  return ROUTE_MAP[fragment] || ["home"];
};

export let RouteProvider: FC = ({ children }) => {
  let [route, setRoute] = useState(getRoute);

  useEffect(() => {
    let onHashChange = () => {
      setRoute(getRoute());
    };
    window.onhashchange = onHashChange;
    return () => {
      window.removeEventListener("onhashchange", onHashChange);
    };
  }, []);

  return (
    <RouteContext.Provider value={route as RouteContext}>
      {children}
    </RouteContext.Provider>
  );
};

export let useRouteContext = () => useContext(RouteContext);

export let toPage = (fragment: FRAGMENT) => {
  window.location.hash = fragment;
};
