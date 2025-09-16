import { ok } from '../_helpers'

import { GetTransactionsByUserIdService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'

// Local interfaces - used only by this controller
interface GetTransactionsByUserIdRequest extends HttpRequest {
    headers: UserIdRequestParams
    query: {
        from: string
        to: string
    }
}

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
