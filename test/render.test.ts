import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { join, resolve } from "node:path";
import { after, before, test } from "node:test";
import { format } from "oxfmt";
import sanitizeFilename from "sanitize-filename";
import {
  handleRender,
  rateLimiterOpts,
} from "../app/waveform/render_waveform.server.ts";
import { clearWaveformCache } from "../app/waveform/cache.ts";

let updateSnapshots = Boolean(process.env.UPDATE_SNAPSHOTS);
let fixturesDir = join(import.meta.dirname, "fixtures");
let snapshotsDir = join(import.meta.dirname, "__images__");
let fixtureServer: Server;
let fixturesOrigin = "";

// Ephemeral port so the tests don't collide with running dev servers
before(async () => {
  fixtureServer = createServer(async (req, res) => {
    try {
      // Only the last segment matters, so tests can make unique URLs for the
      // same fixture with a prefix like `/1/short.mp3`
      let name = sanitizeFilename(
        decodeURIComponent(new URL(req.url ?? "", "http://x").pathname)
          .split("/")
          .at(-1) ?? "",
      );
      res.end(await readFile(join(fixturesDir, name)));
    } catch {
      res.statusCode = 404;
      res.end();
    }
  });
  await new Promise<void>((res) => fixtureServer.listen(0, res));
  let { port } = fixtureServer.address() as AddressInfo;
  fixturesOrigin = `http://localhost:${port}`;
});

after(() => {
  fixtureServer.close();
});

function render(path: string, clientIp = "127.0.0.1") {
  return handleRender(
    new Request(new URL(path, "http://waveformr.test"), {
      headers: { "Fly-Client-IP": clientIp },
    }),
  );
}

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
    let resp = await render(resolveFixtures(renderTest.path));
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

test("Rate limiting - unique analysis requests", async () => {
  process.env.RATE_LIMIT = "on";
  clearWaveformCache();
  let points = Number(rateLimiterOpts.points);

  for (let i = 0; i < points; i++) {
    let resp = await render(`/render?url=${fixturesOrigin}/${i}/short.mp3`, "10.0.0.1");
    assert.equal(resp.status, 200);
    await resp.text();
  }

  let limited = await render(`/render?url=${fixturesOrigin}/long.mp3`, "10.0.0.1");
  assert.equal(limited.status, 429);
  assert.ok(limited.headers.get("Retry-After"));
  assert.match(await limited.text(), /too many requests/i);
});

test("Rate limiting - concurrent requests share one analysis", async () => {
  process.env.RATE_LIMIT = "on";
  clearWaveformCache();
  let responses = await Promise.all(
    ["red", "green", "blue"].map((stroke) =>
      render(
        `/render?url=${fixturesOrigin}/short.mp3&stroke=${stroke}`,
        "10.0.0.2",
      ),
    ),
  );

  for (let resp of responses) {
    assert.equal(resp.status, 200);
    await resp.text();
  }
});

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
  return join(snapshotsDir, name);
}

function printableSnapshotPath(name: string) {
  return `file://${encodeURI(resolve(name))}`;
}
