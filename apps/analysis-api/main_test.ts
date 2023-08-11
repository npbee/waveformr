import { assertSnapshot, join, makeloc, load } from "./dev_deps.ts";
import { app } from "./main.ts";

let { __dirname } = makeloc(import.meta);
let env = await load();

Deno.test("mp3 - json", async (t) => {
  let bytes = await loadFile("../../fixtures/short.mp3");
  let file = new File([bytes.buffer], "short.mp3");
  let formData = new FormData();

  formData.append("file", file);
  formData.append("samples", "50");
  formData.append("output", "json");

  let request = new Request("http://localhost/stats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env["API_KEY"]}`,
    },
    body: formData,
  });

  let resp = await app.request(request);
  let json = await resp.json();

  await assertSnapshot(t, json);
});

// Deno.test("wav - json", async (t) => {
//   let bytes = await loadFile("../../fixtures/short.wav");
//   let file = new File([bytes.buffer], "short.wav");
//   let formData = new FormData();
//
//   formData.append("file", file);
//   formData.append("samples", "50");
//   formData.append("output", "json");
//
//   let request = new Request("http://localhost/", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${env["API_KEY"]}`,
//     },
//     body: formData,
//   });
//
//   let resp = await app.request(request);
//   assertEquals(resp.status, 200);
//
//   let json = await resp.json();
//   await assertSnapshot(t, json);
// });

function loadFile(file: string) {
  return Deno.readFile(join(__dirname, file));
}
