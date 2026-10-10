import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import tailwindHref from "../tailwind.css?url";
import { SvgSprite } from "~/components/svg-sprite";
import { color } from "~/styles/tokens.stylex";

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
      {
        rel: "preload",
        href: "/fonts/Fraunces/Fraunces.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "preconnect", href: "https://rsms.me/" },
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      { rel: "stylesheet", href: tailwindHref },
      // Production builds append StyleX rules to the bundled CSS asset.
      ...(import.meta.env.DEV ? [{ rel: "stylesheet", href: "/virtual:stylex.css" }] : []),
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
      : // Reloads StyleX CSS on HMR.
        [{ type: "module", src: "/@id/virtual:stylex:runtime" }],
  }),
  shellComponent: RootDocument,
  errorComponent: ErrorComponent,
});

function RootDocument(props: { children: ReactNode }) {
  return (
    <html {...stylex.props(styles.html)}>
      <head>
        <HeadContent />
      </head>
      <body {...stylex.props(styles.body)}>
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

const styles = stylex.create({
  // Follows the OS setting; set "light" or "dark" here to force a mode.
  html: {
    colorScheme: "light dark",
  },
  body: {
    backgroundColor: color.bg,
    color: color.text,
  },
});
