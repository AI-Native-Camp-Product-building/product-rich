import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceRoot = path.resolve(rootDir, "..", "feature-workarounds");
const targetDir = path.join(rootDir, "catalog", "apps");

function main() {
  if (!existsSync(sourceRoot)) {
    throw new Error(`feature-workarounds repo not found at ${sourceRoot}`);
  }

  mkdirSync(targetDir, { recursive: true });

  const pluginFiles = readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => path.join(sourceRoot, entry.name, "plugin.json"))
    .filter((candidate) => existsSync(candidate));

  for (const pluginFile of pluginFiles) {
    const targetPath = path.join(targetDir, `${path.basename(path.dirname(pluginFile))}.json`);
    cpSync(pluginFile, targetPath);
    console.log(`Imported ${path.relative(rootDir, targetPath)}`);
  }
}

main();
