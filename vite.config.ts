import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({ srcDirectory: "app" }),
    nitro(),
    // Client and SSR are separate Vite environments; persisting lets both
    // contribute rules to the single dev stylesheet.
    stylex.vite({
      devPersistToDisk: true,
      // TanStack Start transforms route files differently for client and SSR,
      // so the line numbers in data-style-src differ and break hydration.
      enableDebugDataProp: false,
      // StyleX resolves theme imports itself and ignores tsconfig paths.
      aliases: { "~/*": [fileURLToPath(new URL("./app/*", import.meta.url))] },
      // Production rules go in the reset stylesheet, the one CSS file that
      // outlives Tailwind. Unlayered, they still win over the reset's layer.
      cssInjectionTarget: (fileName: string) => fileName.includes("reset"),
    }),
    viteReact(),
  ],
});
