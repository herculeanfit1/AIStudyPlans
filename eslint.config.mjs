import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default tseslint.config(
  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Main source code config
  {
    files: [
      "app/**/*.{ts,tsx,js,jsx}",
      "components/**/*.{ts,tsx,js,jsx}",
      "lib/**/*.{ts,tsx,js,jsx}",
      "types/**/*.ts",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        JSX: "readonly",
        NodeJS: "readonly",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Next.js recommended rules (from @next/eslint-plugin-next)
      "@next/next/google-font-display": "warn",
      "@next/next/google-font-preconnect": "warn",
      "@next/next/next-script-for-ga": "warn",
      "@next/next/no-async-client-component": "warn",
      "@next/next/no-before-interactive-script-outside-document": "warn",
      "@next/next/no-css-tags": "warn",
      "@next/next/no-head-element": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "warn",
      "@next/next/no-styled-jsx-in-document": "warn",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-title-in-document-head": "warn",
      "@next/next/no-typos": "warn",
      "@next/next/no-unwanted-polyfillio": "warn",
      "@next/next/inline-script-id": "error",
      "@next/next/no-assign-module-variable": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-head-import-in-document": "error",
      "@next/next/no-script-component-in-head": "error",
      // Core-web-vitals: stricter no-html-link-for-pages
      "@next/next/no-html-link-for-pages": "error",

      // TypeScript — replaces unused-imports/no-unused-imports + @typescript-eslint/no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React (migrated from .eslintrc.json)
      "react/no-unescaped-entities": "off",

      // no-console not enforced (existing codebase uses console.log extensively)
    },
  },

  // Test files config (relaxed rules)
  {
    files: [
      "__tests__/**/*.{ts,tsx,js,jsx}",
      "**/*.test.{ts,tsx,js,jsx}",
      "**/*.spec.{ts,tsx,js,jsx}",
      "e2e/**/*.{ts,tsx,js,jsx}",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.cjs",
      "*.config.ts",
      "jest.config.*",
      "jest.setup.*",
      "postcss.config.*",
      "tailwind.config.*",
      "next.config.*",
      "__mocks__/**",
      "scripts/**",
      "public/**",
      "**/*.bak",
      "**/*.d.ts",
    ],
  }
);
