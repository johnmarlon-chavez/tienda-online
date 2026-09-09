import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  // Si ya tienes "npm run dev" corriendo (como durante desarrollo normal),
  // Playwright lo reutiliza en vez de levantar uno nuevo. En CI siempre
  // arranca uno propio.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
