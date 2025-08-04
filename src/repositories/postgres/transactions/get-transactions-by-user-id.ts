import { TransactionRepositoryResponse } from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(
        userId: string,
    ): Promise<TransactionRepositoryResponse[] | null> {
        return await prisma.transaction.findMany({
            where: {
                user_id: userId,
            },
        })
    }
}
