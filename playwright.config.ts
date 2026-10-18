import { defineConfig, devices } from "@playwright/test";

/**
 * E2E runs against a production build (`next start`). The build mode is chosen by E2E_MODE:
 *   production — default content (what the public site shows today)
 *   preview    — FOUNDEROS_DEMO_CONTENT=true (drafts + DEMO_ONLY fixtures)
 *   form       — contact delivery configured, pointed at a local mock provider
 * `scripts/e2e.sh` builds and runs all three. Each spec declares which modes it applies to.
 *
 * PLAYWRIGHT_CHROMIUM_PATH lets you use an existing Chromium when `npx playwright install` is unavailable.
 */
const port = Number(process.env.E2E_PORT ?? 3210);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "off",
    launchOptions: executablePath
      ? { executablePath, args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader"] }
      : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
