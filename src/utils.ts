
export const debug = Deno.env.get("DEBUG") === "true" ? (...args: unknown[]) => {
  console.log(...args);
} : () => {};
