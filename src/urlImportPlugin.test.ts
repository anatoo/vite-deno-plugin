import { UrlImportLoader, urlImportPlugin } from "./urlImportPlugin.ts";
import { assertEquals, assertSpyCall, stub } from "./deps.ts";

Deno.test("urlImportPlugin()", async (t) => {
  const loader = new UrlImportLoader();
  const plugin = urlImportPlugin({ loader });
  const cache = stub(loader, "cache");
  stub(loader, "load");

  await plugin.resolveId("https://esm.sh/react", undefined);

  assertSpyCall(cache, 0, {
    args: ["https://esm.sh/react?dev="],
  });

  const testcases: [string, string | undefined, string | null][] = [
    ["./foobar.ts", undefined, null],
    [
      "/foobar.ts",
      "https://example.com/src/index.ts",
      "https://example.com/foobar.ts",
    ],
    [
      "https://example.com/foobar.ts",
      undefined,
      "https://example.com/foobar.ts",
    ],
  ];

  for (const [importee, importer, expected] of testcases) {
    await t.step(`resolveId(${importee}, ${importer})`, async () => {
      assertEquals(await plugin.resolveId(importee, importer), expected);
    });
  }
});
