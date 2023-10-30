# vite-deno-plugin

A [Vite](https://vitejs.dev) plugin that can resolve Deno modules.

 - Run Vite without `node_modules` directory.
 - URL import just works.
 - Import map support.

## Getting Started

Configure a plugin in `vite.config.mts`(NOT `vite.config.ts`).

```typescript
import { defineConfig } from 'npm:vite@4.5.0';
import viteDeno from 'https://deno.land/x/vite_deno_plugin@v0.9.1/mod.ts';

export default defineConfig({
  plugins: [viteDeno({})],
});
```

```bash
$ deno run -A npm:vite@4.5.0 . --config ./vite.config.mts
```

For more details, check out [React example](`./examples/react`) directory.

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

 - [React](./examples/react)
