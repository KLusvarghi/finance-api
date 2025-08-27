import { prisma } from '../../../../prisma/prisma'
export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        return prisma.transaction.create({ data: createTransactionParams })
    }
}
//# sourceMappingURL=create-transaction.js.map
