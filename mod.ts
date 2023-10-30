import { importMapPlugin } from './src/importMapPlugin.ts';
import { urlImportPlugin } from './src/urlImportPlugin.ts';

interface Config {
  importMapFilename?: string;
}

const defaultConfig = {
  importMapFilename: "./deno.json",
} as const;

function viteDenoPlugin(config: Config = {}) {
  const { importMapFilename } = { ...defaultConfig, ...config };
  return [importMapPlugin(JSON.parse(Deno.readTextFileSync(importMapFilename))), urlImportPlugin()];
}

export default viteDenoPlugin;


