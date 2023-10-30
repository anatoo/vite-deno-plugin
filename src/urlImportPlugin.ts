export function urlImportPlugin() {
  const loader = new UrlImportLoader();

  return {
    name: 'vite:deno-url-import',
    enforce: 'pre',

    async resolveId(importee: string, importer: string | undefined) {
      if (importee.startsWith('https://')) {
        await loader.cache(importee);
      }

      return null;
    },

    async load(id: string) {
      if (id.startsWith('https://')) {
        const filename = await loader.load(id);

        if (typeof filename === 'string') {
          console.log("load success: ", id, "===>", filename);
          return Deno.readTextFileSync(filename);
        } else {
          console.log("load error: ", id);
          return null;
        }
      }
    },
  };
}

class UrlImportLoader {
  cacheMap = new Map<string, boolean>();
  loadCacheMap = new Map<string, string | null>();

  async cache(url: string): Promise<void> {
    if (this.cacheMap.has(url)) {
      return;
    }

    const output = await new Deno.Command(Deno.execPath(), { args: ['cache', url] }).output();
    const { code, stdout, stderr } = output;
    if (code !== 0) {
      console.log("cache error: ", url);
      throw new Error(new TextDecoder().decode(stderr));
    }
    console.log("cache success: ", url);
    console.log(new TextDecoder().decode(stdout));

    this.cacheMap.set(url, true);
  }


  async load(url: string): Promise<string | null> {
    if (this.loadCacheMap.has(url)) {
      return this.loadCacheMap.get(url) ?? null;
    }

    const output = await new Deno.Command(Deno.execPath(), { args: ['info', url, '--json'] }).output();
    const { code, stdout, stderr } = output;
    if (code !== 0) {
      console.log("load error: ", url);
      throw new Error(new TextDecoder().decode(stderr));
    }

    const info = JSON.parse(new TextDecoder().decode(stdout));
    for (const module of info.modules) {
      if (module.kind === 'esm') {
        const filename = module.local ?? module.emit;
        this.loadCacheMap.set(module.specifier, typeof filename === 'string' ? filename : null);
      }
    }

    return this.loadCacheMap.get(url) ?? null;
  }
}
