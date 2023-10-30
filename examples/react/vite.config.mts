import { defineConfig } from 'npm:vite@3.2.4';
import react from 'npm:@vitejs/plugin-react';
import viteDeno from '../../mod.ts';
import { dirname } from 'https://deno.land/std/path/mod.ts';

const __dirname = dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [
    viteDeno({
      importMapFilename: __dirname + '/deno.json',
    }),
    react({
      jsxImportSource: 'react',
    })
  ],
});
