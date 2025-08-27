import { prisma } from '../../../../prisma/prisma'
import { TransactionNotFoundError } from '@/errors'
import { Prisma } from '@prisma/client'
export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
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
//# sourceMappingURL=delete-transaction.js.map
