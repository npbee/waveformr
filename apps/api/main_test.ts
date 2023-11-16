import "$std/dotenv/load.ts";
import { serveDir } from "$std/http/file_server.ts";
import { resolve } from "$std/path/resolve.ts";
import { join } from "$std/path/mod.ts";
import { bold } from "$std/fmt/colors.ts";
import { exists } from "$std/fs/mod.ts";
import { run } from "./main.ts";
import { prettier, sanitizeFilename } from "./dev_deps.ts";
import { assertEquals, assertMatch } from "$std/assert/mod.ts";
import { clearWaveformCache } from "$lib/cache.ts";

startServers();

let renderTests = [
  { path: `/render?url=${fixture("short.mp3")}` },
  { path: `/render?url=${fixture("short.mp3")}&stroke=green&fill=red` },
  {
    path: `/render?url=${
      fixture(
        "short.mp3",
      )
    }&stroke=linear-gradient(blue, red)`,
  },
  { path: `/render?url=${fixture("short.mp3")}&type=bars` },
  { path: `/render?url=${fixture("short.mp3")}&type=steps` },
  { path: `/render?url=${fixture("short.mp3")}&samples=50` },
  { path: `/render?url=${fixture("short.mp3")}&samples=50&stroke-width=10` },
  {
    path: `/render?url=${
      fixture(
        "short.mp3",
      )
    }&samples=50&stroke-linecap=square`,
  },
];

for (let renderTest of renderTests) {
  Deno.test(`GET ${renderTest.path}`, async () => {
    Deno.env.set("RATE_LIMIT", "off");

    await clearWaveformCache();
    let url = new URL("http://localhost:8000" + renderTest.path);
    let resp = await fetch(url);
    assertEquals(resp.status, 200);
    assertEquals(resp.headers.get("Content-Type"), "image/svg+xml");

    let rawSvg = await resp.text();
    let snapshotPath = svgSnapshotPath(
      sanitizeFilename(renderTest.path) + ".svg",
    );
    let svg = await prettier.format(rawSvg, {
      parser: "html",
    });

    let printablePath = bold(printableSnapshotPath(snapshotPath));

    if ((await exists(snapshotPath)) && !Deno.args.includes("--update")) {
      let existingFile = await Deno.readTextFile(snapshotPath);
      assertEquals(
        existingFile,
        svg,
        `\n\n    Snapshot does not match:  ${printablePath}`,
      );
      console.log("Snapshot path: " + printablePath);
    } else {
      await Deno.writeTextFile(snapshotPath, svg);
      console.log("Snapshot written: " + printablePath);
    }
  });
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

Deno.test("Rate limiting - unique analysis requests", async () => {
  Deno.env.set("RATE_LIMIT", "on");
  clearWaveformCache();
  const resp1 = await fetch(
    `http://localhost:8000/render?url=${fixture("short.mp3")}&type=mirror`,
  );
  const resp2 = await fetch(
    `http://localhost:8000/render?url=${fixture("long.mp3")}&type=bars`,
  );

  assertEquals(resp1.status, 200);
  assertEquals(resp2.status, 429);

  // Need to do all these awaits so Deno doesn't complain about leaked resources
  await resp1.text();
  assertMatch(await resp2.text(), /too many requests/i);

  // Waiting for rate limiter timeout
  await sleep(1000);
});

// Start the app server and a fixture server so that we can hit the endpoint
// in a way that resembles the real thing
function startServers() {
  Deno.serve(
    {
      port: 3000,
      onListen({ port, hostname }) {
        console.log(`Fixture server started at http://${hostname}:${port}`);
      },
    },
    (req) =>
      serveDir(req, {
        fsRoot: resolve("fixtures"),
      }),
  );

  run();
}

function fixture(path: string) {
  return `http://localhost:3000/${path}`;
}

function svgSnapshotPath(name: string) {
  return join("./__images__", name);
}

function printableSnapshotPath(name: string) {
  return `file://${encodeURI(resolve(name))}`;
}
