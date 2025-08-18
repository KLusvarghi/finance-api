import { prisma } from '../../../../prisma/prisma'

import { TransactionNotFoundError } from '@/errors'
import { TransactionRepositoryResponse } from '@/shared'
import { Prisma } from '@prisma/client'

export class PostgresDeleteTransactionRepository {
    async execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse> {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            })
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new TransactionNotFoundError(transactionId)
            }
            throw error
        }
    }
}
