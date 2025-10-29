import { cache } from '@/adapters'
import { GetTransactionsByUserIdService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    PaginatedTransactionsResponse,
    UserIdRequestParams,
} from '@/shared'

import { ok } from '../_helpers'

interface GetTransactionsByUserIdQuery {
    title?: string
    type?: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
    from?: Date
    to?: Date
    limit: number
    cursor?: string
}

interface GetTransactionsByUserIdRequest extends HttpRequest {
    headers: UserIdRequestParams
    query: GetTransactionsByUserIdQuery
}

export class GetTransactionsByUserIdController
    implements
        HeadersController<UserIdRequestParams, PaginatedTransactionsResponse>
{
    constructor(
        private readonly getTransactionByUserIdService: GetTransactionsByUserIdService,
    ) {}

    async execute(
        httpRequest: GetTransactionsByUserIdRequest,
    ): Promise<HttpResponse<PaginatedTransactionsResponse>> {
        // Validation and type coercion are handled by Zod middleware
        const { userId } = httpRequest.headers
        const { title, type, from, to, limit, cursor } = httpRequest.query

        // Generate cache key based on userId and query parameters
        const cacheKey = this.generateCacheKey(userId, {
            title,
            type,
            from,
            to,
            limit,
            cursor,
        })
        console.log('INFO: Generated cache key:', cacheKey)

        // Try to get data from cache first
        const cachedResult =
            await cache.get<PaginatedTransactionsResponse>(cacheKey)

        if (cachedResult) {
            console.log('INFO: Cache HIT! Returning cached data.')
            return ok(cachedResult)
        }

        console.log('INFO: Cache MISS! Fetching from database.')
        // Execute business logic - errors will be caught by error middleware
        const result = await this.getTransactionByUserIdService.execute({
            userId,
            title,
            type,
            from,
            to,
            limit,
            cursor,
        })

        // Store result in cache
        await cache.set(cacheKey, result)
        console.log('INFO: Data stored in cache.')

        return ok(result)
    }

    private generateCacheKey(
        userId: string,
        query: GetTransactionsByUserIdQuery,
    ): string {
        const { title, type, from, to, limit, cursor } = query
        const queryString = JSON.stringify({
            title: title || '',
            type: type || '',
            from: from
                ? from instanceof Date
                    ? from.toISOString()
                    : String(from)
                : '',
            to: to ? (to instanceof Date ? to.toISOString() : String(to)) : '',
            limit,
            cursor: cursor || '',
        })
        return `transactions:user:${userId}:${Buffer.from(queryString).toString('base64')}`
    }
}
