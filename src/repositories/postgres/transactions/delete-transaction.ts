import { prisma } from '../../../../prisma/prisma'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId: string) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        })

        if (!transaction) {
            return null
        }
        
        return await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        })
    }
}
