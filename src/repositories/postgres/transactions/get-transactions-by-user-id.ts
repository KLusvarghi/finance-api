import { prisma } from '../../../../prisma/prisma'

import { TransactionRepositoryResponse } from '@/shared'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(
        userId: string,
    ): Promise<TransactionRepositoryResponse[]> {
        return prisma.transaction.findMany({ where: { user_id: userId } })
    }
}
