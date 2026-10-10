import type { ReactNode } from "react";
import {
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import styles from "../tailwind.css?url";
import { SvgSprite } from "~/components/svg-sprite";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "icon", href: "data:image/x-icon;base64,AA" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://rsms.me/" },
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      { rel: "stylesheet", href: styles },
    ],
    scripts: import.meta.env.PROD
      ? [
          {
            "data-host": "https://app.microanalytics.io",
            "data-dnt": "false",
            src: "https://app.microanalytics.io/js/script.js",
            id: "ZwSg9rf6GA",
            async: true,
            defer: true,
          },
        ]
      : [],
  }),
  shellComponent: RootDocument,
  errorComponent: ErrorComponent,
});

function RootDocument(props: { children: ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="text-gray-900 bg-gray-50 dark:text-gray-50">
        <SvgSprite />
        {props.children}
        <Scripts />
      </body>
    </html>
  );
}

function ErrorComponent(props: { error: unknown }) {
  console.error(props.error);
  return (
    <div className="flex justify-center items-center">
      <div className="py-4">
        <h1 className="text-xl">Oh no! An error occurred.</h1>
      </div>
    </div>
  );
}
