import { prisma } from '../../../../prisma/prisma'

import { TransactionRepositoryResponse } from '@/shared'

export class PostgresGetTransactionByIdRepository {
    async execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse | null> {
        return prisma.transaction.findUnique({ where: { id: transactionId } })
    }
}
