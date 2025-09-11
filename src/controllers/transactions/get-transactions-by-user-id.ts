import { ok } from '../_helpers'

import {
    GetTransactionsByUserIdRequest,
    GetTransactionsByUserIdService,
    HeadersController,
    HttpResponse,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'

export class GetTransactionsByUserIdController
    implements
        HeadersController<UserIdRequestParams, TransactionPublicResponse[]>
{
    constructor(
        private readonly getTransactionByUserIdService: GetTransactionsByUserIdService,
    ) {}

    async execute(
        httpRequest: GetTransactionsByUserIdRequest,
    ): Promise<HttpResponse<TransactionPublicResponse[]>> {
        // Validation is now handled by middleware
        const { userId } = httpRequest.headers
        const { from, to } = httpRequest.query

        // Execute business logic - errors will be caught by error middleware
        const transactions = await this.getTransactionByUserIdService.execute(
            userId,
            from,
            to,
        )

        return ok(transactions)
    }
}
