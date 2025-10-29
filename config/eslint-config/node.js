import baseConfig from './base.js';
// Not needed here – tseslint is only required in base.js to provide the parser and recommended configs for all Node targets.
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
// export default tseslint.config(...baseConfig, {
export default [
  ...baseConfig,
  {
    // Objeto de ignores específico para a API
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
];
