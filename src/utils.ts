import { jsonc, valibot } from './deps.ts';

export const debug = Deno.env.get("DEBUG") === "true" ? (...args: unknown[]) => {
  console.log(...args);
} : () => {};


const importMapSchema = valibot.object({
  imports: valibot.optional(valibot.record(valibot.string(), valibot.string())),
});

export function parseImportMapFile(filename: string): valibot.Input<typeof importMapSchema> {
  return valibot.parse(importMapSchema, jsonc.parse(Deno.readTextFileSync(filename)));
}
