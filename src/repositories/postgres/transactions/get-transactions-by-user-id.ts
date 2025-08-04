import { prisma } from '../../../../prisma/prisma'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId: string) {
        return await prisma.transaction.findMany({
            where: {
                user_id: userId,
            },
        })
    }
}
