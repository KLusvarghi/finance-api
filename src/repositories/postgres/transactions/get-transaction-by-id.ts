import { prisma } from '../../../../prisma/prisma'

import {
    GetTransactionByIdRepository,
    TransactionRepositoryResponse,
} from '@/shared'

export class PostgresGetTransactionByIdRepository
    implements GetTransactionByIdRepository
{
    async execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse | null> {
        return prisma.transaction.findUnique({ where: { id: transactionId } })
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresGetTransactionByIdRepository as GetTransactionByIdRepository }
