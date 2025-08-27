import { prisma } from '../../../../prisma/prisma'
export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId) {
        return prisma.transaction.findMany({ where: { user_id: userId } })
    }
}
//# sourceMappingURL=get-transactions-by-user-id.js.map
