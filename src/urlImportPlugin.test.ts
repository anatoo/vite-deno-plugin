import { urlImportPlugin, UrlImportLoader } from './urlImportPlugin.ts';
import { assertSpyCall } from "https://deno.land/x/mock@0.15.2/mod.ts";
import { assertEquals } from "https://deno.land/std@v0.204.0/testing/asserts.ts";
import { stub } from "https://deno.land/x/mock@0.15.2/mock.ts";

Deno.test('urlImportPlugin() ', async () => {
  const loader = new UrlImportLoader();
  const plugin = urlImportPlugin({ loader });
  const cache = stub(loader, 'cache');
  stub(loader, 'load');

  await plugin.resolveId('https://esm.sh/react', undefined);

  assertSpyCall(cache, 0, {
    args: ['https://esm.sh/react?dev=']
  });

  assertEquals(await plugin.resolveId('./foobar.ts', undefined), null);
});
