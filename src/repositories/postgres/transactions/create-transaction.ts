import { prisma } from '../../../../prisma/prisma'
import { Prisma } from '@prisma/client'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams: Prisma.TransactionCreateInput) {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })
    }
}
