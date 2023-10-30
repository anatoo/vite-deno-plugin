
export const debug = Deno.env.get("DEBUG") === "true" ? (...args: any[]) => {
  console.log(...args);
} : () => {};
