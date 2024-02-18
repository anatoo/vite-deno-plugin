import { jsonc, valibot } from "./deps.ts";

export const debug = Deno.env.get("DEBUG") === "true"
  ? (...args: unknown[]) => {
    console.log(...args);
  }
  : () => {};

const importMapSchema = valibot.object({
  imports: valibot.optional(valibot.record(valibot.string(), valibot.string())),
});

export function parseImportMapFile(
  filename?: string,
): valibot.Input<typeof importMapSchema> {
  return valibot.parse(
    importMapSchema,
    typeof filename === "string"
      ? jsonc.parse(Deno.readTextFileSync(filename))
      : {},
  );
}

export function getDefaults() {
  try {
    const { isFile } = Deno.statSync("./deno.json");
    return {
      importMapFilename: isFile ? "./deno.json" : undefined,
    };
  } catch {
    return {};
  }
}
