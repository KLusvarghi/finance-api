import { defineConfig } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    // Ignorar arquivos e diretórios específicos
    {
        ignores: [
            '**/*.{md,mdc}',
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            '**/*.log',
            'generated/',
            '*.log',
        ],
    },

    // Regras de TS via @typescript-eslint (vem primeiro)
    tseslint.configs.recommended,

    // Regra geral para código fonte (vem depois para sobrescrever)
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {
            'simple-import-sort': simpleImportSort,
            'unused-imports': unusedImports,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.browser,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // '@typescript-eslint/no-unused-vars': [
            //     'error',
            //     {
            //         // Não sinalizar argumentos de funções/métodos
            //         args: 'none',
            //         // Ignore argumentos/variáveis que comecem com _
            //         argsIgnorePattern: '^_',
            //         varsIgnorePattern: '^_',
            //         // Adicionar esta opção para permitir fix automático
            //         ignoreRestSiblings: true,
            //         // Adicionar esta opção para detectar imports de tipos não utilizados
            //     },
            // ],
            // Desabilitar a regra de variáveis não utilizadas do TypeScript
            // '@typescript-eslint/no-unused-vars': 'off',
            // '@typescript-eslint/no-explicit-any': 'off',

            // Usar o plugin unused-imports para detectar e remover imports não utilizados
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // Configuração completa do simple-import-sort
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // Node.js built-ins
                        ['^node:'],
                        // Dependências externas
                        ['^[a-zA-Z]'],
                        // Imports relativos
                        ['^\\.'],
                        // Imports absolutos com @
                        ['^@'],
                        // Imports de tipos TypeScript
                        ['^@types/'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
            // Permitir variáveis com underscore no início (ex: _password, _userId)
            'no-underscore-dangle': 'off',
            // Proíbe imports diretos de subdiretórios específicos, forçando uso do barrel
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: [
                                '@/shared/*',
                                '@/errors/*',
                                '@/repositories/postgres/*',
                                '@/factories/controllers/*',
                                '@/services/*',
                                '@/controllers/_helpers/*',
                                '@/controllers/*',
                                '@/schemas/*',
                                '@/test/*',
                                '@/adapters/*',
                                '@/routes/*',
                            ],
                            message:
                                'Use o barrel em vez de importar diretamente de subdiretórios específicos.',
                        },
                    ],
                },
            ],
        },
    },
])
