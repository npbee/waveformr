import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    // Plain query strings so shared links like `?stroke=005f73` keep working;
    // the default JSON encoding would read that as a number.
    parseSearch: (search) =>
      Object.fromEntries(new URLSearchParams(search).entries()),
    stringifySearch: (search) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(search)) {
        if (value !== undefined) params.set(key, String(value));
      }
      const str = params.toString();
      return str ? `?${str}` : "";
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
