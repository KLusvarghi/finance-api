import nodeConfig from '@finance-app/eslint-config/node.js'
import reactConfig from '@finance-app/eslint-config/react.js'

// ESLint config para a raiz do monorepo
export default [
  // Ignora diretórios comuns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
    ],
  },

  // Aplica configs dos workspaces
  ...nodeConfig.map(config => ({
    ...config,
    files: config.files || ['*.js', '*.mjs', '*.ts', 'apps/api/**/*.ts'],
  })),

  ...reactConfig.map(config => ({
    ...config,
    files: config.files || ['apps/web/**/*.{ts,tsx,js,jsx}'],
  })),
]
