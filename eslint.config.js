import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js, "simple-import-sort": simpleImportSort, }, extends: ["js/recommended", "prettier"], rules: {
      "no-unused-vars": "off", "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    }, parserOptions: { ecmaVersion: "es2022", sourceType: "module" }
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
]);
