import { prisma } from '../../../prisma/prisma'
import { userId } from './user'

import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

export const transactionId = faker.string.uuid()

// ============================================================================
// PARAMS
// ============================================================================

export const createTransactionParams = {
    name: faker.lorem.words(3),
    amount: faker.number.int({ min: 1, max: 1000 }),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
}

export const createTransactionServiceParams = {
    ...createTransactionParams,
    userId: userId,
}

export const updateTransactionParams = {
    name: faker.lorem.words(3),
    amount: faker.number.int({ min: 1, max: 1000 }),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
}

// ============================================================================
// SHARED DATA (Base para responses)
// ============================================================================

export const transactionResponse = {
    id: transactionId,
    userId: createTransactionServiceParams.userId,
    name: createTransactionServiceParams.name,
    amount: new Prisma.Decimal(createTransactionServiceParams.amount),
    date: new Date(createTransactionServiceParams.date),
    type: createTransactionServiceParams.type as
        | 'EARNING'
        | 'EXPENSE'
        | 'INVESTMENT',
    updatedAt: new Date(),
}

export const transactionListResponse = [
    {
        id: faker.string.uuid(),
        userId: userId,
        name: faker.lorem.words(3),
        amount: new Prisma.Decimal(faker.number.int({ min: 1, max: 1000 })),
        date: faker.date.recent(),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
        updatedAt: new Date(),
    },
]

// ============================================================================
// REPOSITORY RESPONSES
// ============================================================================

export const createTransactionRepositoryResponse = {
    id: transactionId,
    userId: createTransactionServiceParams.userId,
    name: createTransactionServiceParams.name,
    amount: new Prisma.Decimal(createTransactionServiceParams.amount),
    date: new Date(createTransactionServiceParams.date),
    type: createTransactionServiceParams.type as
        | 'EARNING'
        | 'EXPENSE'
        | 'INVESTMENT',
    deletedAt: null,
    updatedAt: new Date(),
}

export const deleteTransactionRepositoryResponse = {
    id: transactionId,
    userId: faker.string.uuid(),
    name: faker.lorem.words(3),
    amount: new Prisma.Decimal(faker.number.int({ min: 1, max: 1000 })),
    date: faker.date.recent(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    deletedAt: null,
    updatedAt: new Date(),
}

export const getTransactionByUserIdRepositoryResponse = transactionListResponse

export const updateTransactionRepositoryResponse = {
    id: transactionId,
    userId: userId,
    name: updateTransactionParams.name || '',
    amount: new Prisma.Decimal(updateTransactionParams.amount || 0),
    date: new Date(updateTransactionParams.date || ''),
    type: updateTransactionParams.type as Prisma.TransactionGetPayload<object>['type'],
    deletedAt: null,
    updatedAt: new Date(),
}

// ============================================================================
// UNIFIED RESPONSES (Service + Controller)
// ============================================================================

const createTransactionResponse = transactionResponse
const deleteTransactionResponse = {
    id: deleteTransactionRepositoryResponse.id,
    userId: deleteTransactionRepositoryResponse.userId,
    name: deleteTransactionRepositoryResponse.name,
    amount: deleteTransactionRepositoryResponse.amount,
    date: deleteTransactionRepositoryResponse.date,
    type: deleteTransactionRepositoryResponse.type,
    updatedAt: deleteTransactionRepositoryResponse.updatedAt,
}
const getTransactionsByUserIdResponse = transactionListResponse
const updateTransactionResponse = {
    id: updateTransactionRepositoryResponse.id,
    userId: updateTransactionRepositoryResponse.userId,
    name: updateTransactionRepositoryResponse.name,
    amount: updateTransactionRepositoryResponse.amount,
    date: updateTransactionRepositoryResponse.date,
    type: updateTransactionRepositoryResponse.type,
    updatedAt: updateTransactionRepositoryResponse.updatedAt,
}

// ============================================================================
// LEGACY EXPORTS (Para manter compatibilidade)
// ============================================================================

// Service responses
export const createTransactionServiceResponse = createTransactionResponse
export const deleteTransactionServiceResponse = deleteTransactionResponse
export const getTransactionByUserIdServiceResponse =
    getTransactionsByUserIdResponse
export const updateTransactionServiceResponse = updateTransactionResponse

// Controller responses
export const createTransactionControllerResponse = createTransactionResponse
export const deleteTransactionControllerResponse = deleteTransactionResponse
export const getTransactionsByUserIdControllerResponse =
    getTransactionsByUserIdResponse
export const updateTransactionControllerResponse = updateTransactionResponse

// ============================================================================
// BASE HTTP REQUEST
// ============================================================================

export const createTransactionHttpRequest = {
    body: createTransactionParams,
    headers: { userId },
}

export const deleteTransactionHttpRequest = {
    params: { transactionId },
    headers: { userId },
}

export const getTransactionsByUserIdHttpRequest = {
    headers: { userId },
    query: {
        from: '2025-08-01',
        to: '2025-08-08',
    },
}

export const updateTransactionHttpRequest = {
    body: updateTransactionParams,
    params: { transactionId },
    headers: { userId },
}

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Cria uma transação no banco de dados para testes
 * @param customData - Dados customizados para sobrescrever os padrões
 * @returns Promise com a transação criada
 */
export const createTestTransaction = async (
    customData?: Partial<typeof createTransactionRepositoryResponse>,
) => {
    return await prisma.transaction.create({
        data: {
            ...createTransactionRepositoryResponse,
            ...customData,
        },
    })
}
