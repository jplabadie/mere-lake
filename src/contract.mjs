import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function loadContract(root = join(dirname(fileURLToPath(import.meta.url)), "..")) {
  const manifest = JSON.parse(readFileSync(join(root, "founding/manifest.json"), "utf8"));
  for (const key of ["teamPhases", "requiredChecks", "invariants", "layers", "datasets"]) {
    if (!Array.isArray(manifest[key]) || manifest[key].length === 0) {
      throw new Error(`Mere contract: ${key} is empty.`);
    }
  }
  return manifest;
}
