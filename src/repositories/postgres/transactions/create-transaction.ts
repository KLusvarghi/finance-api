import { prisma } from '../../../../prisma/prisma'

import {
    CreateTransactionRepository,
    CreateTransactionRepositoryParams,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresCreateTransactionRepository
    implements CreateTransactionRepository
{
    async execute(
        createTransactionParams: CreateTransactionRepositoryParams,
    ): Promise<TransactionRepositoryResponse> {
        const { userId, ...transactionData } = createTransactionParams
        return prisma.transaction.create({
            data: {
                ...transactionData,
                userId: userId,
            },
        })
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresCreateTransactionRepository as CreateTransactionRepository }
