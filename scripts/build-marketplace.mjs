import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const catalogDir = path.join(rootDir, "catalog", "apps");
const siteDir = path.join(rootDir, "site", "app-marketplace");

const REQUIRED_TOP_LEVEL_FIELDS = [
  "id",
  "name",
  "type",
  "status",
  "visibility",
  "accessMode",
  "supportModel",
  "summary",
  "delivery",
  "requires",
  "customerConfig",
  "risks",
  "implementationGuide",
  "marketplace"
];

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadApps() {
  return readdirSync(catalogDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const app = JSON.parse(readFileSync(path.join(catalogDir, name), "utf8"));
      for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
        ensure(field in app, `${name}: missing field "${field}"`);
      }
      ensure(typeof app.marketplace.guidanceMode === "string", `${name}: marketplace.guidanceMode must be a string`);
      ensure(typeof app.marketplace.ctaLabel === "string", `${name}: marketplace.ctaLabel must be a string`);
      return app;
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ko"));
}

function buildCatalog(apps) {
  const publicApps = apps.filter((app) => app.marketplace.listed && app.visibility === "public");
  const privateApps = apps.filter((app) => app.marketplace.listed && app.visibility === "private");

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      all: apps.length,
      listed: apps.filter((app) => app.marketplace.listed).length,
      public: publicApps.length,
      private: privateApps.length
    },
    publicApps,
    privateApps
  };
}

function main() {
  mkdirSync(siteDir, { recursive: true });
  const apps = loadApps();
  const catalog = buildCatalog(apps);

  writeFileSync(path.join(siteDir, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  writeFileSync(path.join(siteDir, "catalog.js"), `window.__MARKETPLACE_CATALOG__ = ${JSON.stringify(catalog, null, 2)};\n`, "utf8");

  console.log(`Generated site/app-marketplace/catalog.json`);
  console.log(`Generated site/app-marketplace/catalog.js`);
}

main();
