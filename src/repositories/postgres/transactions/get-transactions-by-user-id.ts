import { prisma } from '../../../../prisma/prisma'

import {
    GetTransactionsByUserIdParams,
    GetTransactionsByUserIdRepository,
    TransactionRepositoryResponse,
} from '@/shared'
import { Prisma } from '@prisma/client'

export class PostgresGetTransactionsByUserIdRepository
    implements GetTransactionsByUserIdRepository
{
    async execute(params: GetTransactionsByUserIdParams): Promise<{
        transactions: TransactionRepositoryResponse[]
        nextCursor: string | null
    }> {
        const {
            userId,
            title,
            type,
            from,
            to,
            limit = 20, // Default limit
            cursor,
        } = params

        const itemsToFetch = limit + 1

        // Build the 'where' clause dynamically
        const where: Prisma.TransactionWhereInput = {
            userId,
        }

        if (title) {
            where.name = {
                contains: title,
                mode: 'insensitive',
            }
        }

        if (type) {
            where.type = type
        }

        if (from || to) {
            where.date = {}
            if (from) {
                where.date.gte = from instanceof Date ? from : new Date(from)
            }
            if (to) {
                // For "to" date, we want to include the entire day, so we set it to end of day
                const toDate = to instanceof Date ? to : new Date(to)
                toDate.setHours(23, 59, 59, 999)
                where.date.lte = toDate
            }
        }

        const items = await prisma.transaction.findMany({
            where,
            take: itemsToFetch,
            orderBy: [{ date: 'desc' }, { id: 'asc' }],
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        })

        let nextCursor: string | null = null

        // If we got more items than requested, there's a next page
        if (items.length > limit) {
            // The nextCursor is the ID of the last item in the current page
            nextCursor = items[limit - 1].id
        }

        const transactions = items.slice(0, limit)

        return {
            transactions,
            nextCursor,
        }
    }
}
