import { resolve } from 'https://deno.land/std@0.204.0/path/resolve.ts';

type ImportMap = {
  imports?: Record<string, string>;
};

export function importMapPlugin(importMap: ImportMap) {
  return {
    name: "vite:deno-import-map-plugin",
    config() {
      const alias = Object.fromEntries(
        Object.entries(importMap?.imports ?? {})
          .map(([key, value]) => [key, resolvePath(value)])
      );

      return {
        resolve: { alias },
      };
    },
  };
}

function resolvePath(path: string) {
  if (isLocalImport(path)) {
    const res = resolve(path);
    if (path.endsWith("/")) {
      return `${res}/`;
    } else {
      return res;
    }
  } else {
    return path;
  }
}

function isLocalImport(path: string) {
  return ["./", "../"].some((it) => path.startsWith(it));
}
