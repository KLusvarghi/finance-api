import baseConfig from './base.js';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import  reactRefresh  from  "eslint-plugin-react-refresh" ;


/** @type {import("eslint").Linter.Config[]} */
// export default tseslint.config(...baseConfig, {
export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Aplica estas regras a arquivos com sintaxe React
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      "react-refresh" : reactRefresh , 
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Habilita o parsing de JSX
        },
      },
      globals: {
        ...globals.browser, // Adiciona variaveis globais do ambiente de navegador (window, document, etc.)
      },
    },
    settings: {
      react: {
        version: 'detect', // Detecta automaticamente a versão do React instalada
      },
    },
    rules: {
      // 3. Importa as regras recomendadas de cada plugin
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,

      // 4. Adiciona customizações e overrides
      'react/react-in-jsx-scope': 'off', // Desabilitado pois não é mais necessário com o novo JSX Transform do React 17+
      'react/prop-types': 'off', // Desabilitado pois o TypeScript já faz a checagem de tipos das props
    },
  },
];
