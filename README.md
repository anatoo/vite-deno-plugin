# vite-deno-plugin

A [Vite](https://vitejs.dev) plugin that can resolve Deno modules.

 - Run Vite without `node_modules` directory.
 - URL import just works.
 - Import map support.

## Motivation

Deno now supports npm module loading and can run Vite. However, the development experience with Deno is not consistent with Vite, as Vite tries to load modules from `node_modules`, which requires a `node_modules` directory and `--node-modules-dir` flag. By using this plugin, the same module resolution as in Deno can be used inside Vite.

## Getting Started

Configure a plugin in `vite.config.mts`(NOT `vite.config.ts`).

```typescript
import { defineConfig } from 'npm:vite@4.5.0';
import viteDeno from 'https://deno.land/x/vite_deno_plugin/mod.ts';

export default defineConfig({
  plugins: [viteDeno({})],
});
```

```bash
$ deno run -A npm:vite@4.5.0 . --config ./vite.config.mts
```

For more details, check out [React example](https://github.com/anatoo/vite-deno-plugin/tree/main/examples/react) directory.

## Config

### `importMapFilename`

Specify the filename of import map. Default value is `deno.json`.

```typescript
viteDeno({
  importMapFilename: "deno.json"
});
```

## Known Issues

 - Currently `npm:*` specifier is not supported. So you have to load npm modules via `https://esm.sh/` instead.

## Examples

 - [React](https://github.com/anatoo/vite-deno-plugin/tree/main/examples/react)
