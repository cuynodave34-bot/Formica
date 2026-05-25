import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const dockerCandidates = [
  "docker",
  "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe",
];

function runDocker(args) {
  const errors = [];

  for (const candidate of dockerCandidates) {
    if (candidate !== "docker" && !existsSync(candidate)) {
      continue;
    }

    try {
      return execFileSync(candidate, args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      errors.push(error.stderr?.toString() || error.message);
    }
  }

  throw new Error(errors.join("\n") || "Docker CLI was not found.");
}

try {
  const version = runDocker([
    "version",
    "--format",
    "{{.Client.Version}} / {{.Server.Version}}",
  ]).trim();
  const info = runDocker(["info", "--format", "{{.OperatingSystem}} | {{.OSType}}"]).trim();
  console.log(`Docker ready: ${version}`);
  console.log(`Engine: ${info}`);
} catch (error) {
  console.error("Docker is not ready for Supabase local development.");
  console.error(error.message);
  process.exit(1);
}
