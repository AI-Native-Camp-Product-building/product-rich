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
  "marketplace"
];

// 카테고리 정렬 순서
const CATEGORY_ORDER = ["design", "hide", "addon", "automation"];

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

      // 필수 필드 검증
      for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
        ensure(field in app, `${name}: missing field "${field}"`);
      }
      ensure(typeof app.marketplace.guidanceMode === "string", `${name}: marketplace.guidanceMode must be a string`);
      ensure(typeof app.marketplace.ctaLabel === "string", `${name}: marketplace.ctaLabel must be a string`);

      // appType 기본값
      if (!app.appType) {
        app.appType = "single";
      }

      // bundle 검증
      if (app.appType === "bundle") {
        ensure(Array.isArray(app.features) && app.features.length > 0, `${name}: bundle app must have non-empty features array`);
        for (const feature of app.features) {
          ensure(typeof feature.id === "string", `${name}: feature must have string id`);
          ensure(typeof feature.name === "string", `${name}: feature must have string name`);
        }
      }

      return app;
    })
    .sort((left, right) => {
      // 카테고리 순서 우선, 같은 카테고리 내에서 한글 이름순
      const catA = CATEGORY_ORDER.indexOf(left.marketplace.category);
      const catB = CATEGORY_ORDER.indexOf(right.marketplace.category);
      const orderA = catA === -1 ? 999 : catA;
      const orderB = catB === -1 ? 999 : catB;
      if (orderA !== orderB) return orderA - orderB;
      return left.name.localeCompare(right.name, "ko");
    });
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
  console.log(`  Total: ${catalog.totals.all} apps (${catalog.totals.public} public, ${catalog.totals.private} private)`);
}

main();
