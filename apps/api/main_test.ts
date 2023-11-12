import "$std/dotenv/load.ts";
import { serveDir } from "$std/http/file_server.ts";
import { resolve } from "$std/path/resolve.ts";
import { join } from "$std/path/mod.ts";
import { bold } from "$std/fmt/colors.ts";
import { exists } from "$std/fs/mod.ts";
import { run } from "./main.ts";
import { sanitizeFilename } from "./dev_deps.ts";
import { assertEquals } from "$std/assert/mod.ts";
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
    await clearWaveformCache();
    let url = new URL("http://localhost:8000" + renderTest.path);
    let resp = await fetch(url);
    assertEquals(resp.status, 200);
    assertEquals(resp.headers.get("Content-Type"), "image/svg+xml");

    let svg = await resp.text();
    let snapshotPath = svgSnapshotPath(
      sanitizeFilename(renderTest.path) + ".svg",
    );

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
