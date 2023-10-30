import { assertEquals } from "https://deno.land/std@v0.204.0/testing/asserts.ts";
import { dirname } from 'https://deno.land/std@v0.204.0/path/mod.ts';
import { importMapPlugin } from './importMapPlugin.ts';

Deno.test("importMaps() when importMap is empty", () => {
  assertEquals(importMapPlugin({}).config(), {
    resolve: { alias: {} },
  });
});

Deno.test("importMaps() when importMap has imports", () => {
  assertEquals(importMapPlugin({
    imports: {
      "react": "https://cdn.skypack.dev/react",
      "react/": "https://cdn.skypack.dev/react/",
    }
  }).config(), {
    resolve: {
      alias: {
        "react": "https://cdn.skypack.dev/react",
        "react/": "https://cdn.skypack.dev/react/",
      }
    },
  });
});


Deno.test("importMaps() when importMap has relative alias", () => {
  const dirName = dirname(dirname(import.meta.url.substring(7)));
  assertEquals(importMapPlugin({
    imports: {
      "@/": "./",
    }
  }).config(), {
    resolve: {
      alias: {
        "@/": `${dirName}/`
      }
    },
  });
});
