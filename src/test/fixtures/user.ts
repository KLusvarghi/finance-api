import { faker } from '@faker-js/faker'
import { CreateUserParams, UpdateUserParams } from '@/shared/types'

// Tipo para dados de entrada (sem id)
type CreateUserInput = Omit<CreateUserParams, 'id'>

// Dados válidos
export const createValidUserFixture = (): CreateUserInput => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }), // um char a mais que o mínimo
})

// Dados válidos para update (todos os campos são opcionais)
export const createValidUpdateUserFixture = (): Partial<UpdateUserParams> => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
})

// Dados inválidos para testes
export const invalidUserFixtures = {
    // Emails inválidos
    invalidEmails: [
        '', // vazio
        ' ', // espaço
        'not-an-email', // sem @
        'missing@', // sem domínio
        '@nodomain.com', // sem local part
        'spaces in@email.com', // espaço no local part
        'double@@email.com', // @ duplo
        'unicode@🙂.com', // emoji no domínio
        `${faker.string.alpha(95)}@test.com`, // > 100 chars
    ],

    // Nomes inválidos (first_name e last_name têm as mesmas regras)
    invalidNames: [
        '', // vazio
        ' ', // espaço
        '1', // um caractere (mínimo é 2)
        faker.string.alpha(51), // > 50 chars (limite do DB)
        '123456', // apenas números
        '@#$%', // apenas símbolos
        ' '.repeat(10), // apenas espaços
    ],

    // Senhas inválidas
    invalidPasswords: [
        '', // vazia
        ' ', // espaço
        'short', // < 6 chars
        faker.string.alpha(5), // exatamente 5 chars
        ' '.repeat(6), // 6 espaços
    ],

    // Casos especiais que devem ser válidos
    specialCases: {
        names: [
            "O'Connor", // apóstrofo
            'João-Maria', // hífen
            'Smith Jr.', // ponto
            'María José', // acento
            'Jean-Pierre', // hífen
            'McDonald', // CamelCase
        ],
        emails: [
            'user+tag@domain.com', // + no email
            'user.name@domain.com', // ponto no local part
            'user@sub.domain.com', // subdomínio
            '12345@domain.com', // números no local part
            'user@domain.co.uk', // múltiplos pontos no domínio
        ],
    },
}

// Helper para gerar dados inválidos mantendo um campo específico válido
export const createInvalidUserFixtureExcept = (
    validField: keyof CreateUserInput,
): CreateUserInput => {
    const base = {
        first_name: invalidUserFixtures.invalidNames[0],
        last_name: invalidUserFixtures.invalidNames[0],
        email: invalidUserFixtures.invalidEmails[0],
        password: invalidUserFixtures.invalidPasswords[0],
    }

    return {
        ...base,
        [validField]: createValidUserFixture()[validField],
    }
}
