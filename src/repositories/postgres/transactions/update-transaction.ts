import {
    TransactionRepositoryResponse,
    UpdateTransactionParams,
} from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresUpdateTransactionRepository {
    async execute(
        transactionId: string,
        updateParams: UpdateTransactionParams,
    ): Promise<TransactionRepositoryResponse | null> {
        return await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updateParams,
        })
    }
}
