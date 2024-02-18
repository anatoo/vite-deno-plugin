import { dirname, resolve } from "./deps.ts";

// TODO: support scopes
type ImportMap = {
  imports?: Record<string, string>;
};

type Params = {
  importMap: ImportMap;
  importMapFilename: string;
};

export function importMapPlugin({ importMap, importMapFilename }: Params) {
  const baseDir = dirname(resolve(importMapFilename));
  const resolveImportMap = createImportMapResolver(importMap, baseDir);

  return {
    name: "vite:deno-import-map-plugin",
    resolveId(importee: string, _importer: string | undefined): string | null {
      return resolveImportMap(importee);
    },
  };
}

export function createImportMapResolver(importMap: ImportMap, baseDir: string) {
  const specifierMap = sortAndNormalizeSpecifierMap(
    importMap?.imports ?? {},
    baseDir,
  );

  const prefixMap = Object.fromEntries(
    Object.entries(specifierMap)
      .filter(([key, _]) => key.endsWith("/")),
  );

  return function resolve(importee: string): string | null {
    if (
      Object.hasOwn(specifierMap, importee) &&
      typeof specifierMap[importee] === "string"
    ) {
      return specifierMap[importee];
    }

    for (const [key, value] of Object.entries(prefixMap)) {
      if (importee.startsWith(key) && typeof value === "string") {
        return value + importee.slice(key.length);
      }
    }

    return null;
  };
}

function normalizeSpecifier(specifier: string, baseDir: string) {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const resolved = resolve(baseDir, specifier);
    return specifier.endsWith("/") ? `${resolved}/` : resolved;
  }

  return specifier;
}

function normalizeSpecifierKey(specifierKey: string, baseDir: string) {
  if (specifierKey === "") {
    console.warn(`Invalid empty string specifier key.`);
    return null;
  }

  if (specifierKey.startsWith("./") || specifierKey.startsWith("../")) {
    const resolved = resolve(baseDir, specifierKey);
    return specifierKey.endsWith("/") ? `${resolved}/` : resolved;
  }

  return specifierKey;
}

function sortAndNormalizeSpecifierMap(
  imports: Record<string, string>,
  baseDir: string,
): Record<string, string | null> {
  const normalized: Record<string, string | null> = {};
  for (const [specifierKey, value] of Object.entries(imports)) {
    const normalizedSpecifierKey = normalizeSpecifierKey(specifierKey, baseDir);
    if (normalizedSpecifierKey === null) {
      continue;
    }

    if (typeof value !== "string") {
      console.warn(
        `Invalid address ${
          JSON.stringify(value)
        } for the specifier key "${specifierKey}". ` +
          `Addresses must be strings.`,
      );
      normalized[normalizedSpecifierKey] = null;
      continue;
    }

    const normalizedSpecifier = normalizeSpecifier(value, baseDir);

    if (specifierKey.endsWith("/") && !normalizedSpecifierKey.endsWith("/")) {
      console.warn(
        `Invalid address "${normalizedSpecifier}" for package specifier key "${specifierKey}". ` +
          `Package addresses must end with "/".`,
      );
      normalized[normalizedSpecifierKey] = null;
      continue;
    }

    normalized[normalizedSpecifierKey] = normalizedSpecifier;
  }

  const sortedAndNormalized: Record<string, string | null> = {};
  const sortedKeys = Object.keys(normalized).sort((a, b) =>
    codeUnitCompare(b, a)
  );
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}

function codeUnitCompare(a: string, b: string) {
  if (a > b) {
    return 1;
  }

  if (b > a) {
    return -1;
  }

  throw new Error(
    "This should never be reached because this is only used on JSON object keys",
  );
}
