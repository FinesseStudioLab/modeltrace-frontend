import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // A test that only passes on a retry locally is a test that will fail in CI
  // eventually; forbidding .only and retrying only in CI keeps that honest.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // The mobile project exists for the menu and layout behaviour, which is
    // where a desktop-only suite quietly stops covering anything.
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    // Production build, not the dev server. The dev server has different
    // hydration timing, no minification, and its own error overlay, so a
    // suite green against it says little about what ships.
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
