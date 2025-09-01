import { prisma } from '../../../../prisma/prisma'

import {
    CreateTransactionRepository,
    CreateTransactionServiceParams,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresCreateTransactionRepository
    implements CreateTransactionRepository
{
    async execute(
        createTransactionParams: CreateTransactionServiceParams & {
            id: string
        },
    ): Promise<TransactionRepositoryResponse> {
        const { userId, ...transactionData } = createTransactionParams
        return prisma.transaction.create({
            data: {
                ...transactionData,
                user: {
                    connect: { id: userId },
                },
            },
        })
    }
}
