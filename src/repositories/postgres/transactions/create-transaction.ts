import {
    CreateTransactionParamsProps,
    TransactionRepositoryResponse,
} from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresCreateTransactionRepository {
    async execute(
        createTransactionParams: CreateTransactionParamsProps & { id: string },
    ): Promise<TransactionRepositoryResponse> {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })
    }
}
