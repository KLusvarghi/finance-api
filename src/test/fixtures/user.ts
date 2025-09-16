import { prisma } from '../../../prisma/prisma'

import { faker } from '@faker-js/faker'

export const userId = faker.string.uuid()

// ============================================================================
// PARAMS
// ============================================================================

export const createUserParams = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
}

export const updateUserParams = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
}

// ============================================================================
// SHARED DATA (Base para responses)
// ============================================================================

export const userResponse = {
    id: userId,
    firstName: createUserParams.firstName,
    lastName: createUserParams.lastName,
    email: createUserParams.email,
}

export const userBalanceResponse = {
    earnings: String(faker.number.float()),
    expenses: String(faker.number.float()),
    investments: String(faker.number.float()),
    balance: String(faker.number.float()),
    earningsPercentage: faker.number.float(),
    expensesPercentage: faker.number.float(),
    investmentsPercentage: faker.number.float(),
}

// ============================================================================
// REPOSITORY RESPONSES
// ============================================================================

export const createUserRepositoryResponse = {
    id: userId,
    ...createUserParams,
    password: 'valid_hash',
}

export const deleteUserRepositoryResponse = {
    id: userId,
    firstName: createUserParams.firstName,
    lastName: createUserParams.lastName,
    email: createUserParams.email,
    password: 'valid_hash',
}

export const getUserByIdRepositoryResponse = {
    id: userId,
    firstName: createUserParams.firstName,
    lastName: createUserParams.lastName,
    email: createUserParams.email,
    password: 'valid_hash',
}

export const updateUserRepositoryResponse = {
    id: userId,
    firstName: updateUserParams.firstName,
    lastName: updateUserParams.lastName,
    email: updateUserParams.email,
    password: 'valid_hash',
}

// ============================================================================
// TOKENS ADAPTER RESPONSE
// ============================================================================

const generateMockJWT = (): string => {
    const header = faker.string.alphanumeric(36)
    const payload = faker.string.alphanumeric(128)
    const signature = faker.string.alphanumeric(43)
    return `${header}.${payload}.${signature}`
}

export const tokensGeneratorAdapterResponse = {
    accessToken: generateMockJWT(),
    refreshToken: generateMockJWT(),
}

// ============================================================================
// UNIFIED RESPONSES (Service + Controller)
// ============================================================================

const createUserResponse = {
    id: createUserRepositoryResponse.id,
    firstName: createUserRepositoryResponse.firstName,
    lastName: createUserRepositoryResponse.lastName,
    email: createUserRepositoryResponse.email,
    tokens: tokensGeneratorAdapterResponse,
}

const deleteUserResponse = userResponse
const getUserByIdResponse = userResponse
const updateUserResponse = {
    id: userId,
    firstName: updateUserParams.firstName,
    lastName: updateUserParams.lastName,
    email: updateUserParams.email,
}
const getUserBalanceResponse = userBalanceResponse

// ============================================================================
// LEGACY EXPORTS (Para manter compatibilidade)
// ============================================================================

// Service responses
export const createUserServiceResponse = createUserResponse
export const deleteUserServiceResponse = deleteUserResponse
export const getUserBalanceServiceResponse = getUserBalanceResponse
export const getUserByIdServiceResponse = getUserByIdResponse
export const updateUserServiceResponse = updateUserResponse

// Controller responses
export const createUserControllerResponse = createUserResponse
export const deleteUserControllerResponse = deleteUserResponse
export const getUserBalanceControllerResponse = getUserBalanceResponse
export const updateUserControllerResponse = updateUserResponse

// ============================================================================
// BASE HTTP REQUEST
// ============================================================================

export const createUserHttpRequest = {
    body: createUserParams,
}

export const deleteUserHttpRequest = {
    headers: { userId },
}

export const getUserBalanceHttpRequest = {
    headers: { userId },
    query: {
        from: '2025-08-01',
        to: '2025-08-08',
    },
}

export const getUserByIdHttpRequest = {
    headers: { userId },
}

export const updateUserHttpRequest = {
    headers: { userId },
    body: updateUserParams,
}

export const loginUserHttpRequest = {
    body: {
        email: createUserRepositoryResponse.email,
        password: createUserRepositoryResponse.password,
    },
}

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Cria um usuário no banco de dados para testes
 * @param customData - Dados customizados para sobrescrever os padrões
 * @returns Promise com o usuário criado
 */
export const createTestUser = async (
    customData?: Partial<typeof createUserRepositoryResponse>,
) => {
    return await prisma.user.create({
        data: {
            ...createUserRepositoryResponse,
            ...customData,
        },
    })
}
