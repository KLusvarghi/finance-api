import { prisma } from '../../../../prisma/prisma'

import {
    GetTransactionsByUserIdRepository,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresGetTransactionsByUserIdRepository
    implements GetTransactionsByUserIdRepository
{
    // TODO: ver se é mais válido receber um objeto com os valores ou receber separados do jeito que está
    async execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<TransactionRepositoryResponse[]> {
        return prisma.transaction.findMany({
            where: {
                userId: userId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        })
    }
}
