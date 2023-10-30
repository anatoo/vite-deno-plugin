# React example 

This example shows how to run [Vite](https://vitejs.dev) and React with deno-vite-plugin.

To start this example, run:

```bash
$ deno task dev
```

Refer to the [`./deno.json`](./deno.json) for the other tasks.

## Available tasks

 - `deno task dev`: start dev server
 - `deno task build`: build for production
 - `deno task preview`: preview production build

## How to add a dependency

Just add the dependency to imports field in `deno.json`.

```json
{
  "imports": {
    "wouter": "https://esm.sh/wouter@2.12.0"
  }
}
```

And import it.

```tsx
import * as wouter from "wouter";
```

Or you can import from URL directly.

```tsx
import * as wouter from "https://esm.sh/wouter@2.12.0";
```
