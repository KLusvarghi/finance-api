import {
    CreateTransactionParams,
    TransactionRepositoryResponse,
} from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresCreateTransactionRepository {
    async execute(
        createTransactionParams: CreateTransactionParams,
    ): Promise<TransactionRepositoryResponse> {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })
    }
}
