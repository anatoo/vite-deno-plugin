import { assertEquals, stub } from "./deps.ts";
import { getDefaults } from "./utils.ts";
Deno.test("getDefaults()", () => {
  const result = getDefaults();
  assertEquals(typeof result.importMapFilename, "string");
});

Deno.test("getDefaults() when deno.json is not found", () => {
  const statSync = stub(Deno, "statSync", () => {
    throw Error();
  });
  try {
    const result = getDefaults();
    assertEquals(typeof result.importMapFilename, "undefined");
  } finally {
    statSync.restore();
  }
});
