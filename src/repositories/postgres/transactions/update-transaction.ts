import { prisma } from '../../../../prisma/prisma'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId: string, upadetParams: any) {
        return await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: upadetParams,
        })
    }
}
