import globals from "globals";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Regras de TS via @typescript-eslint (vem primeiro)
  tseslint.configs.recommended,

  // Regra geral para código fonte (vem depois para sobrescrever)
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
      // Desabilitar a regra de variáveis não utilizadas do TypeScript
      "@typescript-eslint/no-unused-vars": "off",
      // Configuração completa do simple-import-sort
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js built-ins
            ["^node:"],
            // Dependências externas
            ["^[a-zA-Z]"],
            // Imports relativos
            ["^\\."],
            // Imports absolutos com @
            ["^@"],
            // Imports de tipos TypeScript
            ["^@types/"],
          ]
        }
      ],
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

  // === Configuração para ignorar arquivos Markdown ===
  {
    files: ["**/*.{md,mdc}"],
    ignores: ["**/*.{md,mdc}"],
  },
]);
