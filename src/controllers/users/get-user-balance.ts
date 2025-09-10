import { notFoundResponse, ok, serverError } from '../_helpers'

import { UserNotFoundError } from '@/errors'
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
        try {
            // Validation is now handled by middleware
            const { userId } = httpRequest.headers
            const { from, to } = httpRequest.query

            const userBalance = await this.getUserBalanceService.execute(
                userId,
                from,
                to,
            )

            return ok(userBalance)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }

            return serverError()
        }
    }
}
