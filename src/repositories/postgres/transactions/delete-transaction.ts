import { TransactionRepositoryResponse } from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresDeleteTransactionRepository {
    async execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse | null> {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        })

        if (!transaction) {
            // TODO: retornar um erro de transação não encontrada (criar essa classe)
            return null
        }

        return await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        })
    }
}
