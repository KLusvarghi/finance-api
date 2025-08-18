import { prisma } from '../../../../prisma/prisma'

import {
    CreateTransactionParams,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresCreateTransactionRepository {
    async execute(
        createTransactionParams: CreateTransactionParams & { id: string },
    ): Promise<TransactionRepositoryResponse> {
        return prisma.transaction.create({ data: createTransactionParams })
    }
}
