import { ok } from '../_helpers'

import {
    GetUserBalanceRequest,
    GetUserBalanceService,
    HeadersController,
    HttpResponse,
    UserBalanceRepositoryResponse,
    UserIdRequestParams,
} from '@/shared'

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
