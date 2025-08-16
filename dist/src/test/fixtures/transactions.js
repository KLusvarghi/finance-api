import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { userId } from './user';
import { prisma } from '../../../prisma/prisma';
export const transactionId = faker.string.uuid();
// ============================================================================
// PARAMS
// ============================================================================
export const createTransactionParams = {
    user_id: faker.string.uuid(),
    name: faker.lorem.words(3),
    amount: faker.number.int({ min: 1, max: 1000 }),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
};
export const updateTransactionParams = {
    name: faker.lorem.words(3),
    amount: faker.number.int({ min: 1, max: 1000 }),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
};
// ============================================================================
// SHARED DATA (Base para responses)
// ============================================================================
export const transactionResponse = {
    id: transactionId,
    user_id: createTransactionParams.user_id,
    name: createTransactionParams.name,
    amount: new Prisma.Decimal(createTransactionParams.amount),
    date: new Date(createTransactionParams.date),
    type: createTransactionParams.type,
};
export const transactionListResponse = [
    {
        id: faker.string.uuid(),
        user_id: userId,
        name: faker.lorem.words(3),
        amount: new Prisma.Decimal(faker.number.int({ min: 1, max: 1000 })),
        date: faker.date.recent(),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    },
];
// ============================================================================
// REPOSITORY RESPONSES
// ============================================================================
export const createTransactionRepositoryResponse = {
    id: transactionId,
    user_id: createTransactionParams.user_id,
    name: createTransactionParams.name,
    amount: new Prisma.Decimal(createTransactionParams.amount),
    date: new Date(createTransactionParams.date),
    type: createTransactionParams.type,
};
export const deleteTransactionRepositoryResponse = {
    id: transactionId,
    user_id: faker.string.uuid(),
    name: faker.lorem.words(3),
    amount: new Prisma.Decimal(faker.number.int({ min: 1, max: 1000 })),
    date: faker.date.recent(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
};
export const getTransactionByUserIdRepositoryResponse = transactionListResponse;
export const updateTransactionRepositoryResponse = {
    id: transactionId,
    user_id: faker.string.uuid(),
    name: updateTransactionParams.name || '',
    amount: new Prisma.Decimal(updateTransactionParams.amount || 0),
    date: new Date(updateTransactionParams.date || ''),
    type: updateTransactionParams.type,
};
// ============================================================================
// UNIFIED RESPONSES (Service + Controller)
// ============================================================================
const createTransactionResponse = transactionResponse;
const deleteTransactionResponse = deleteTransactionRepositoryResponse;
const getTransactionsByUserIdResponse = transactionListResponse;
const updateTransactionResponse = updateTransactionRepositoryResponse;
// ============================================================================
// LEGACY EXPORTS (Para manter compatibilidade)
// ============================================================================
// Service responses
export const createTransactionServiceResponse = createTransactionResponse;
export const deleteTransactionServiceResponse = deleteTransactionResponse;
export const getTransactionByUserIdServiceResponse = getTransactionsByUserIdResponse;
export const updateTransactionServiceResponse = updateTransactionResponse;
// Controller responses
export const createTransactionControllerResponse = createTransactionResponse;
export const deleteTransactionControllerResponse = deleteTransactionResponse;
export const getTransactionsByUserIdControllerResponse = getTransactionsByUserIdResponse;
export const updateTransactionControllerResponse = updateTransactionResponse;
// ============================================================================
// BASE HTTP REQUEST
// ============================================================================
export const createTransactionHttpRequest = {
    body: createTransactionParams,
};
export const deleteTransactionHttpRequest = {
    params: { transactionId },
};
export const getTransactionsByUserIdHttpRequest = {
    query: { userId },
};
export const updateTransactionHttpRequest = {
    params: { transactionId },
    body: updateTransactionParams,
};
// ============================================================================
// TEST HELPERS
// ============================================================================
/**
 * Cria uma transação no banco de dados para testes
 * @param customData - Dados customizados para sobrescrever os padrões
 * @returns Promise com a transação criada
 */
export const createTestTransaction = async (customData) => {
    return await prisma.transaction.create({
        data: {
            ...createTransactionRepositoryResponse,
            ...customData,
        },
    });
};
//# sourceMappingURL=transactions.js.map