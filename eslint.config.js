import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import jestPlugin from "eslint-plugin-jest";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Regra geral para código fonte
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      "simple-import-sort": simpleImportSort,
    },
    extends: ["js/recommended", "prettier"],
    rules: {
      "no-unused-vars": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    parserOptions: {
      ecmaVersion: "es2022",
      sourceType: "module",
    },
  },

  // Globals de browser (se ainda precisar em algum contexto)
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Regras de TS via @typescript-eslint
  tseslint.configs.recommended,

  // === Novo bloco para testes Jest ===
  {
    // só aplica em arquivos .test.ts/.spec.ts
    files: ["**/*.test.ts", "**/*.spec.ts"],
    plugins: {
      jest: jestPlugin,
      "simple-import-sort": simpleImportSort,
    },
    extends: [
      "plugin:jest/recommended",     // habilita linter de regras Jest
      "plugin:jest/style",           // regras de estilo Jest
    ],
    env: {
      jest: true,                    // habilita globals do Jest
      node: true,
    },
    rules: {
      // Aqui você pode customizar regras específicas de teste, ex:
      "jest/expect-expect": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
    },
  },
]);
