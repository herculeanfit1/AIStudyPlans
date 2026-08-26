// Flat config — replaces .eslintrc.json, which ESLint 9 no longer reads by default.
//
// WHY THIS CHANGED: the standards gate now descends into each directory that
// carries its own linter config and runs ESLint there. That surfaced the fact
// that this directory had never actually been linted: its .eslintrc.json
// declared @typescript-eslint 6 / ESLint 8, while the resolved runtime was
// ESLint 9, which threw
//   TypeError: Error while loading rule '@typescript-eslint/no-unused-expressions'
// before checking a single file. A green build and a linted directory were
// different claims, and only the first one was true.
//
// Every rule below is carried over from .eslintrc.json unchanged. The two
// `extends` entries map onto their v8 equivalents:
//   eslint:recommended                                -> js.configs.recommended
//   plugin:@typescript-eslint/recommended             -> tseslint.configs.recommended
//   plugin:@typescript-eslint/recommended-requiring-type-checking
//                                                     -> tseslint.configs.recommendedTypeChecked
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Flat config has no .eslintignore; ignores live here.
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.config.mjs"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // Type-aware rules below (no-unsafe-*, strict-boolean-expressions,
        // restrict-template-expressions) require a real program, so the
        // tsconfig reference is load-bearing rather than decorative.
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-param-reassign": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },
);
