# vite-deno-plugin

A [Vite](https://vitejs.dev) plugin that can resolve Deno modules.

 - Run Vite without `node_modules` directory.
 - URL import just works.
 - Import map support.

## TODO

 - publish library
 - add various packages to test in examples

## Getting Started

Configure a plugin in `vite.config.mts`(NOT `vite.config.ts`).

```typescript
import { defineConfig } from 'npm:vite@3.2.4';
import viteDeno from 'mod.ts';

export default defineConfig({
  plugins: [viteDeno({})],
});
```

```bash
$ deno run -A npm:vite@3.2.4 . --config ./vite.config.mts
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

 - Currently `npm:*` specifier is not supported. So you have to use `https://esm.sh/` to load npm modules.

## Examples

 - [React](./examples/react)
