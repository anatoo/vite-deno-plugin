import { importMapPlugin } from './src/importMapPlugin.ts';
import { urlImportPlugin } from './src/urlImportPlugin.ts';
import { Config } from './src/types.ts';
import { parseImportMapFile } from './src/utils.ts';

const defaultConfig = {
  importMapFilename: "./deno.json",
} as const;

function viteDenoPlugin(config: Config = {}) {
  const { importMapFilename } = { ...defaultConfig, ...config };
  const importMap = parseImportMapFile(importMapFilename);

  return [
    importMapPlugin({
      importMap,
      importMapFilename,
    }),
    urlImportPlugin()
  ];
}

export default viteDenoPlugin;


