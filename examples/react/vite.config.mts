import { defineConfig } from 'npm:vite@3.2.4';
import react from 'npm:@vitejs/plugin-react';
import viteDeno from '../../mod.ts';

export default defineConfig({
  plugins: [viteDeno(), react({
    jsxImportSource: 'react',
  })],
});
