import { ok } from '../_helpers'

import { GetTransactionsByUserIdService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    PaginatedTransactionsResponse,
    UserIdRequestParams,
} from '@/shared'

export class GetTransactionsByUserIdController
    implements
        HeadersController<UserIdRequestParams, PaginatedTransactionsResponse>
{
    constructor(
        private readonly getTransactionByUserIdService: GetTransactionsByUserIdService,
    ) {}

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<PaginatedTransactionsResponse>> {
        // Validation and type coercion are handled by Zod middleware
        const { userId } = httpRequest.headers
        const { title, type, startDate, endDate, limit, cursor } =
            httpRequest.query

        // Execute business logic - errors will be caught by error middleware
        const result = await this.getTransactionByUserIdService.execute({
            userId,
            title,
            type,
            startDate,
            endDate,
            limit,
            cursor,
        })

        return ok(result)
    }
}
