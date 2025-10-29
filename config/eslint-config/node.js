import baseConfig from './base.js';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(...baseConfig, {
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
}); 
