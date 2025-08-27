import { prisma } from '../../../../prisma/prisma'
import { TransactionNotFoundError } from '@/errors'
import { Prisma } from '@prisma/client'
export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
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
//# sourceMappingURL=update-transaction.js.map
