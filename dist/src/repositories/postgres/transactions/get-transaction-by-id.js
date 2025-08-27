import { prisma } from '../../../../prisma/prisma'
export class PostgresGetTransactionByIdRepository {
    async execute(transactionId) {
        return prisma.transaction.findUnique({ where: { id: transactionId } })
    }
}
//# sourceMappingURL=get-transaction-by-id.js.map
