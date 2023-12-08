import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./tailwind.css";
import { SvgSprite } from "./components/svg-sprite";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex justify-center items-center">
        <div className="py-4">
          <h1 className="text-xl">Oh no! An error occurred.</h1>
        </div>
        {/* add the UI you want your users to see */}
        <SvgSprite />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="robots" content="index, follow" />
        <Meta />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Links />
      </head>
      <body className="text-gray-900 bg-gray-50 dark:text-gray-50">
        <SvgSprite />
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}