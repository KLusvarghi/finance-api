import { prisma } from '../../../../prisma/prisma'

import {
    GetTransactionsByUserIdRepository,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresGetTransactionsByUserIdRepository
    implements GetTransactionsByUserIdRepository
{
    async execute(userId: string): Promise<TransactionRepositoryResponse[]> {
        return prisma.transaction.findMany({ where: { userId: userId } })
    }
}
