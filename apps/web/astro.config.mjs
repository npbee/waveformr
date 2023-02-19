import { defineConfig } from "astro/config";

// https://astro.build/config
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config

// https://astro.build/config
import deno from "@astrojs/deno";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: deno({
    port: 3000,
  }),
});
