import { ok } from '../_helpers'

import { GetUserBalanceService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    UserBalanceRepositoryResponse,
    UserIdRequestParams,
} from '@/shared'

// Local interfaces - used only by this controller
interface GetUserBalanceRequest extends HttpRequest {
    headers: UserIdRequestParams
    query: {
        from: string
        to: string
    }
}

export class GetUserBalanceController
    implements
        HeadersController<UserIdRequestParams, UserBalanceRepositoryResponse>
{
    constructor(
        private readonly getUserBalanceService: GetUserBalanceService,
    ) {}

    async execute(
        httpRequest: GetUserBalanceRequest,
    ): Promise<HttpResponse<UserBalanceRepositoryResponse>> {
        // Validation is now handled by middleware
        const { userId } = httpRequest.headers
        const { from, to } = httpRequest.query

        // Execute business logic - errors will be caught by error middleware
        const userBalance = await this.getUserBalanceService.execute(
            userId,
            from,
            to,
        )

        return ok(userBalance)
    }
}
