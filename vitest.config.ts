import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.tsx"],
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["__tests__/e2e/**", "e2e/**", "**/*.e2e.{test,spec}.{ts,tsx}"],
    retry: 2,
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "node_modules/**",
        ".next/**",
        "out/**",
        "scripts/**",
        "e2e/**",
        "public/**",
        "__mocks__/**",
      ],
      thresholds: {
        lines: process.env.CI ? 0 : 70,
        branches: process.env.CI ? 0 : 70,
        functions: process.env.CI ? 0 : 70,
        statements: process.env.CI ? 0 : 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
