import { assertEquals } from "https://deno.land/std@v0.204.0/testing/asserts.ts";
import { dirname } from 'https://deno.land/std@v0.204.0/path/mod.ts';
import { importMapPlugin } from './importMapPlugin.ts';

Deno.test("importMaps() when importMap is empty", () => {
  const plugin = importMapPlugin({});
  assertEquals(plugin.resolveId('./foo.ts', undefined), null);
});

Deno.test("importMaps() when importMap has imports", () => {
  const plugin = importMapPlugin({
    imports: {
      "react": "https://cdn.skypack.dev/react",
      "react/": "https://cdn.skypack.dev/react/",
    }
  });

  assertEquals(plugin.resolveId('react', undefined), 'https://cdn.skypack.dev/react');
  assertEquals(plugin.resolveId('react/client', undefined), 'https://cdn.skypack.dev/react/client');
});

Deno.test("importMaps() when importMap has relative alias", () => {
  const dirName = dirname(dirname(import.meta.url.substring(7)));

  const plugin = importMapPlugin({
    imports: {
      "@/": "./",
    }
  });

  assertEquals(plugin.resolveId('@/foo.ts', undefined), `${dirName}/foo.ts`);
});
