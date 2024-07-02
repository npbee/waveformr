import "@std/dotenv/load";
import { serveDir } from "@std/http/file-server";
import { resolve } from "@std/path";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { run } from "./main.ts";
import { prettier, sanitizeFilename } from "./dev_deps.ts";
import { assertEquals, assertMatch, fail } from "@std/assert";
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
  {
    path: `/render?url=${fixture("short.mp3")}&height=200&samples=10&type=bars`,
  },
  {
    path: `/render?url=${
      fixture(
        "short.mp3",
      )
    }&height=200&samples=10&type=mirror`,
  },
  {
    path: `/render?url=${
      fixture(
        "short.mp3",
      )
    }&height=200&samples=10&type=steps`,
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
    let html = `<html><body>${rawSvg}</body></html>`;

    let expectedPath = createSnapshotPath(
      sanitizeFilename(renderTest.path) + ".html",
    );

    let actualPath = expectedPath.replace(/\.html$/, ".actual.html");
    let actualValue = await prettier.format(html, {
      parser: "html",
    });
    let printedActualPath = printableSnapshotPath(actualPath);
    await Deno.writeTextFile(actualPath, actualValue);

    const comparing = await exists(expectedPath);

    if (!comparing || Deno.args.includes("--update")) {
      await Deno.writeTextFile(expectedPath, actualValue);
    }

    let expectedValue = await Deno.readTextFile(expectedPath);
    let printedExpectedPath = printableSnapshotPath(expectedPath);
    let report = createReport(expectedValue, actualValue);
    let reportPath = expectedPath.replace(/\.html$/, ".report.html");
    let printedReportPath = printableSnapshotPath(reportPath);
    await Deno.writeTextFile(reportPath, report);

    if (comparing && !Deno.args.includes("--update")) {
      if (expectedValue !== actualValue) {
        fail(
          `Snapshot does not match:  \n\n  expected: ${printedExpectedPath}\n  actual:   ${printedActualPath}\n  report:   ${printedReportPath}\n\n`,
        );
      }
    } else if (!comparing) {
      console.log(
        `New snapshot written: actual:  \n\n actual: ${printedActualPath}\n report: ${printedReportPath} \n\n`,
      );
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

function createReport(expected: string, actual: string) {
  return `<html>
    <body>
      <div>
        <h1>Expected</h1>
        <div style="border: 1px dotted black"
        ${expected}
        </div>
      </div>
      <div>
        <h1>Actual</h1>
        <div style="border: 1px dotted black"
        ${actual}
        </div>
      </div>
  </body></html>`;
}

function fixture(path: string) {
  return `http://localhost:3000/${path}`;
}

function createSnapshotPath(name: string) {
  return join("./__images__", name);
}

function printableSnapshotPath(name: string) {
  return `file://${encodeURI(resolve(name))}`;
}
