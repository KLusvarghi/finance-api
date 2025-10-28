import { Prisma } from '@prisma/client'

import { TransactionNotFoundError } from '@/errors'
import {
    DeleteTransactionRepository,
    TransactionRepositoryResponse,
} from '@/shared'

import { prisma } from '../../../../prisma/prisma'

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

// Alias para manter compatibilidade com as importações
export { PostgresDeleteTransactionRepository as DeleteTransactionRepository }
