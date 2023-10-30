import { debug } from './utils.ts';
import type { ResolvedConfig, Plugin } from 'npm:vite@3.2.4';

export function urlImportPlugin(): Plugin {
  const loader = new UrlImportLoader();
  let config: ResolvedConfig;

  return {
    name: 'vite:deno-url-import',
    enforce: 'pre',

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
    },

    async resolveId(importee: string, importer: string | undefined) {
      if (importer?.startsWith('https://') && importee.startsWith('/')) {
        const url = new URL(importee, importer);
        if (url.hostname === 'esm.sh' && config.mode === 'development') {
          url.searchParams.set('dev', '');
        }
        debug('resolve success:', importee, '===>', url.toString());
        await loader.cache(url.toString());
        return url.toString();
      }
      
      if (importee.startsWith('https://')) {
        const url = new URL(importee);
        if (url.hostname === 'esm.sh' && config.mode === 'development') {
          url.searchParams.set('dev', '');
        }
        await loader.cache(url.toString());
        return url.toString();
      }

      return null;
    },

    async load(id: string) {
      if (id.startsWith('https://')) {
        const filename = await loader.load(id);

        if (typeof filename === 'string') {
          debug("load success: ", id, "===>", filename);
          return Deno.readTextFileSync(filename);
        } else {
          debug("load error: ", id);
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

    const output = await new Deno.Command(Deno.execPath(), {
      args: ['cache', url],
      stdout: 'inherit',
      stderr: 'inherit',
    }).output();
    const { code } = output;
    if (code !== 0) {
      console.error("cache error: ", url);
      throw new Error();
    }
    debug("cache success: ", url);

    this.cacheMap.set(url, true);
  }


  async load(url: string): Promise<string | null> {
    if (this.loadCacheMap.has(url)) {
      return this.loadCacheMap.get(url) ?? null;
    }

    const output = await new Deno.Command(Deno.execPath(), {
      args: ['info', url, '--json'],
      stderr: 'inherit',
    }).output();
    const { code, stdout } = output;
    if (code !== 0) {
      throw new Error('load error: ' + url);
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

