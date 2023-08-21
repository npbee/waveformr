import { assertEquals, fail } from "$std/assert/mod.ts";
import { parseColor } from "$lib/parse_color.ts";
import { assert } from "$std/assert/assert.ts";

Deno.test("parseColor() - literal named color", () => {
  let parsed = parseColor("blue");

  assert(parsed.type === "literal");
  assertEquals(parsed.color, "blue");
});

Deno.test("parseColor() - literal hex color", () => {
  let parsed = parseColor("ff0000");

  assert(parsed.type === "literal");
  assertEquals(parsed.color, "#ff0000");
});

Deno.test("parseColor() - gradient with named colors and stops", () => {
  let parsed = parseColor(
    "linear-gradient(red 0%, orange 25%, yellow 50%, green 75%, blue 100%)",
  );

  if (parsed.type === "linear-gradient") {
    assertEquals(parsed.colorStops, [
      { color: "red", stop: "0%" },
      { color: "orange", stop: "25%" },
      { color: "yellow", stop: "50%" },
      { color: "green", stop: "75%" },
      { color: "blue", stop: "100%" },
    ]);
  } else {
    fail("Expected a linear gradient. Received " + parsed.type);
  }
});

Deno.test("parseColor() - gradient with named colors", () => {
  let parsed = parseColor(
    "linear-gradient(red, orange, yellow, green, blue)",
  );

  if (parsed.type === "linear-gradient") {
    assertEquals(parsed.colorStops, [
      { color: "red", stop: "0%" },
      { color: "orange", stop: "25%" },
      { color: "yellow", stop: "50%" },
      { color: "green", stop: "75%" },
      { color: "blue", stop: "100%" },
    ]);
  } else {
    fail("Expected a linear gradient. Received " + parsed.type);
  }
});

Deno.test("parseColor() - gradient with hex colors", () => {
  let parsed = parseColor(
    "linear-gradient(ff0000, 00ff00, 0000ff)",
  );

  if (parsed.type === "linear-gradient") {
    assertEquals(parsed.colorStops, [
      { color: "#ff0000", stop: "0%" },
      { color: "#00ff00", stop: "50%" },
      { color: "#0000ff", stop: "100%" },
    ]);
  } else {
    fail("Expected a linear gradient. Received " + parsed.type);
  }
});

Deno.test("parseColor() - gradient with hex colors and stops", () => {
  let parsed = parseColor(
    "linear-gradient(ff0000 0%, 00ff00 75%, 0000ff 100%)",
  );

  if (parsed.type === "linear-gradient") {
    assertEquals(parsed.colorStops, [
      { color: "#ff0000", stop: "0%" },
      { color: "#00ff00", stop: "75%" },
      { color: "#0000ff", stop: "100%" },
    ]);
  } else {
    fail("Expected a linear gradient. Received " + parsed.type);
  }
});
