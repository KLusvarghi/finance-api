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
            const { userId } = httpRequest.headers

            const userBalance = await this.getUserBalanceService.execute(userId)

            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }
            console.error(error)
            return serverError()
        }
    }
}
