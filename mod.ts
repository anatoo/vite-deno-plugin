import { importMapPlugin } from "./src/importMapPlugin.ts";
import { urlImportPlugin } from "./src/urlImportPlugin.ts";
import { Config } from "./src/types.ts";
import { getDefaults, parseImportMapFile } from "./src/utils.ts";

function viteDenoPlugin(config: Config = {}) {
  const resolvedConfig = typeof config.importMapFilename === "string"
    ? config
    : { ...getDefaults(), ...config };
  const { importMapFilename } = resolvedConfig;

  const importMap = parseImportMapFile(importMapFilename);

  return [
    ...(
      typeof importMapFilename === "string"
        ? [importMapPlugin({ importMap, importMapFilename })]
        : []
    ),
    urlImportPlugin(),
  ];
}

export default viteDenoPlugin;
