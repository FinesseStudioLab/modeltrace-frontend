import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/": `${resolve(__dirname)}/`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // E2E lives in e2e/ and is Playwright's; keeping the boundary explicit
    // stops `npm test` from trying to run browser specs in jsdom.
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    css: true,
  },
});
