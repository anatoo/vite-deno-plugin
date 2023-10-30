import { importMapPlugin } from './src/importMapPlugin.ts';
import { urlImportPlugin } from './src/urlImportPlugin.ts';
import { Config } from './src/types.ts';

const defaultConfig = {
  importMapFilename: "./deno.json",
} as const;

function viteDenoPlugin(config: Config = {}) {
  const { importMapFilename } = { ...defaultConfig, ...config };
  return [
    importMapPlugin({
      importMap: JSON.parse(Deno.readTextFileSync(importMapFilename)),
      importMapFilename,
    }),
    urlImportPlugin()
  ];
}

export default viteDenoPlugin;


