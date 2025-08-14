import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

export const userId = faker.string.uuid()

// ============================================================================
// PARAMS
// ============================================================================

export const createUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
}

export const updateUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
}

// ============================================================================
// SHARED DATA (Base para responses)
// ============================================================================

export const userResponse = {
    id: userId,
    first_name: createUserParams.first_name,
    last_name: createUserParams.last_name,
    email: createUserParams.email,
}

export const userBalanceResponse = {
    earnings: faker.number.float(),
    expenses: faker.number.float(),
    investments: faker.number.float(),
    balance: new Prisma.Decimal(faker.number.float()),
}

// ============================================================================
// REPOSITORY RESPONSES
// ============================================================================

export const createUserRepositoryResponse = {
    id: faker.string.uuid(),
    ...createUserParams,
    password: 'valid_hash',
}

export const deleteUserRepositoryResponse = {
    id: userId,
    first_name: createUserParams.first_name,
    last_name: createUserParams.last_name,
    email: createUserParams.email,
    password: 'valid_hash',
}

export const getUserByIdRepositoryResponse = {
    id: userId,
    first_name: createUserParams.first_name,
    last_name: createUserParams.last_name,
    email: createUserParams.email,
    password: 'valid_hash',
}

export const updateUserRepositoryResponse = {
    id: userId,
    first_name: updateUserParams.first_name,
    last_name: updateUserParams.last_name,
    email: updateUserParams.email,
    password: 'valid_hash',
}

// ============================================================================
// UNIFIED RESPONSES (Service + Controller)
// ============================================================================

const createUserResponse = {
    id: createUserRepositoryResponse.id,
    first_name: createUserRepositoryResponse.first_name,
    last_name: createUserRepositoryResponse.last_name,
    email: createUserRepositoryResponse.email,
}

const deleteUserResponse = userResponse
const getUserByIdResponse = userResponse
const updateUserResponse = {
    id: userId,
    first_name: updateUserParams.first_name,
    last_name: updateUserParams.last_name,
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
    params: { userId },
}

export const getUserBalanceHttpRequest = {
    params: { userId },
}

export const getUserByIdHttpRequest = {
    params: { userId },
}

export const updateUserHttpRequest = {
    params: { userId },
    body: updateUserParams,
}
