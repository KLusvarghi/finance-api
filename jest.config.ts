import type { Config } from 'jest'

const config: Config = {
    // Usa o preset ESM do ts-jest, que já configura o transform pra você
    preset: 'ts-jest/presets/default-esm',

    // Node é o ambiente onde seu código roda
    testEnvironment: 'node',

    // Diz pro Jest: "Trat e arquivos .ts como ESM"
    extensionsToTreatAsEsm: ['.ts'],

    // Se você tiver aliases @/... no tsconfig, replique aqui:
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Nova configuração do ts-jest usando transform
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                // Aponta pro seu tsconfig e ativa o modo ESM
                tsconfig: 'tsconfig.json',
                useESM: true,
            },
        ],
    },

    // Onde o Jest deve procurar seus testes
    testMatch: [
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/src/**/*.spec.ts',
        '<rootDir>/*.test.ts',
        '<rootDir>/*.spec.ts',
    ],
    // com isso ele irá fazer a cobertura de testes de todos os arquivos .ts e não apenas os que estão no testMatch
    collectCoverageFrom: ['src/**/*.ts'],
}

export default config
