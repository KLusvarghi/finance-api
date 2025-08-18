import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userIdMissingResponse,
    userNotFoundResponse,
} from '../_helpers'

import { UserNotFoundError } from '@/errors'
import {
    Controller,
    GetUserBalanceRequest,
    GetUserBalanceService,
    HttpRequest,
    HttpResponse,
    UserBalanceRepositoryResponse,
} from '@/shared'

export class GetUserBalanceController
    // implements Controller<GetUserBalanceRequest, UserBalanceRepositoryResponse>
{
    private getUserBalanceService: GetUserBalanceService

    constructor(getUserBalanceService: GetUserBalanceService) {
        this.getUserBalanceService = getUserBalanceService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<UserBalanceRepositoryResponse>> {
        try {
            const userId = (httpRequest.params as { userId: string }).userId
            if (!userId) {
                return userIdMissingResponse()
            }

            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }

            const userBalance = await this.getUserBalanceService.execute(userId)

            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
