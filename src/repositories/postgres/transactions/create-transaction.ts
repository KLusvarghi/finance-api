import {
    CreateTransactionParams,
    TransactionPublicResponse,
} from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresCreateTransactionRepository {
    async execute(
        createTransactionParams: CreateTransactionParams & { id: string },
    ): Promise<TransactionPublicResponse> {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })
    }
}
