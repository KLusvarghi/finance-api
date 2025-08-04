import { UserNotFoundError } from '@/errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../_helpers'
import {
    GetUserBalanceService,
    UserBalanceRepositoryResponse,
    HttpResponse,
    HttpRequest,
} from '@/shared/types'

export class GetUserBalanceController {
    private getUserBalanceService: GetUserBalanceService

    constructor(getUserBalanceService: GetUserBalanceService) {
        this.getUserBalanceService = getUserBalanceService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<UserBalanceRepositoryResponse>> {
        try {
            const userId = httpRequest.params.userId

            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }

            const userBalance = await this.getUserBalanceService.execute({
                userId,
            })

            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
