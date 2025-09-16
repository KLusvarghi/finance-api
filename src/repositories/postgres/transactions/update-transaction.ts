import { prisma } from '../../../../prisma/prisma'

import { TransactionNotFoundError } from '@/errors'
import {
    TransactionRepositoryResponse,
    UpdateTransactionParams,
    UpdateTransactionRepository,
} from '@/shared'
import { Prisma } from '@prisma/client'

export class PostgresUpdateTransactionRepository
    implements UpdateTransactionRepository
{
    async execute(
        transactionId: string,
        updateParams: UpdateTransactionParams,
    ): Promise<TransactionRepositoryResponse> {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                    deletedAt: null,
                },
                data: updateParams,
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
export { PostgresUpdateTransactionRepository as UpdateTransactionRepository }
