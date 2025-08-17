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
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Proíbe imports diretos de subdiretórios específicos, forçando uso do barrel
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/shared/types", "@/shared/response-messagens"],
              message: "Use o barrel '@/shared' em vez de importar diretamente de subdiretórios específicos."
            },
            {
              group: ["@/errors/user", "@/errors/transaction"],
              message: "Use o barrel '@/errors' em vez de importar diretamente de subdiretórios específicos."
            }
          ]
        }
      ],
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

  // === Configuração para ignorar arquivos Markdown ===
  {
    files: ["**/*.{md,mdc}"],
    ignores: ["**/*.{md,mdc}"],
  },
]);
