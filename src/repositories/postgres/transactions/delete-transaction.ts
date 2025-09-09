import { prisma } from '../../../../prisma/prisma'

import { TransactionNotFoundError } from '@/errors'
import {
    DeleteTransactionRepository,
    TransactionRepositoryResponse,
} from '@/shared'
import { Prisma } from '@prisma/client'

export class PostgresDeleteTransactionRepository
    implements DeleteTransactionRepository
{
    async execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse> {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                    deletedAt: null,
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
