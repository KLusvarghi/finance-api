import { prisma } from '../../../../prisma/prisma'

import {
    CreateTransactionParams,
    CreateTransactionRepository,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresCreateTransactionRepository
    implements CreateTransactionRepository
{
    async execute(
        createTransactionParams: CreateTransactionParams & { id: string },
    ): Promise<TransactionRepositoryResponse> {
        return prisma.transaction.create({ data: createTransactionParams })
    }
}
