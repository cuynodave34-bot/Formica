import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredPaths = [
  "AGENTS.md",
  "plan.md",
  "audit.md",
  "README.md",
  "metro.config.js",
  ".env.example",
  ".github/workflows/ci.yml",
  ".codex/environments/environment.toml",
  "app/_layout.tsx",
  "app/(tabs)/_layout.tsx",
  "app/(tabs)/index.tsx",
  "app/(tabs)/chambers.tsx",
  "app/(tabs)/trails.tsx",
  "app/(tabs)/mounds.tsx",
  "app/(tabs)/reports.tsx",
  "app/(tabs)/settings.tsx",
  "src/components/card.tsx",
  "src/components/screen.tsx",
  "src/db/supabase/client.ts",
  "src/theme/colors.ts",
  "src/theme/format.ts",
  "supabase/config.toml",
  "supabase/seed.sql",
  "supabase/migrations/20260525050609_initial_formica_schema.sql",
  "docs/phase-0-1-closeout.md",
];

const forbiddenSecretPatterns = [
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/,
  /sbp_[A-Za-z0-9_-]+/,
  /bn0udl/i,
  /T78qEa/i,
  /db504015/i,
];

const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));
if (missing.length > 0) {
  throw new Error(`Missing Phase 0/1 files:\n${missing.join("\n")}`);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (packageJson.dependencies.expo !== "~54.0.23") {
  throw new Error(`Expected Expo SDK 54 dependency ~54.0.23, got ${packageJson.dependencies.expo}`);
}
if (packageJson.dependencies.react !== "19.1.0") {
  throw new Error(`Expected React 19.1.0, got ${packageJson.dependencies.react}`);
}
if (packageJson.dependencies["react-native"] !== "0.81.5") {
  throw new Error(`Expected React Native 0.81.5, got ${packageJson.dependencies["react-native"]}`);
}

for (const path of requiredPaths) {
  const content = readFileSync(join(root, path), "utf8");
  for (const pattern of forbiddenSecretPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Forbidden secret-like pattern found in ${path}: ${pattern}`);
    }
  }
}

console.log("Phase 0/1 file, SDK, and secret checks passed.");
