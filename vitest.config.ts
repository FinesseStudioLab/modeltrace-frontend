import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirrors tsconfig.json's `"@/*": ["./*"]`. Without this, "@/..." imports
    // resolve fine under Next.js's own bundler (which reads tsconfig paths)
    // but fail under Vite/Vitest, which does not — a component that only
    // ever gets rendered through a unit test can carry a broken import for a
    // long time before anything notices.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
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
