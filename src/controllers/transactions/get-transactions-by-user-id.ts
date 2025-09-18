import { ok } from '../_helpers'

import { GetTransactionsByUserIdService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    PaginatedTransactionsResponse,
    UserIdRequestParams,
} from '@/shared'

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

        return ok(result)
    }
}
