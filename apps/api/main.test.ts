import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { after, before, test } from "node:test";
import type { AddressInfo } from "node:net";
import { serve, type ServerType } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { format } from "oxfmt";
import sanitizeFilename from "sanitize-filename";
import { app } from "./main.ts";
import { clearWaveformCache } from "#lib/cache.ts";

let updateSnapshots = Boolean(process.env.UPDATE_SNAPSHOTS);
let servers: ServerType[] = [];
let apiOrigin = "";
let fixturesOrigin = "";

// Ephemeral ports so the tests don't collide with running dev servers
before(async () => {
  let fixtures = new Hono();
  fixtures.use("/*", serveStatic({ root: "fixtures" }));

  let fixtureServer = await listen(fixtures.fetch);
  let apiServer = await listen(app.fetch);
  servers = [fixtureServer.server, apiServer.server];
  fixturesOrigin = fixtureServer.origin;
  apiOrigin = apiServer.origin;
});

after(() => {
  for (let server of servers) server.close();
});

let renderTests = [
  { path: `/render?url={fixtures}/short.mp3` },
  { path: `/render?url={fixtures}/short.mp3&stroke=green&fill=red` },
  {
    path: `/render?url={fixtures}/short.mp3&stroke=linear-gradient(blue, red)`,
  },
  { path: `/render?url={fixtures}/short.mp3&type=bars` },
  { path: `/render?url={fixtures}/short.mp3&type=steps` },
  { path: `/render?url={fixtures}/short.mp3&samples=50` },
  { path: `/render?url={fixtures}/short.mp3&samples=50&stroke-width=10` },
  {
    path: `/render?url={fixtures}/short.mp3&samples=50&stroke-linecap=square`,
  },
  {
    path: `/render?url={fixtures}/short.mp3&height=200&samples=10&type=bars`,
  },
  {
    path: `/render?url={fixtures}/short.mp3&height=200&samples=10&type=mirror`,
  },
  {
    path: `/render?url={fixtures}/short.mp3&height=200&samples=10&type=steps`,
  },
];

for (let renderTest of renderTests) {
  test(`GET ${renderTest.path}`, async () => {
    process.env.RATE_LIMIT = "off";

    await clearWaveformCache();
    let resp = await fetch(apiOrigin + resolveFixtures(renderTest.path));
    assert.equal(resp.status, 200);
    assert.equal(resp.headers.get("Content-Type"), "image/svg+xml");

    let rawSvg = await resp.text();
    let html = `<html><body>${rawSvg}</body></html>`;

    let expectedPath = createSnapshotPath(
      sanitizeFilename(renderTest.path) + ".html",
    );

    let actualPath = expectedPath.replace(/\.html$/, ".actual.html");
    let { code: actualValue } = await format("snapshot.html", html, {
      printWidth: 80,
    });
    let printedActualPath = printableSnapshotPath(actualPath);
    await writeFile(actualPath, actualValue);

    const comparing = existsSync(expectedPath);

    if (!comparing || updateSnapshots) {
      await writeFile(expectedPath, actualValue);
    }

    let expectedValue = await readFile(expectedPath, "utf8");
    let printedExpectedPath = printableSnapshotPath(expectedPath);
    let report = createReport(expectedValue, actualValue);
    let reportPath = expectedPath.replace(/\.html$/, ".report.html");
    let printedReportPath = printableSnapshotPath(reportPath);
    await writeFile(reportPath, report);

    if (comparing && !updateSnapshots) {
      if (expectedValue !== actualValue) {
        assert.fail(
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

test("Rate limiting - unique analysis requests", async () => {
  process.env.RATE_LIMIT = "on";
  clearWaveformCache();
  const resp1 = await fetch(
    `${apiOrigin}/render?url=${fixturesOrigin}/short.mp3&type=mirror`,
  );
  const resp2 = await fetch(
    `${apiOrigin}/render?url=${fixturesOrigin}/long.mp3&type=bars`,
  );

  assert.equal(resp1.status, 200);
  assert.equal(resp2.status, 429);

  await resp1.text();
  assert.match(await resp2.text(), /too many requests/i);

  // Waiting for rate limiter timeout
  await sleep(1000);
});

function listen(
  fetch: (req: Request) => Response | Promise<Response>,
): Promise<{ server: ServerType; origin: string }> {
  return new Promise((resolve) => {
    let server = serve({ fetch, port: 0 }, (info: AddressInfo) => {
      resolve({ server, origin: `http://localhost:${info.port}` });
    });
  });
}

/**
 * Test paths use a `{fixtures}` placeholder so snapshot names don't depend on
 * the fixture server's port.
 */
function resolveFixtures(path: string) {
  return path.replaceAll("{fixtures}", fixturesOrigin);
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

function createSnapshotPath(name: string) {
  return join("./__images__", name);
}

function printableSnapshotPath(name: string) {
  return `file://${encodeURI(resolve(name))}`;
}
