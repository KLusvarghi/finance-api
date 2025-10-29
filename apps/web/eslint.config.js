import reactConfig from '@finance-app/eslint-config/react.js'

export default [
    ...reactConfig,
    {
        // Ignora a pasta de build e arquivos de configuração
        ignores: ['dist', '*.config.js', '*.config.ts'],
    },
    {
        // Configuração específica do TypeScript parser para o web app
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        // Regras específicas do web app (se necessário)
        rules: {
            // Mantém a regra do react-refresh como warning
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
]
