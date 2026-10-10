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
      // StyleX resolves theme imports itself and ignores tsconfig paths.
      aliases: { "~/*": [fileURLToPath(new URL("./app/*", import.meta.url))] },
    }),
    viteReact(),
  ],
});
